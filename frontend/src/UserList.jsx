import React from 'react';
import { Link } from 'react-router-dom';
import { deleteUser } from './services/userServices';

const UserList = ({ users, onUserDeleted, onError }) => {
  if (!users.length) {
    return <div className="text-center text-muted py-4">No users yet. Add one above.</div>;
  }

  return (
    <div className="row g-3">
      {users.map((user) => (
        <div key={user._id} className="col-sm-6 col-xl-4">
          <div className="tm-card h-100">
            <div className="tm-card-top">
              <div className="tm-card-bar" />
              <div className="tm-card-icons">
                <span className="tm-icon-bubble"><i className="bi bi-person-badge" /></span>
                <span className="tm-icon-bubble"><i className="bi bi-shield-check" /></span>
              </div>
            </div>
            <div className="tm-card-body d-flex flex-column justify-content-between gap-3">
              <div>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <img
                    src={user.avatarUrl || 'https://placehold.co/48x48/png?text=U'}
                    alt={`${user.username} avatar`}
                    className="rounded-circle border"
                    style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                  />
                  <div>
                    <h5 className="mb-0">{user.username}</h5>
                    <small className="text-muted">{user.email}</small>
                  </div>
                </div>
                <span className={`badge ${user.role === 'admin' ? 'text-bg-danger' : 'text-bg-secondary'}`}>
                  {user.role}
                </span>
              </div>

              <div className="d-flex flex-wrap gap-2 justify-content-end">
                <Link className="btn btn-outline-secondary btn-sm" to={`/users/${user._id}`}>
                  View
                </Link>
                <Link className="btn btn-outline-secondary btn-sm" to={`/users/${user._id}/edit`}>
                  Edit
                </Link>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={async () => {
                    try {
                      await deleteUser(user._id);
                      onUserDeleted(user._id);
                    } catch (error) {
                      onError?.(error.message || 'Unable to delete user.');
                    }
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
