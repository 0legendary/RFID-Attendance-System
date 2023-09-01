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

          <h1 className='admin-title'>Admin Panel</h1>
        </div>
        
        <div className='admin-header'>
          <Link to=""><button className='admin-card mr-5'>Register Manually</button></Link>
          <Link to="/"><button className='admin-card'>User Login</button></Link>
          <Link to="/admin/rfid-scanned-cards"><button className='admin-card'>Cards</button></Link>
          <Link to="/admin"><button className='admin-card'>Users</button></Link>
          <Link to="/admin/generateuid"><button className='admin-card'>Scanning</button></Link>
          <button className="admin-card" onClick={handleLogout}>Log out</button>

        </div>

      </header>
    </div>
  )
}

export default AdminHeader
