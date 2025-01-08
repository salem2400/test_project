import React from 'react';
import { motion } from 'framer-motion';
import '../styles/StatsDisplay.css';

function StatsDisplay({ stats }) {
  if (!stats) return null;

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}س ${mins}د`;
  };

  return (
    <div className="stats-container">
      <motion.div 
        className="stats-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{stats.streakDays}</div>
          <div className="stat-label">أيام متتالية</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-value">{stats.totalCardsReviewed}</div>
          <div className="stat-label">بطاقات مراجعة</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value">{formatTime(stats.totalTimeSpent)}</div>
          <div className="stat-label">وقت التعلم</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value">
            {new Date(stats.lastReviewDate.toDate()).toLocaleDateString('ar-EG')}
          </div>
          <div className="stat-label">آخر مراجعة</div>
        </div>
      </motion.div>

      <div className="stats-message">
        {stats.streakDays > 1 ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            🎉 رائع! أنت تتعلم منذ {stats.streakDays} أيام متتالية
          </motion.div>
        ) : (
          <div>ابدأ سلسلة تعلم جديدة اليوم! 💪</div>
        )}
      </div>
    </div>
  );
}

export default StatsDisplay; 