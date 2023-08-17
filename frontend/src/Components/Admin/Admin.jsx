import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/get-user-data-for-admin') // Use the correct route
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  return (
    <div className='student-table-bg'>
      <div className="student-table">
        <table border='1px'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Token Balance</th>
              <th>UID</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.uid} className="row">
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.tokens}</td>
                <td>{student.uid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
