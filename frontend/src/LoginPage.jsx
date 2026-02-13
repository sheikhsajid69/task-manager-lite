import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = location.state?.from?.pathname || '/tasks';

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Email and passcode are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await signIn({ email: email.trim(), password: password.trim() });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page d-flex justify-content-center">
      <div className="card border-0 shadow-sm w-100 auth-panel">
        <div className="card-body p-4 p-md-5">
          <h1 className="h3 fw-bold mb-1">Sign in</h1>
          <p className="text-muted mb-4">Use your email and passcode to continue.</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form className="auth-skew-form" onSubmit={handleSubmit}>
            <ul className="auth-skew-list">
              <li style={{ '--i': 3 }}>
                <input
                  aria-label="Email"
                  className="auth-skew-input"
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                />
              </li>
              <li style={{ '--i': 2 }}>
                <input
                  aria-label="Password"
                  className="auth-skew-input"
                  type="password"
                  placeholder="Passcode"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                />
              </li>
              <li style={{ '--i': 1 }}>
                <button type="submit" className="auth-skew-button" disabled={submitting}>
                  {submitting ? 'Signing in...' : 'Sign in'}
                </button>
              </li>
            </ul>
          </form>

          <p className="text-muted mt-3 mb-0">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
