import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/CardEditor.css';

function CardEditor({ onSave, onCancel, initialCard = null }) {
  const [front, setFront] = useState(initialCard?.front || '');
  const [back, setBack] = useState(initialCard?.back || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!front.trim() || !back.trim()) {
      setError('يرجى ملء جميع الحقول');
      return;
    }

    onSave({ front: front.trim(), back: back.trim() });
  };

  return (
    <motion.div
      className="card-editor"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h3>{initialCard ? 'تعديل البطاقة' : 'إضافة بطاقة جديدة'}</h3>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>الوجه الأمامي (السؤال)</label>
          <textarea
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder="مثال: ما معنى كلمة 'Hello'؟"
            rows={3}
          />
        </div>
        <div className="form-group">
          <label>الوجه الخلفي (الإجابة)</label>
          <textarea
            value={back}
            onChange={(e) => setBack(e.target.value)}
            placeholder="مثال: مرحباً"
            rows={3}
          />
        </div>
        <div className="editor-actions">
          <button type="submit" className="btn-primary">
            حفظ
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            إلغاء
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default CardEditor; 