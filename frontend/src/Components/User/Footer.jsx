import React from 'react'

function Footer() {
  return (
    <div>
      <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>&copy; {new Date().getFullYear()} School RFID Attendance System</p>
        </div>
        <div className="footer-right">
          <p>Contact: info@example.com</p>
        </div>
      </div>
    </footer>
    </div>
  )
}

export default Footer
