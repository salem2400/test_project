import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLanguage } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import PublicNavbar from '../components/PublicNavbar';
import '../styles/Auth.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('كلمات المرور غير متطابقة');
    }

    try {
      setError('');
      await register(email, password);
    } catch (err) {
      setError('فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <>
      <PublicNavbar />
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <FaLanguage className="auth-icon" />
            <h1>إنشاء حساب جديد</h1>
          </div>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="تأكيد كلمة المرور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="auth-button">
              إنشاء حساب
            </button>
          </form>
          <p className="auth-switch">
            لديك حساب بالفعل؟{' '}
            <button 
              className="switch-button"
              onClick={() => navigate('/login')}
            >
              تسجيل الدخول
            </button>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register; 