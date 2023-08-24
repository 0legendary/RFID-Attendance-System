import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function HomePage() {
  const location = useLocation();
  const userData = location.state.data;
  console.log(userData);

  const [balance, setBalance] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedTokens, setSelectedTokens] = useState('');
  const [confirmedTokens, setConfirmedTokens] = useState(0);
  const [updatedTokens, setUpdatedTokens] = useState(null); // Add this state

  const [tokensOptions] = useState([
    { label: '10 tokens = 300rs', value: 10 },
    { label: '20 tokens = 600rs', value: 20 },
    { label: '30 tokens = 900rs', value: 30 },
  ]);

  const handleAddTokens = (value) => {
    setSelectedTokens(value);
  };

  const handleConfirmTokens = () => {
    setBalance(balance + selectedTokens);
    setConfirmedTokens(selectedTokens);
    setTotalCost(selectedTokens * 30);
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
          balance: confirmedTokens,
        }),
      });

      if (response.status === 200) {
        const responseData = await response.json();
        console.log('Tokens purchased successfully');

        // Update the user's token balance in the userData state directly
        userData.tokens = responseData.updatedTokens;
        setUpdatedTokens(responseData.updatedTokens); // Update the state with the new token balance
        console.log(userData);
        console.log(updatedTokens);
        
      } else {
        console.error('Error purchasing tokens');
      }
    } catch (error) {
      console.error('An error occurred:', error);
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
              Tokens Balance:{userData.tokens} {/* i want to show here the latest "tokens" in the dbs */}
            </p>
            <div className='flex'>
              <p>Total Cost: {totalCost}rs  ||||  Token selected:  <span>{confirmedTokens}</span></p>
              
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
