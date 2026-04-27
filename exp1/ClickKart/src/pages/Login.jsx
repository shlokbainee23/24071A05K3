import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [alert, setAlert] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const isLogin = mode === 'login';

    if (!form.email.trim() || !form.password.trim()) {
      setAlert({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setAlert({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    if (form.password.length < 4) {
      setAlert({ type: 'error', text: 'Password must be at least 4 characters.' });
      return;
    }
    if (!isLogin && !form.name.trim()) {
      setAlert({ type: 'error', text: 'Please enter your full name.' });
      return;
    }

    if (isLogin) {
      login({ name: form.name, email: form.email });
      setAlert({ type: 'success', text: 'Logged in! Redirecting…' });
    } else {
      register({ name: form.name, email: form.email });
      setAlert({ type: 'success', text: 'Account created! Redirecting…' });
    }

    window.setTimeout(() => navigate('/'), 900);
  }

  return (
    <div className="page">
      <section className="auth">
        <div className="auth__card">
          <div className="auth__tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              className={'auth__tab' + (mode === 'login' ? ' auth__tab--active' : '')}
              onClick={() => { setMode('login'); setAlert(null); }}
            >
              Login
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              className={'auth__tab' + (mode === 'register' ? ' auth__tab--active' : '')}
              onClick={() => { setMode('register'); setAlert(null); }}
            >
              Register
            </button>
          </div>

          <h1 className="auth__title">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="auth__subtitle">
            {mode === 'login'
              ? 'Sign in to continue shopping with ClickKart.'
              : 'Join ClickKart to save your cart and unlock loyalty discounts.'}
          </p>

          {alert && (
            <div className={'alert alert--' + alert.type} role="status">
              {alert.text}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {mode === 'register' && (
              <div className="field">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  required
                />
              </div>
            )}
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@clickkart.com"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn btn--primary btn--lg auth__cta">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="auth__footer">
            {mode === 'login' ? (
              <>
                New to ClickKart?{' '}
                <button type="button" className="link" onClick={() => setMode('register')}>
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" className="link" onClick={() => setMode('login')}>
                  Sign in instead
                </button>
              </>
            )}
          </p>
        </div>
      </section>
    </div>
  );
}
