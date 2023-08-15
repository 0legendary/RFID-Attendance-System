import React from 'react'
import { useState } from 'react';

function LoginPage() {


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    // Handle login logic
    console.log('User Logged In:', name, email);
  };

  return (
    <div className='login-bg'>
      <div className="user-login">
      <div className="login-container">
        <h2>Login</h2>
        <form>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="login-button" onClick={handleLogin}>
            Log In
          </button>
        </form>
      </div>
    </div>

    </div>
  )
}

export default LoginPage