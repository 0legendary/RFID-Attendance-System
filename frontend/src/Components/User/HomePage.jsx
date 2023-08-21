import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function HomePage() {
  const location = useLocation();
  const userData = location.state.data;

  const [balance, setBalance] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedTokens, setSelectedTokens] = useState('');
  const [confirmedTokens, setConfirmedTokens] = useState(null); // New state for confirmed tokens

  const [tokensOptions] = useState([
    { label: '10 tokens = 300rs', value: 10 },
    { label: '20 tokens = 600rs', value: 20 },
    { label: '30 tokens = 900rs', value: 30 },
  ]);

  const handleAddTokens = (value) => {
    setSelectedTokens(value);
  };


  const handleConfirmTokens = async () => {
    // Update balance based on confirmed tokens
    setBalance(balance + selectedTokens);
    // Store the confirmed tokens in state
    setConfirmedTokens(selectedTokens);

    setTotalCost(selectedTokens * 30);
    
  };

  const handleMakePayment = async () => {
    // Call the backend API to process payment with the current token balance
    const response = await fetch('http://localhost:4000/make-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid: userData.uid, balance }),
    });

    if (response.ok) {
      console.log('Payment successful');
    } else {
      console.error('Error making payment');
    }
  };


  const handleResetTokens = () => {
    setBalance(0);
    setConfirmedTokens(null);
  };


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
              Tokens Balance: <span>{balance}</span>
            </p>
            <p>
              Total Cost: {totalCost}rs
            </p>
          </div>
          <button className="reset-button" onClick={handleResetTokens}>
            Reset Tokens
          </button>
          <button className="payment-button" onClick={handleMakePayment}>
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
          Confirm Purchase
        </button>
        {confirmedTokens !== null && (
          <p className="confirmed-tokens">Confirmed Tokens: {confirmedTokens}</p>
        )}
      </div>
    </div>
  )
}

export default HomePage
