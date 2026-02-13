import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import UserForm from './UserForm';
import { fetchUserById, updateUser } from './services/userServices';

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchUserById(id);
        setUser(data);
      } catch (err) {
        setError(err.message || 'Unable to load user.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleSubmit = async (payload) => {
    if (!payload.username || !payload.email) {
      setError('Please fill in username and email.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await updateUser(id, payload);
      navigate(`/users/${id}`);
    } catch (err) {
      setError(err.message || 'Unable to update user.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center text-muted py-4">Loading user...</div>;
  }

  return (
    <section className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center gap-3">
        <div>
          <h1 className="h2 fw-bold mb-1">Edit user</h1>
          <p className="text-muted mb-0">Update user profile details.</p>
        </div>
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-secondary" to={`/users/${id}`}>
            Cancel
          </Link>
          <Link className="btn btn-outline-secondary" to={isAdmin ? '/users' : '/tasks'}>
            {isAdmin ? 'Back to users' : 'Back to tasks'}
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {user && (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <UserForm
              initialValues={user}
              submitLabel={submitting ? 'Saving...' : 'Save changes'}
              onSubmit={handleSubmit}
              onCancel={() => navigate(`/users/${id}`)}
              loading={submitting}
              requirePassword={false}
              includeRole={isAdmin}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default EditUserPage;
