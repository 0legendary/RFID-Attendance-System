import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function HomePage() {
  const location = useLocation();
  const userData = location.state.data;
   
  const [balance, setBalance] = useState(0);
  const [selectedTokens, setSelectedTokens] = useState('');
  const [confirmedTokens, setConfirmedTokens] = useState(null); // New state for confirmed tokens

  const [tokensOptions] = useState([
    { label: '10 tokens = 200rs', value: 10 },
    { label: '20 tokens = 390rs', value: 20 },
    { label: '30 tokens = 580rs', value: 30 },
  ]);

  const handleAddTokens = (value) => {
    setSelectedTokens(value);
  };


  const handleConfirmTokens = async () => {
    // Update balance based on confirmed tokens
    setBalance(balance + selectedTokens);
    // Store the confirmed tokens in state
    setConfirmedTokens(selectedTokens);

    // // Call the backend API to update tokens
    // const response = await fetch('http://localhost:4000/add-tokens', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ uid: userData.uid, balance: selectedTokens }),
    // });

    // if (response.ok) {
    //   console.log('Tokens added successfully');
    // } else {
    //   console.error('Error adding tokens');
    // }
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
    <div>
     <div className='user-page'>
      <div className='user-info'>
        <h2>User Information</h2>
        <div className='info'>
          <h2>Name: {userData.name}</h2>
          <h2>Email: {userData.email}</h2>
          <h2>Card: {userData.uid}</h2>
          <div>
            <h3>Tokens Balance: {balance}</h3>
            <button onClick={handleResetTokens}>Reset</button>
            <button  onClick={handleMakePayment}>Make Payment</button>
          </div>
        </div>
      </div>
      <div className='add-tokens'>
        <h2>Add Tokens</h2>
        <select
          value={selectedTokens}
          onChange={(e) => handleAddTokens(Number(e.target.value))}
        >
          <option value=''>Select Tokens</option>
          {tokensOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button onClick={handleConfirmTokens}>Confirm</button>
        {confirmedTokens !== null && (
          <p>Confirmed Tokens: {confirmedTokens}</p>
        )}
      </div>
    </div>
    </div>
  )
}

export default HomePage
