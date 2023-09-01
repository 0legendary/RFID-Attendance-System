
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RFIDCardDetails() {
  const [card, setCard] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/get-scanned-card-data') // Use the correct route
      .then(response => {
        setCard(response.data);
        
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);


  const fetchStudentsCard = () => {
    axios.get('http://localhost:4000/get-scanned-card-data')
      .then(response => {
        setCard(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  };

  const deleteCard= (uid) => {
    const confirmation = window.confirm('Are you sure you want to delete this RFID Card?');
    if (confirmation) {
      axios.delete(`http://localhost:4000/delete-rfid-card/${uid}`)
        .then(response => {
          //console.log(response.data);
          fetchStudentsCard(); // Fetch updated data after deletion
        })
        .catch(error => {
          console.error('Error deleting user:', error);
        });
    }
  };

  
  return (
    <div className="scanned-cards">
          <div className="table-container">
      <h1>Scanned RFID Cards</h1>
      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Card ID</th>
            <th>Identification</th>
            <th>Status</th>
            <th>Action</th>
            
          </tr>
        </thead>
        <tbody>
          {card.map((card, index) => (
            <tr key={index}>
              <td>{index +1}</td>
              <td>{card.uid}</td>
              <td>{card.identifier}</td>
              <td>{card.status ? 'used' : 'not in use'}</td>
              <td><button className='btn btn-danger' onClick={() => deleteCard(card.uid)}>Delete</button></td>
            </tr>
          ))}
          
        </tbody>
      </table>
    </div>
    </div>


  );
}

export default RFIDCardDetails;
