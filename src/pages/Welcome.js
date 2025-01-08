import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLanguage, FaLayerGroup, FaChartLine, FaClipboardCheck } from 'react-icons/fa';
import PublicNavbar from '../components/PublicNavbar';
import '../styles/Welcome.css';

function Welcome() {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <>
      <PublicNavbar />
      <div className="welcome-container">
        <div className="welcome-content">
          <div className="welcome-header">
            <FaLanguage className="welcome-icon" />
            <h1>تعلم اللغات</h1>
          </div>
          <p className="welcome-description">
            منصة تفاعلية لتعلم اللغات باستخدام البطاقات التعليمية
          </p>
          <div className="demo-card-container">
            <div 
              className={`demo-card ${isFlipped ? 'flipped' : ''}`}
              onMouseEnter={() => setIsFlipped(true)}
              onMouseLeave={() => setIsFlipped(false)}
            >
              <div className="demo-card-front">
                <h3>مرحباً</h3>
              </div>
              <div className="demo-card-back">
                <h3>Hello</h3>
              </div>
            </div>
          </div>
          <div className="welcome-actions">
            <button 
              className="welcome-button login"
              onClick={() => navigate('/login')}
            >
              تسجيل الدخول
            </button>
            <button 
              className="welcome-button register"
              onClick={() => navigate('/register')}
            >
              إنشاء حساب جديد
            </button>
          </div>
          <div className="features-row">
            <div className="feature-card">
              <FaLayerGroup className="feature-icon" />
              <h3>مجموعات البطاقات</h3>
              <p>إنشاء وتنظيم مجموعات البطاقات الخاصة بك</p>
            </div>
            <div className="feature-card">
              <FaChartLine className="feature-icon" />
              <h3>تتبع التقدم</h3>
              <p>متابعة مستوى تقدمك في التعلم</p>
            </div>
            <div className="feature-card">
              <FaClipboardCheck className="feature-icon" />
              <h3>اختبار المعرفة</h3>
              <p>اختبر معرفتك باستخدام وضع الاختبار</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Welcome; 