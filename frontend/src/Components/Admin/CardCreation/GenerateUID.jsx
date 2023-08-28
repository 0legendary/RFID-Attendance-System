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

            if (userData.message === "One token Deducted") {
              console.log(userData.data + "One Token is deducted"); // userAcc object
              // Logic for handling "One token Deducted" message
            } else if (userData.message === "Insufficient Balance") {
              console.log(userData.data + "Insuffieciet Balance"); // userAcc object
              // Logic for handling "Insufficient Balance" message
            } else if (userData.message === "User Registered but not created Account") {
              console.log(userData.data+ "Registered, not created and account"); // userData object
              // Logic for handling "User Registered but not created Account" message
              navigate('/admin/new-user', { state: { userData: userData.data } });
            } else if (userData.message === "A new card is detected") {
              console.log(userData.data + "New UID detected"); // null
              // Logic for handling "A new card is detected" message
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
            //console.log(data.uid, uid);
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
