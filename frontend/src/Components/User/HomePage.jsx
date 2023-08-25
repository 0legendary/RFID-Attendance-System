import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function HomePage() {
  const location = useLocation();
  const userData = location.state.data;
  console.log(userData);


  const [selectedTokens, setSelectedTokens] = useState('');

  const [confirmedToken, setConfirmedToken] = useState(0)
  const [totalSelectedTokens, setTotalSelectedTokens] = useState(0);
  const [updatedTokens, setUpdatedTokens] = useState(null);



  useEffect(() => {
    const storedUpdatedTokens = localStorage.getItem('updatedTokens');
    if (storedUpdatedTokens !== null) {
      setUpdatedTokens(parseInt(storedUpdatedTokens));
    }
  }, []);

  // Save updatedTokens to local storage whenever it changes
  useEffect(() => {
    if (updatedTokens !== null) {
      localStorage.setItem('updatedTokens', updatedTokens.toString());
    }
  }, [updatedTokens]);


  const [tokensOptions] = useState([
    { label: '10 tokens = 300rs', value: 10 },
    { label: '20 tokens = 600rs', value: 20 },
    { label: '30 tokens = 900rs', value: 30 },
  ]);

  const handleAddTokens = (value) => {
    setSelectedTokens(value);
  };

  const handleConfirmTokens = () => {
    setConfirmedToken(selectedTokens);
    setTotalSelectedTokens((prevTotalSelectedTokens) => prevTotalSelectedTokens + selectedTokens);
  };

  const handlePurchase = async () => {
    try {
      const response = await fetch('http://localhost:4000/purchase-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: userData.uid,
          balance: totalSelectedTokens,
        }),

      });

      if (response.status === 200) {
        const responseData = await response.json();
        console.log('Tokens purchased successfully');

        // Update the user's token balance in the userData state directly
        setUpdatedTokens(responseData.updatedTokens);


      } else {
        console.error('Error purchasing tokens');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };


  const handleResetTokens = () => {
    setConfirmedToken(0);
    setTotalSelectedTokens(0);
  };
  const totalCost = confirmedToken * 30;


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
            Card ID: <span>{userData.uid}</span>
          </p>
          <div className="tokens-section">
            <p>
              Tokens Balance: {updatedTokens !== null ? updatedTokens : userData.tokens}
            </p>
            <div className='flex'>
              <p>Total Cost: {totalCost}rs |||| Token selected:  <span>{totalSelectedTokens}</span></p>
            </div>

          </div>
          <button className="reset-button" onClick={handleResetTokens}>
            Reset Tokens
          </button>
          <button className="payment-button" onClick={handlePurchase} >
            Purchase Tokens
          </button>

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


