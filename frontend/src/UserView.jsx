import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { deleteUser, fetchUserById } from './services/userServices';

const UserView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAdmin } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const isSelf = currentUser?.id === id;

  const socialLinks = useMemo(() => {
    if (!user) return [];

    return [
      { key: 'linkedin', icon: 'bi-linkedin', label: 'LinkedIn', href: user.social?.linkedin },
      { key: 'github', icon: 'bi-github', label: 'GitHub', href: user.social?.github },
      { key: 'leetcode', icon: 'bi-code-square', label: 'LeetCode', href: user.social?.leetcode },
      { key: 'website', icon: 'bi-globe2', label: 'Website', href: user.social?.website },
    ].filter((link) => Boolean(link.href));
  }, [user]);

  const missingAvatar = !user?.avatarUrl;
  const missingSocials = socialLinks.length === 0;

  useEffect(() => {
    const loadUser = async () => {
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

    loadUser();
  }, [id]);

  const handleDelete = async () => {
    if (!user || !isAdmin) return;

    try {
      setBusy(true);
      setError('');
      await deleteUser(user._id);
      navigate('/users');
    } catch (err) {
      setError(err.message || 'Unable to delete user.');
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="text-center text-muted py-4">Loading user...</div>;
  }

  if (!user) {
    return <div className="alert alert-warning">User not found.</div>;
  }

  return (
    <section className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
        <div>
          <h1 className="h2 fw-bold mb-1">User details</h1>
          <p className="text-muted mb-0">Review and manage the selected user account.</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Link className="btn btn-outline-secondary" to={isAdmin ? '/users' : '/tasks'}>
            {isAdmin ? 'Back to users' : 'Back to tasks'}
          </Link>
          {(isAdmin || isSelf) && (
            <Link className="btn btn-outline-secondary" to={`/users/${user._id}/edit`}>
              Edit user
            </Link>
          )}
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {(missingAvatar || missingSocials) && (isAdmin || isSelf) && (
        <div className="alert alert-info d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
          <div>
            {missingAvatar && missingSocials && (
              <span>No profile photo or social links yet. Add them to complete this profile.</span>
            )}
            {missingAvatar && !missingSocials && (
              <span>No profile photo uploaded yet. Add one to complete this profile.</span>
            )}
            {!missingAvatar && missingSocials && (
              <span>No social links added yet. Add them to complete this profile.</span>
            )}
          </div>
          <Link className="btn btn-sm btn-outline-primary" to={`/users/${user._id}/edit`}>
            Update profile
          </Link>
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body d-flex flex-column gap-3">
          <div className="d-flex align-items-center gap-3">
            <img
              src={user.avatarUrl || 'https://placehold.co/96x96/png?text=User'}
              alt={`${user.username} profile`}
              className="rounded-circle border"
              style={{ width: '96px', height: '96px', objectFit: 'cover' }}
            />
            <div>
              <h3 className="h4 mb-1">{user.username}</h3>
              <p className="text-muted mb-0">{user.email}</p>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <span className={`badge ${user.role === 'admin' ? 'text-bg-danger' : 'text-bg-secondary'}`}>
              Role: {user.role}
            </span>
          </div>

          <div>
            <h4 className="h6 mb-2">Social links</h4>
            {socialLinks.length ? (
              <div className="d-flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.key}
                    className="btn btn-outline-primary"
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className={`bi ${link.icon} me-2`} />
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-0">No social links added.</p>
            )}
          </div>

          <div className="d-flex gap-2 flex-wrap justify-content-end">
            <Link className="btn btn-outline-secondary" to="/tasks">
              Go to tasks
            </Link>
            {isAdmin && (
              <button type="button" className="btn btn-outline-danger" disabled={busy} onClick={handleDelete}>
                Delete user
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="profile-cards">
        <div className="profile-mini-card red">
          <p className="tip">Role</p>
          <p className="second-text text-capitalize">{user.role}</p>
        </div>
        <div className="profile-mini-card blue">
          <p className="tip">Social Links</p>
          <p className="second-text">{socialLinks.length}</p>
        </div>
        <div className="profile-mini-card green">
          <p className="tip">Profile</p>
          <p className="second-text">{missingAvatar ? 'Incomplete' : 'Ready'}</p>
        </div>
      </div>
    </section>
  );
};

export default UserView;
