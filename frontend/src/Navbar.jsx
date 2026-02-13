import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, signOut } = useAuth();
  const logoSrc = 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Windows_Task_Manager_Icon_%282024%29.png';

  if (!isAuthenticated) {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark app-header shadow-sm fixed-top">
        <div className="container">
          <NavLink className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/login">
            <img src={logoSrc} alt="Task Manager logo" className="app-logo" />
            <span>Task Manager</span>
          </NavLink>
          <div className="d-flex align-items-center gap-2">
            <NavLink to="/login" className="btn btn-outline-light">Sign in</NavLink>
            <NavLink to="/signup" className="btn btn-light">Sign up</NavLink>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark app-header shadow-sm fixed-top">
      <div className="container">
        <NavLink className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/tasks">
          <img src={logoSrc} alt="Task Manager logo" className="app-logo" />
          <span>Task Manager</span>
        </NavLink>
        <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">
          <NavLink
            to="/tasks"
            className={({ isActive }) => `btn ${isActive ? 'btn-light' : 'btn-outline-light'}`}
          >
            Tasks
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `btn ${isActive ? 'btn-light' : 'btn-outline-light'}`}
            >
              Admin
            </NavLink>
          )}
          {user?.id && (
            <NavLink
              to={`/users/${user.id}`}
              className={({ isActive }) => `btn ${isActive ? 'btn-light' : 'btn-outline-light'}`}
            >
              My Profile
            </NavLink>
          )}
          <button
            type="button"
            className="btn btn-outline-light"
            onClick={async () => {
              await signOut();
              navigate('/login', { replace: true });
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
