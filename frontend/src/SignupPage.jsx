import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Username, email, and passcode are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await signUp({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
      });
      navigate('/tasks', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to sign up.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page d-flex justify-content-center">
      <div className="card border-0 shadow-sm w-100 auth-panel">
        <div className="card-body p-4 p-md-5">
          <h1 className="h3 fw-bold mb-1">Create account</h1>
          <p className="text-muted mb-4">Register with email and passcode.</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form className="auth-skew-form" onSubmit={handleSubmit}>
            <ul className="auth-skew-list">
              <li style={{ '--i': 4 }}>
                <input
                  aria-label="Username"
                  className="auth-skew-input"
                  placeholder="Username"
                  value={form.username}
                  onChange={(event) => handleChange('username', event.target.value)}
                  autoComplete="username"
                />
              </li>
              <li style={{ '--i': 3 }}>
                <input
                  aria-label="Email"
                  className="auth-skew-input"
                  type="email"
                  placeholder="E-mail"
                  value={form.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  autoComplete="email"
                />
              </li>
              <li style={{ '--i': 2 }}>
                <input
                  aria-label="Password"
                  className="auth-skew-input"
                  type="password"
                  placeholder="Passcode"
                  value={form.password}
                  onChange={(event) => handleChange('password', event.target.value)}
                  autoComplete="new-password"
                />
              </li>
              <li style={{ '--i': 1 }}>
                <button type="submit" className="auth-skew-button" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Sign up'}
                </button>
              </li>
            </ul>
          </form>

          <p className="text-muted mt-3 mb-0">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
