import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../Images/rfid-logo.png';

function Header() {

  const Navigate = useNavigate();

  const checkAdminAuthentication = async () => {
    try {
      Navigate('/admin-login'); // Redirect to admin login page
    } catch (error) {
      console.error('Error checking admin authentication:', error);
    }
  };

  return (
    <div>
      <header className="header">
        <div className="logo">
          <img src={logo} alt="School Logo" />
          <h1>Attendance</h1>
        </div>
        <nav className="navigation">
          <ul>
            <li>
              <button className="header-button" onClick={checkAdminAuthentication}>
                Admin
              </button>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default Header;
