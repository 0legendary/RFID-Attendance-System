import React,{ useState } from 'react'



function LoginPage() {


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");


  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message); // Display success message as a browser alert
      } else if (response.status === 404) {
        alert('User not found'); // Display error message as a browser alert
      } else if (response.status === 401) {
        alert('Invalid password'); // Display error message as a browser alert
      } else {
        alert('Login failed'); // Display general error message as a browser alert
      }


    } catch (error) {
      console.error('An error occurred while logging in:', error);
    }
  };

  return (
    <div className='login-bg'>
      <div className="user-login">
      <div className="login-container">
        <h2>Login</h2>
        <form>
          
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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