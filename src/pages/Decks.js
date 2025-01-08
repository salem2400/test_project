import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserDecks, deleteDeck } from '../firebase/deckService';
import PrivateNavbar from '../components/PrivateNavbar';
import '../styles/Decks.css';

function Decks() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDecks = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getUserDecks(user.uid);
      setDecks(result.decks || []);
    } catch (error) {
      console.error('Error loading decks:', error);
      setError('حدث خطأ أثناء تحميل المجموعات');
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (user) {
      loadDecks();
    }
  }, [user, loadDecks]);

  const handleView = useCallback((deckId) => {
    navigate(`/deck/${deckId}`);
  }, [navigate]);

  const handleReview = useCallback((deckId) => {
    navigate(`/review/${deckId}`);
  }, [navigate]);

  const handleTest = useCallback((deckId) => {
    navigate(`/test/${deckId}`);
  }, [navigate]);

  const handleDelete = useCallback(async (deckId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المجموعة؟')) {
      try {
        await deleteDeck(user.uid, deckId);
        setDecks(prevDecks => prevDecks.filter(deck => deck.id !== deckId));
      } catch (error) {
        console.error('Error deleting deck:', error);
        setError('حدث خطأ أثناء محاولة حذف المجموعة');
      }
    }
  }, [user?.uid]);

  const sortedDecks = useMemo(() => {
    return [...decks].sort((a, b) => {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [decks]);

  if (loading) {
    return (
      <>
        <PrivateNavbar />
        <div className="decks-container">
          <div className="loading">جاري التحميل...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PrivateNavbar />
        <div className="decks-container">
          <div className="error">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <PrivateNavbar />
      <div className="decks-container">
        <div className="decks-header">
          <h1>مجموعاتي</h1>
          <button 
            className="add-deck-button"
            onClick={() => navigate('/create-deck')}
          >
            إضافة مجموعة جديدة
          </button>
        </div>

        <div className="decks-grid">
          {sortedDecks.map(deck => (
            <div key={deck.id} className="deck-card">
              <h3>{deck.title}</h3>
              <p>{deck.description}</p>
              <div className="deck-stats">
                <span>{deck.cards?.length || 0} بطاقة</span>
                <span>{deck.category}</span>
              </div>
              <div className="deck-actions">
                <button onClick={() => handleView(deck.id)}>
                  عرض
                </button>
                <button onClick={() => handleReview(deck.id)}>
                  مراجعة
                </button>
                <button onClick={() => handleTest(deck.id)}>
                  اختبار
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(deck.id)}
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Decks; 