import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaLayerGroup, FaChartLine, FaUser, FaLanguage } from 'react-icons/fa';
import '../styles/Navbar.css';

function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const getInitial = (email) => {
    return email ? email.charAt(0).toUpperCase() : 'U';
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <FaLanguage className="logo-icon" />
        تعلم اللغات
      </div>
      
      <div className="nav-links">
        <Link 
          to="/decks" 
          className={`nav-link ${location.pathname === '/decks' ? 'active' : ''}`}
        >
          <FaLayerGroup className="nav-icon" />
          البطاقات
        </Link>
        <Link 
          to="/progress" 
          className={`nav-link ${location.pathname === '/progress' ? 'active' : ''}`}
        >
          <FaChartLine className="nav-icon" />
          التقدم
        </Link>
      </div>
      
      <Link 
        to="/profile" 
        className={`nav-link profile-link ${location.pathname === '/profile' ? 'active' : ''}`}
      >
        <FaUser className="nav-icon" />
        <span className="profile-circle" title={user.email}>
          {getInitial(user.email)}
        </span>
      </Link>
    </nav>
  );
}

export default Navbar; 