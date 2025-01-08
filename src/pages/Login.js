import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLanguage } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import PublicNavbar from '../components/PublicNavbar';
import '../styles/Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await login(email, password);
    } catch (err) {
      setError('فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.');
    }
  };

  return (
    <>
      <PublicNavbar />
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <FaLanguage className="auth-icon" />
            <h1>تسجيل الدخول</h1>
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
            <button type="submit" className="auth-button">
              تسجيل الدخول
            </button>
          </form>
          <p className="auth-switch">
            ليس لديك حساب؟{' '}
            <button 
              className="switch-button"
              onClick={() => navigate('/register')}
            >
              إنشاء حساب جديد
            </button>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login; 