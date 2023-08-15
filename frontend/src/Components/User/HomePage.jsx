import React from 'react'
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <div className="home">
      <div className="section admin-section">
        <Link to="/admin">Admin Section</Link>
      </div>
      <div className="section user-section">
        <Link to="/login">User Section</Link>
      </div>
    </div>
    </div>
  )
}

export default HomePage
