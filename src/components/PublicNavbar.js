import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaLanguage, FaHome, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import '../styles/PublicNavbar.css';

function PublicNavbar() {
  const location = useLocation();

  return (
    <nav className="public-navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <FaLanguage className="navbar-icon" />
          <span>تعلم اللغات</span>
        </div>
        <div className="navbar-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <FaHome className="nav-icon" />
            <span>الرئيسية</span>
          </Link>
          <Link 
            to="/login" 
            className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
          >
            <FaSignInAlt className="nav-icon" />
            <span>تسجيل الدخول</span>
          </Link>
          <Link 
            to="/register" 
            className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
          >
            <FaUserPlus className="nav-icon" />
            <span>إنشاء حساب</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default PublicNavbar; 