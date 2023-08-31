import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function GenerateUID() {
  
  const navigate = useNavigate();
  const [message, setMessage] = useState('')


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
          //setUid(data.uid);
          try {
            // Fetch user data from the backend based on data.uid
            const userDataResponse = await fetch(`http://localhost:4000/get-user-data?uid=${data.uid}`);
            const userData = await userDataResponse.json();

            if (userData.message === "One token Deducted") {
              console.log(userData.data + "One Token is deducted"); // userAcc object
              setMessage("One Token deducted")

            } else if (userData.message === "Insufficient Balance") {
              console.log(userData.data + "Insuffieciet Balance"); // userAcc object
              setMessage("Insuffieciet Balance")

            } else if (userData.message === "User Registered but not created Account") {
              console.log(userData.data+ "Registered, not created and account"); // userData object
              setMessage("Registered, not created and account")
              
              localStorage.setItem("userData", JSON.stringify(userData.data));

              // Open a new window with the CardforNewUser component
              window.open("/admin/new-user", "_blank");

            } else if (userData.message === "A new card is detected") {
              console.log(userData.data + "New UID detected"); // null
              setMessage("New UID detected")


              window.open(`/admin/new-card?uid=${data.uid}`);
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
    const pollingInterval = 1000; // 5 seconds

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
          
          if(data.uid !==null){
            console.log(data.uid + "uid is recived in the backend for checking");
            //setUid(data.uid);
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
  }, [ navigate]);
  

  return (
    <div>
      <div>
        <p>Status: {message}</p>
      </div>
    </div>
  );
}

export default GenerateUID;
