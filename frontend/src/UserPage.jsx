import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserForm from './UserForm';
import UserList from './UserList';
import { createUser, fetchUsers } from './services/userServices';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formKey, setFormKey] = useState(0);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetchUsers();
      setUsers(response.items || []);
    } catch (err) {
      setError(err.message || 'Unable to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (payload) => {
    if (!payload.username || !payload.email || !payload.password) {
      setError('Please fill in username, email, and password.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const newUser = await createUser(payload);
      setUsers((prev) => [newUser, ...prev]);
      setFormKey((prev) => prev + 1);
    } catch (err) {
      setError(err.message || 'Unable to create user.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUserDeleted = (userId) => {
    setUsers((prev) => prev.filter((user) => user._id !== userId));
  };

  return (
    <section className="d-flex flex-column gap-4">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-3">
        <div>
          <h1 className="h2 fw-bold mb-1">Users</h1>
          <p className="text-muted mb-0">Manage account owners and assign them to tasks.</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge text-bg-primary align-self-start">Total users: {users.length}</span>
          <Link className="btn btn-outline-light bg-primary" to="/tasks">
            View tasks
          </Link>
          <button type="button" className="btn btn-outline-secondary" onClick={loadUsers}>
            Refresh
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <UserForm
            key={formKey}
            submitLabel={submitting ? 'Creating...' : 'Create user'}
            onSubmit={handleCreateUser}
            loading={submitting}
            includeRole
            requirePassword
          />
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center text-muted py-4">Loading users...</div>
      ) : (
        <UserList users={users} onUserDeleted={handleUserDeleted} onError={setError} />
      )}
    </section>
  );
};

export default UserPage;
