import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaLanguage, FaLayerGroup, FaChartLine, FaUser } from 'react-icons/fa';
import '../styles/Navbar.css';

function PrivateNavbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <div className="logo-container">
            <FaLanguage className="navbar-icon floating" />
            <div className="logo-text">تعلم اللغات</div>
          </div>
        </div>
        <div className="navbar-links">
          <Link 
            to="/decks" 
            className={`nav-link ${location.pathname === '/decks' ? 'active' : ''}`}
          >
            <FaLayerGroup className="nav-icon" />
            <span>البطاقات</span>
          </Link>
          <Link 
            to="/progress" 
            className={`nav-link ${location.pathname === '/progress' ? 'active' : ''}`}
          >
            <FaChartLine className="nav-icon" />
            <span>التقدم</span>
          </Link>
          <Link 
            to="/profile" 
            className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
          >
            <FaUser className="nav-icon" />
            <span>الملف الشخصي</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default PrivateNavbar; 