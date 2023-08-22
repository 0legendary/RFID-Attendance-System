import React from 'react'
import { Link } from 'react-router-dom';

function AdminHeader() {
  return (
    <div>
      <header className="admin-header">
      <div className="logo">
        <h1>Admin Panel</h1>
      </div>
      <nav className="navigation">
        <ul>
          <h3><li><Link to="/admin/rfid-scanned-cards">Cards</Link></li></h3>
          <h3><li><Link to="/admin">Users</Link></li></h3>
          <h3><li><Link to="/admin/student-logs">Student Logs</Link></li></h3>
        </ul>
      </nav>
      <Link to="/admin/register" className="register-button">Register New Student</Link>
    </header>
    </div>
  )
}

export default AdminHeader
