import React,{ useState } from 'react'
import {useNavigate } from 'react-router-dom';



function LoginPage() {
  const navigate=useNavigate();

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



      // if (response.ok) {
      //   const data = await response.json();
        
      //   if (data.user) {
      //     // Navigate to "/home" when user data exists
      //     navigate.push('/home');
      //   } else {
      //     // Handle the case where the user data doesn't exist
      //     alert('User not found');
      //   }
      // } else {
      //   alert('Login failed');
      // }

      if (response.ok) {
        const data = await response.json();
        if(data){
          navigate('/home', { state: { data } });
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
    <div className='login-bg'>
      <div className="user-login">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          
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
          <button className="login-button" >
            Log In
          </button>
        </form>
      </div>
    </div>
    </div>
  )
}

export default LoginPage