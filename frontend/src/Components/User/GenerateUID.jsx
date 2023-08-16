import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GenerateUID() {
  const [uid, setUid] = useState('');
  const navigate = useNavigate();

  const generateCodeAndSendToBackend = async () => {
    const newUid = Math.floor(Math.random() * 90000) + 10000;
    setUid(newUid);

    try {
      const response = await fetch('http://localhost:4000/submit-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: newUid }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('data: ' + data);

        if (data.uid) {
          navigate('/admin/new-user');
        } else {
          navigate(`/admin/new-card?uid=${data.uid}`);
        }
      } else {
        console.error('Failed to send code to backend');
      }
    } catch (error) {
      console.error('An error occurred while sending the code:', error);
    }
  };

  return (
    <div>
      <div>
        <h1>5-Digit Code Generator</h1>
        <p>Generated Code: {uid}</p>
        <button onClick={generateCodeAndSendToBackend}>Generate Code</button>
      </div>
    </div>
  );
}

export default GenerateUID;
