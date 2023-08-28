import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Admin() {
  const [students, setStudents] = useState([]);
  const Navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:4000/get-user-data-for-admin')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });

    const adminLoginTime = localStorage.getItem('adminLoginTime');
    if (!adminLoginTime || Date.now() - adminLoginTime > 3600000) { // More than 1 hour
      Navigate('/admin-login');
    }
  }, [Navigate]);

  const fetchStudentsData = () => {
    axios.get('http://localhost:4000/get-user-data-for-admin')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  };

  const deleteStudent = (uid) => {
    const confirmation = window.confirm('Are you sure you want to delete this user?');
    if (confirmation) {
      axios.delete(`http://localhost:4000/delete-user/${uid}`)
        .then(response => {
          console.log(response.data);
          fetchStudentsData(); // Fetch updated data after deletion
        })
        .catch(error => {
          console.error('Error deleting user:', error);
        });
    }
  };
  return (
    <div className="attendance-table-container">
      <table className="attendance-table">
        <thead>
          <tr className="table-header-row">
            <th className="table-header">Name</th>
            <th className="table-header">Email</th>
            <th className="table-header">Token Balance</th>
            <th className="table-header">UID</th>
            <th className="table-header">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((item, index) => (
            <tr key={index} className="table-row">
              <td className="table-cell">{item.name}</td>
              <td className="table-cell">{item.email}</td>
              <td className="table-cell">{item.tokens}</td>
              <td className="table-cell">{item.uid}</td>
              <td className="table-cell"><button className='btn btn-danger' onClick={() => deleteStudent(item.uid)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
