import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">Task Manager</div>
      <nav>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">Tasks</a></li>
          <li><a href="#">Profile</a></li>
          <li><a href="#" className="login-btn">Login</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;