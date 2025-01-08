import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDeck } from '../firebase/deckService';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/CreateDeck.css';

function CreateDeck() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentType: 'محادثات'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('يرجى إدخال عنوان المجموعة');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const newDeck = await createDeck(user.uid, formData);
      // التوجيه إلى صفحة البطاقات مع المجموعة الجديدة
      navigate(`/deck/${newDeck.id}/cards`);
    } catch (error) {
      console.error('Error creating deck:', error);
      setError('حدث خطأ أثناء إنشاء المجموعة');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="create-deck-page">
      <Navbar />
      <div className="create-deck-container">
        <div className="create-deck-card">
          <h1>إنشاء مجموعة جديدة</h1>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>عنوان المجموعة</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="يختصر"
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>وصف المجموعة</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="يجازلي"
                className="form-input"
                rows="4"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>نوع المحتوى</label>
              <select
                name="contentType"
                value={formData.contentType}
                onChange={handleChange}
                className="form-input"
                disabled={loading}
              >
                <option value="محادثات">محادثات</option>
                <option value="مفردات">مفردات</option>
                <option value="قواعد">قواعد</option>
                <option value="تعابير">تعابير</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => navigate('/decks')}
                disabled={loading}
              >
                إلغاء
              </button>
              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'جاري الإنشاء...' : 'إنشاء المجموعة'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateDeck; 