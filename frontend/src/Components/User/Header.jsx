import React from 'react'

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
                        <li><a href="/">Home</a></li>
                        <li><a href="/attendance">Attendance</a></li>
                        <li><a href="/students">Students</a></li>
                    </ul>
                </nav>
            </header>
        </div>
    )
}

export default Header
