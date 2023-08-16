import React from 'react'
import { Link } from 'react-router-dom'


function Header() {
    return (
        <div>
            <header className="header">
                <div className="logo">
                    <img src="/school-logo.png" alt="School Logo" />
                    <h1>School RFID Attendance System</h1>
                </div>
                <nav className="navigation">
                    <ul>
                        <Link to='/admin'>
                            <li><button>Admin</button></li>
                        </Link>
                    </ul>
                </nav>
            </header>
        </div>
    )
}

export default Header
