import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/check-admin-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Store the timestamp when admin logged in
        localStorage.setItem('adminLoginTime', Date.now());

        Navigate('/admin'); // Redirect to admin page
      } else {
        setErrorMessage('Incorrect email or password');
      }
    } catch (error) {
      console.error('Error checking admin authentication:', error);
    }
  };

  return (
    <div className='admin-login-page'>
      <div className="login-admin">
        <div className="admin-login-container">
          <h2 className="admin-login-title">Admin Login</h2>
          <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label className="admin-form-label">Email</label>
              <input
                type="email"
                className="admin-form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Password</label>
              <input
                type="password"
                className="admin-form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="admin-btn-login">
              Login
            </button>
            {errorMessage && <p className="admin-error-message">{errorMessage}</p>}
          </form>
        </div>
      </div>

    </div>
  );
}

export default AdminLogin;
