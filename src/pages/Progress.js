import React from 'react';
import { useAuth } from '../context/AuthContext';
import PrivateNavbar from '../components/PrivateNavbar';
import '../styles/Progress.css';

function Progress() {
  const { user } = useAuth();

  return (
    <>
      <PrivateNavbar />
      <div className="progress-container">
        <div className="progress-header">
          <h1>تقدم التعلم</h1>
        </div>
        <div className="progress-content">
          <div className="progress-card">
            <h3>إحصائيات التعلم</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">0</span>
                <span className="stat-label">البطاقات المكتملة</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">0</span>
                <span className="stat-label">المراجعات</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">0%</span>
                <span className="stat-label">نسبة الإتقان</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Progress; 