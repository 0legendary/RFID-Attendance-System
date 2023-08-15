import React, { useState,useEffect } from 'react';

function UserRegistration() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rfidId, setRfidId] = useState('');
  const [rfidUID, setRfidUID] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', name, email, rfidId);
  };


  useEffect(() => {
    const fetchRFIDUID = async () => {
      try {
        const response = await fetch('http://localhost:3001/admin/rfid', {
          method: 'POST',
        });
        const data = await response.json();
        setRfidUID(data.uid);
      } catch (error) {
        console.error('Error fetching RFID UID:', error);
      }
    };

    // Fetch RFID UID when the component mounts
    fetchRFIDUID();

    // Listen for RFID UID updates
    const interval = setInterval(fetchRFIDUID, 1000); // Fetch every 1 second
    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);


  return (
    <div>
      <div className="register-student-bg">
        <div className="register-student-form">
          <h2>Register New Student</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="rfidId">RFID Card ID</label>
              <input
                type="text"
                id="rfidId"
                value={rfidId}
                onChange={(e) => setRfidId(e.target.value)}
              />

            </div>


            <div>
            {rfidUID && <h1>RFID UID: {rfidUID}</h1>}
          </div>


            <button type="submit" className="submit-button">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserRegistration;
