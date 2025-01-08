import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeck } from '../firebase/deckService';
import DeckManager from '../components/DeckManager';
import PrivateNavbar from '../components/PrivateNavbar';
import '../styles/DeckView.css';

function DeckView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDeck = async () => {
      try {
        const deckData = await getDeck(id);
        if (!deckData) {
          setError('لم يتم العثور على المجموعة');
          return;
        }
        setDeck(deckData);
      } catch (err) {
        console.error('Error loading deck:', err);
        setError('حدث خطأ أثناء تحميل المجموعة');
      } finally {
        setLoading(false);
      }
    };

    loadDeck();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const updatedDeck = await getDeck(id);
      setDeck(updatedDeck);
    } catch (err) {
      console.error('Error updating deck:', err);
    }
  };

  if (loading) {
    return (
      <>
        <PrivateNavbar />
        <div className="deck-view-page">
          <div className="loading">جاري التحميل...</div>
        </div>
      </>
    );
  }

  if (error || !deck) {
    return (
      <>
        <PrivateNavbar />
        <div className="deck-view-page">
          <div className="error-container">
            <div className="error-message">{error || 'لم يتم العثور على المجموعة'}</div>
            <button 
              className="back-button"
              onClick={() => navigate('/decks')}
            >
              العودة إلى المجموعات
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PrivateNavbar />
      <div className="deck-view-page">
        <div className="deck-view-header">
          <h1>{deck.title}</h1>
          <p className="deck-description">{deck.description}</p>
        </div>
        <div className="deck-view-content">
          <DeckManager 
            deck={deck} 
            onClose={() => navigate('/decks')} 
            onUpdate={handleUpdate} 
          />
        </div>
      </div>
    </>
  );
}

export default DeckView; 