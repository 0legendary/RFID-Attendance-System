import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
//import Razorpay from 'react-razorpay';

function HomePage() {
  const location = useLocation();
  const userData = location.state.data;

  const [selectedTokens, setSelectedTokens] = useState('');
  const [confirmedToken, setConfirmedToken] = useState(0);
  const [totalSelectedTokens, setTotalSelectedTokens] = useState(0);
  const [updatedTokens, setUpdatedTokens] = useState(userData.tokens); // Initialize with user's initial token balance

  const [tokensOptions] = useState([
    { label: '10 tokens = 300rs', value: 10 },
    { label: '20 tokens = 600rs', value: 20 },
    { label: '30 tokens = 900rs', value: 30 },
  ]);

  // Handle the token purchase logic

  const handleAddTokens = (value) => {
    setSelectedTokens(value);
  };

  const handleConfirmTokens = () => {
    setConfirmedToken(selectedTokens);
    setTotalSelectedTokens((prevTotalSelectedTokens) => prevTotalSelectedTokens + selectedTokens);
  };

  const handlePurchase = async () => {
    try {
      const response = await fetch('http://localhost:4000/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalCost * 100, // Razorpay expects amount in paise (multiply by 100)
        }),
      });
  
      if (response.status === 200) {
        const orderData = await response.json();
  
        // Open the Razorpay payment modal
        const options = {
          key: 'rzp_test_2EAqZaiFy2rVs4',
          amount: orderData.amount,
          order_id: orderData.id,
          name: 'Token Purchase',
          description: 'Purchase tokens',
          handler: async function (response) {
            // Payment success
            console.log('Payment successful:', response);
  
            // Now you can update tokens in the database
            try {
              const purchaseResponse = await fetch('http://localhost:4000/purchase-tokens', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  uid: userData.uid,
                  balance: totalSelectedTokens,
                }),
              });
  
              if (purchaseResponse.status === 200) {
                const responseData = await purchaseResponse.json();
                console.log('Tokens purchased successfully');
  
                // Update the user's token balance in the state directly
                setUpdatedTokens(responseData.updatedTokens);
              } else {
                console.error('Error purchasing tokens');
              }
            } catch (error) {
              console.error('An error occurred:', error);
            }
          },
          prefill: {
            email: userData.email,
            contact: '9961689333',
          },
        };
  
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        console.error('Error creating Razorpay order');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleResetTokens = () => {
    setConfirmedToken(0);
    setTotalSelectedTokens(0);
  };
  const totalCost = totalSelectedTokens * 15;

  // Fetch updated token balance every 1 second
  useEffect(() => {
    const fetchTokensBalance = async () => {
      try {
        const response = await fetch(`http://localhost:4000/get-tokens-balance/${userData.uid}`);
        if (response.status === 200) {
          const responseData = await response.json();
          setUpdatedTokens(responseData.tokens);
        }
      } catch (error) {
        console.error('An error occurred while fetching tokens balance:', error);
      }
    };

    const interval = setInterval(fetchTokensBalance, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [userData.uid]);

  return (
    <div className="home-page">
      <div className="user-info">
        <div className='box-heading'>
          <h2>User Details</h2>
        </div>
        <div className="info">
          <p className='info-username'>
            User: {userData.name}
          </p>
          <p>
            Email: <span>{userData.email}</span>
          </p>
          <p>
            Card ID: <span>{updatedTokens === 'null' ? updatedTokens : userData.uid}</span>
          </p>
          <div className="tokens-section">
            <p>
              Tokens Balance:  {updatedTokens}
            </p>
            <div className='flex'>
              <p>Total Cost: {totalCost}rs |||| Token selected:  <span>{totalSelectedTokens}</span></p>
            </div>

          </div>

          {totalSelectedTokens > 0 && (
            <>
              <button className="reset-button" onClick={handleResetTokens}>
                Reset Tokens
              </button>
              <button className="payment-button" onClick={handlePurchase}>
                Purchase Tokens
              </button>
            </>
          )}

        </div>
      </div>
      <div className="add-tokens">
        <h2>Get More Tokens</h2>
        <select
          className="token-select"
          value={selectedTokens}
          onChange={(e) => handleAddTokens(Number(e.target.value))}
        >
          <option value="">Select Tokens</option>
          {tokensOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button className="confirm-button" onClick={handleConfirmTokens}>
          Confirm Tokens
        </button>

        <p className="confirmed-tokens">Confirmed Tokens: {confirmedToken} </p>

      </div>
    </div>
  )
}

export default HomePage


