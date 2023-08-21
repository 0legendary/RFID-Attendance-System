import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../Images/rfid-logo.png';

function Header() {
    return (
        <div>
            <header className="header">
                <div className="logo">
                    <img src={logo} alt="School Logo" />
                    <h1>Attendance</h1>
                </div>
                <nav className="navigation">
                    <ul>
                        <Link to='/admin'>
                            <li><button className='header-button'>Admin</button></li>
                        </Link>
                    </ul>
                </nav>
            </header>
        </div>
    )
}

export default Header
