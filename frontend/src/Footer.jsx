import React from 'react';

const Footer = () => {
  return (
    <footer className="border-top bg-white py-3">
      <div className="container text-center text-muted">
        <small>&copy; {new Date().getFullYear()} Task Manager. All rights reserved.</small>
      </div>
    </footer>
  );
};

export default Footer;
