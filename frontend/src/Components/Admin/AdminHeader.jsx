import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AdminHeader() {
  const Navigate = useNavigate();

  const handleLogout = () => {
    // Clear the adminLoggedIn timestamp from localStorage
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    
    // Redirect to admin login page
    Navigate('/admin-login');
  };
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
      <div>

      <Link to="/admin/generateuid" className="register-button">Scanning</Link>
      <button className="btn btn-success ml-3" onClick={handleLogout}>Log out</button>
      </div>
      
      
    </header>
    </div>
  )
}

export default AdminHeader
