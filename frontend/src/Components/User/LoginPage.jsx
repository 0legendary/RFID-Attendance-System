import React, { useState} from 'react'
import { useNavigate } from 'react-router-dom';



function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");


  const handleLogin = async (e) => {
    e.preventDefault()
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
        if (data) {
         

          navigate('/home', { state: { data } });
          console.log(data);
        }

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
    <div className='user-login-page'>
      <div className="login-background">
        <div className="shape"></div>
        <div className="shape round"></div>
        <form className="login-form" onSubmit={handleLogin}>
          <h3>Login Here</h3>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Email or Phone"
            id="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className='login-button'>Log In</button>
          <div className="social">
            <div className="go">
              <i className="fab fa-google"></i> Google
            </div>
            <div className="fb">
              <i className="fab fa-facebook"></i> Facebook
            </div>
          </div>
        </form>
      </div>
    </div>


  )
}

export default LoginPage