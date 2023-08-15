import React from 'react'
const students = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      tokenBalance: 10,
      timeHistory: ['09:00 AM', '02:30 PM', '04:15 PM'],
    },
    // Add more student objects...
  ];
function Admin() {
  return (
    <div className='student-table-bg'>
      <div className="student-table">
      <table border='1px'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Token Balance</th>
            <th>Time History</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.tokenBalance}</td>
              <td>{student.timeHistory.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {/* const char* ssid = "Alen's Galaxy F12"; // Replace with your WiFi SSID
const char* password = "olegendary"; // Replace with your WiFi password */}

    </div>
  )
}

export default Admin
