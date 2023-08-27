import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function GenerateUID() {
  const [uid, setUid] = useState('');
  const navigate = useNavigate();


  const generateCodeAndSendToBackend = async () => {
    try {
      const response = await fetch('http://localhost:4000/submit-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();

        if (data.uid) {
          setUid(data.uid);
          try {
            // Fetch user data from the backend based on data.uid
            const userDataResponse = await fetch(`http://localhost:4000/get-user-data?uid=${data.uid}`);
            const userData = await userDataResponse.json();

            if(userData){
             
              console.log(userData);
              // User exists, navigate to new-user route
              navigate('/admin/new-user', { state: { userData } });
            } else {
              // User doesn't exist, navigate to new-card route
              navigate(`/admin/new-card?uid=${data.uid}`);
            }
            
          } catch (error) {
            console.error('An error occurred while fetching user data:', error);
          }
        }
      } else {
        console.error('Failed to send code to backend');
      }
    } catch (error) {
      console.error('An error occurred while sending the code:', error);
    }
  };

  useEffect(() => {
    const pollingInterval = 3000; // 5 seconds

    const checkForUidChange = async () => {
      console.log('Checking for UID change...');
      try {
        const response = await fetch('http://localhost:4000/submit-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
        if (response.ok) {
          const data = await response.json();
          if (data.uid !== uid) {
            console.log(data.uid, uid);
            setUid(data.uid);
            generateCodeAndSendToBackend();
          }
        }
      } catch (error) {
        console.error('An error occurred while checking UID change:', error);
      }
    };

    const intervalId = setInterval(checkForUidChange, pollingInterval);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, navigate]);
  

  return (
    <div>
      <div>
        <h1>5-Digit Code Generator</h1>
        <p>Generated Code: {uid}</p>
      </div>
    </div>
  );
}

export default GenerateUID;
