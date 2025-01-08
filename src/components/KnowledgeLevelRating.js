import React from 'react';
import { motion } from 'framer-motion';
import '../styles/KnowledgeLevelRating.css';

const KNOWLEDGE_LEVELS = [
  { value: 0, label: 'لا أعرف', color: '#e74c3c', emoji: '😕' },
  { value: 1, label: 'صعب جداً', color: '#e67e22', emoji: '😣' },
  { value: 2, label: 'صعب', color: '#f1c40f', emoji: '🤔' },
  { value: 3, label: 'متوسط', color: '#3498db', emoji: '😊' },
  { value: 4, label: 'سهل', color: '#2ecc71', emoji: '😄' },
  { value: 5, label: 'سهل جداً', color: '#27ae60', emoji: '🤩' }
];

function KnowledgeLevelRating({ onRate, disabled }) {
  return (
    <div className="knowledge-rating">
      <div className="rating-label">كيف كان مستوى معرفتك بهذه البطاقة؟</div>
      <div className="rating-buttons">
        {KNOWLEDGE_LEVELS.map((level) => (
          <motion.button
            key={level.value}
            className="rating-button"
            style={{ 
              '--button-color': level.color,
              opacity: disabled ? 0.6 : 1
            }}
            onClick={() => !disabled && onRate(level.value)}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            disabled={disabled}
          >
            <span className="rating-emoji">{level.emoji}</span>
            <span className="rating-text">{level.label}</span>
          </motion.button>
        ))}
      </div>
      <div className="rating-info">
        سيتم تحديد موعد المراجعة التالية بناءً على تقييمك
      </div>
    </div>
  );
}

export default KnowledgeLevelRating; 