import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function UIDCreationForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uidFromQuery, setUidFromQuery] = useState('');

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const uid = queryParams.get('uid');
    setUidFromQuery(uid);
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/register-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: uidFromQuery,
          name,
          email,
          password,
        }),
      });

      if (response.ok) {
        console.log('User created successfully');
        // Perform any further actions or show success message to the user
      } else {
        console.error('Failed to create user');
        // Handle error or show an error message to the user
      }
    } catch (error) {
      console.error('An error occurred while creating the user:', error);
      // Handle error or show an error message to the user
    }
  };

  return (
    <div>
      <div className="uid-creation-form">
        <h2>Create UID</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="uid">UID: </label>
          <input type="text" id="uid" value={uidFromQuery || ''} readOnly />

          {/* Rest of the form */}
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
}

export default UIDCreationForm;
