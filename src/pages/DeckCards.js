import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeck, addCardToDeck } from '../firebase/deckService';
import Navbar from '../components/Navbar';
import '../styles/DeckCards.css';

const CARDS_PER_PAGE = 12;

function DeckCards() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({ front: '', back: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [addingCard, setAddingCard] = useState(false);

  // جلب بيانات المجموعة
  const loadDeck = useCallback(async () => {
    try {
      setLoading(true);
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
  }, [id]);

  useEffect(() => {
    loadDeck();
  }, [loadDeck]);

  // ترتيب وتقسيم البطاقات
  const { paginatedCards, totalPages } = useMemo(() => {
    if (!deck?.cards) return { paginatedCards: [], totalPages: 0 };

    const sortedCards = [...deck.cards].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    const start = (currentPage - 1) * CARDS_PER_PAGE;
    const end = start + CARDS_PER_PAGE;
    
    return {
      paginatedCards: sortedCards.slice(start, end),
      totalPages: Math.ceil(sortedCards.length / CARDS_PER_PAGE)
    };
  }, [deck?.cards, currentPage]);

  // إضافة بطاقة جديدة
  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!newCard.front.trim() || !newCard.back.trim()) {
      setError('يرجى ملء جميع الحقول');
      return;
    }

    try {
      setAddingCard(true);
      setError('');
      await addCardToDeck(deck.id, {
        front: newCard.front.trim(),
        back: newCard.back.trim()
      });
      
      setNewCard({ front: '', back: '' });
      setShowAddForm(false);
      await loadDeck();
    } catch (error) {
      console.error('Error adding card:', error);
      setError('حدث خطأ أثناء إضافة البطاقة');
    } finally {
      setAddingCard(false);
    }
  };

  if (loading) {
    return (
      <div className="deck-cards-page">
        <Navbar />
        <div className="deck-cards-container">
          <div className="loading-spinner">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="deck-cards-page">
        <Navbar />
        <div className="deck-cards-container">
          <div className="error-message">{error || 'لم يتم العثور على المجموعة'}</div>
          <button 
            className="back-button"
            onClick={() => navigate('/decks')}
          >
            العودة إلى المجموعات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="deck-cards-page">
      <Navbar />
      <div className="deck-cards-container">
        <div className="deck-header">
          <h1>{deck.title}</h1>
          <p>{deck.description}</p>
        </div>

        <div className="deck-actions">
          <button 
            className="review-button"
            onClick={() => navigate(`/deck/${deck.id}/review`)}
          >
            مراجعة البطاقات
          </button>
          <button 
            className="test-button"
            onClick={() => navigate(`/deck/${deck.id}/test`)}
          >
            اختبار
          </button>
          <button 
            className="add-button"
            onClick={() => setShowAddForm(true)}
          >
            إضافة بطاقة
          </button>
        </div>

        {showAddForm && (
          <div className="add-card-form">
            <h3>إضافة بطاقة جديدة</h3>
            <form onSubmit={handleAddCard}>
              <div className="form-group">
                <label>الوجه الأمامي</label>
                <input
                  type="text"
                  value={newCard.front}
                  onChange={(e) => setNewCard(prev => ({ ...prev, front: e.target.value }))}
                  placeholder="أدخل نص الوجه الأمامي"
                  className="form-input"
                  disabled={addingCard}
                />
              </div>
              <div className="form-group">
                <label>الوجه الخلفي</label>
                <input
                  type="text"
                  value={newCard.back}
                  onChange={(e) => setNewCard(prev => ({ ...prev, back: e.target.value }))}
                  placeholder="أدخل نص الوجه الخلفي"
                  className="form-input"
                  disabled={addingCard}
                />
              </div>
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={addingCard}
                >
                  {addingCard ? 'جاري الإضافة...' : 'إضافة'}
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewCard({ front: '', back: '' });
                  }}
                  disabled={addingCard}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {paginatedCards.length === 0 ? (
          <div className="empty-state">
            <h2>لا توجد بطاقات</h2>
            <p>ابدأ بإضافة بطاقات جديدة إلى هذه المجموعة</p>
          </div>
        ) : (
          <>
            <div className="cards-grid">
              {paginatedCards.map(card => (
                <div key={card.id} className="card-item">
                  <div className="card-content">
                    <div className="card-side">
                      <label>الوجه الأمامي</label>
                      <div className="card-text">{card.front}</div>
                    </div>
                    <div className="card-side">
                      <label>الوجه الخلفي</label>
                      <div className="card-text">{card.back}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  السابق
                </button>
                <span className="page-info">
                  الصفحة {currentPage} من {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  التالي
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DeckCards; 