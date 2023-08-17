import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function CardforNewUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const userData = location.state.userData;

  useEffect(() => {
    // Fetch initial user data from the backend when the component mounts
    fetch(`http://localhost:4000/get-user-data?uid=${userData.uid}`)
      .then((response) => response.json())
      .then((data) => {
        setName(data.name);
        setEmail(data.email);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [userData.uid]);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert password to bcrypt format and send form data to backend
    try {
      const response = await fetch("http://localhost:4000/register-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: userData.uid,
          identifier: userData.identifier,
          name,
          email,
          password,
          tokens: 0,
          
        }),
      });

      if (response.ok) {
        console.log("User data submitted successfully");
        // Perform any further actions or show success message to user
      } else {
        console.error("Failed to submit user data");
        // Handle error or show error message to user
      }
    } catch (error) {
      console.error("An error occurred while submitting user data:", error);
      // Handle error or show error message to user
    }
  };

  return (
    <div className="dark-mode">
      <div className="uid-creation-form">
        <h2>Create User</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="uid">UID3:</label>
          <input type="text" id="uid" value={userData.uid} readOnly />

          <label htmlFor="identifier">Card Identifier:</label>
          <input type="text" id="identifier" value={userData.identifier} readOnly />

          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" onClick={handlePasswordToggle}>
            {showPassword ? 'Hide Password' : 'Show Password'}
          </button>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default CardforNewUser;
