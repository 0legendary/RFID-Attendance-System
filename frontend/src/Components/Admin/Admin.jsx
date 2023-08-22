import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Admin() {
  const [students, setStudents] = useState([]);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const Navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:4000/get-user-data-for-admin') // Use the correct route
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });

    // Check for the adminLoggedIn cookie and its expiration
    const adminLoggedIn = document.cookie.includes('adminLoggedIn=true');
    const cookies = document.cookie.split(';');
    const expirationCookie = cookies.find(cookie => cookie.trim().startsWith('adminLoggedIn='));

    if (!adminLoggedIn || (expirationCookie && new Date(expirationCookie.split('=')[1]) < new Date())) {
      setShouldRedirect(true);
    }
  }, []);

  if (shouldRedirect) {
    Navigate('/admin-login');
    return null;
  }
  return (
    <div className="attendance-table-container">
      <table className="attendance-table">
        <thead>
          <tr className="table-header-row">
            <th className="table-header">Name</th>
            <th className="table-header">Email</th>
            <th className="table-header">Token Balance</th>
            <th className="table-header">UID</th>
            <th className="table-header">Time</th>
          </tr>
        </thead>
        <tbody>
          {students.map((item, index) => (
            <tr key={index} className="table-row">
              <td className="table-cell">{item.name}</td>
              <td className="table-cell">{item.email}</td>
              <td className="table-cell">{item.tokens}</td>
              <td className="table-cell">{item.uid}</td>
              <td className="table-cell">{item.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
