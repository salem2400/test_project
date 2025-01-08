import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeck, updateCardInDeck, deleteCardFromDeck, addCardToDeck, loadMoreCards } from '../firebase/deckService';
import Navbar from '../components/Navbar';
import '../styles/Review.css';

function Review() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [editingCards, setEditingCards] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({ front: '', back: '' });
  const [hasMore, setHasMore] = useState(true);

  const loadDeck = useCallback(async () => {
    try {
      const deckData = await getDeck(id);
      if (!deckData) {
        setError('لم يتم العثور على المجموعة');
        return;
      }
      setDeck(deckData);
      setHasMore(deckData.cards.length === 20);
    } catch (err) {
      console.error('Error loading deck:', err);
      setError('حدث خطأ أثناء تحميل المجموعة');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadMore = useCallback(async () => {
    if (!deck || !deck.cards.length || loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const lastCard = deck.cards[deck.cards.length - 1];
      const moreCards = await loadMoreCards(deck.id, lastCard);
      
      if (moreCards.length === 0) {
        setHasMore(false);
        return;
      }

      setDeck(prev => ({
        ...prev,
        cards: [...prev.cards, ...moreCards]
      }));
      setHasMore(moreCards.length === 20);
    } catch (error) {
      console.error('Error loading more cards:', error);
      setError('حدث خطأ أثناء تحميل المزيد من البطاقات');
    } finally {
      setLoadingMore(false);
    }
  }, [deck, loadingMore, hasMore]);

  useEffect(() => {
    loadDeck();
  }, [loadDeck]);

  const handleEdit = useCallback((cardId) => {
    const card = deck.cards.find(c => c.id === cardId);
    if (card) {
      setEditingCards(prev => ({
        ...prev,
        [cardId]: { front: card.front, back: card.back }
      }));
    }
  }, [deck?.cards]);

  const handleSave = useCallback(async (cardId) => {
    const editedCard = editingCards[cardId];
    if (!editedCard) return;

    try {
      await updateCardInDeck(deck.id, cardId, {
        front: editedCard.front.trim(),
        back: editedCard.back.trim()
      });
      
      setDeck(prev => ({
        ...prev,
        cards: prev.cards.map(card => 
          card.id === cardId 
            ? { ...card, front: editedCard.front.trim(), back: editedCard.back.trim() }
            : card
        )
      }));
      
      setEditingCards(prev => {
        const newState = { ...prev };
        delete newState[cardId];
        return newState;
      });
    } catch (error) {
      console.error('Error updating card:', error);
      setError('حدث خطأ أثناء تحديث البطاقة');
    }
  }, [deck?.id, editingCards]);

  const handleDelete = useCallback(async (cardId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه البطاقة؟')) {
      try {
        await deleteCardFromDeck(deck.id, cardId);
        setDeck(prev => ({
          ...prev,
          cards: prev.cards.filter(card => card.id !== cardId)
        }));
      } catch (error) {
        console.error('Error deleting card:', error);
        setError('حدث خطأ أثناء حذف البطاقة');
      }
    }
  }, [deck?.id]);

  const handleAddCard = useCallback(async (e) => {
    e.preventDefault();
    if (!newCard.front.trim() || !newCard.back.trim()) {
      setError('يرجى ملء جميع الحقول');
      return;
    }

    try {
      await addCardToDeck(deck.id, {
        front: newCard.front.trim(),
        back: newCard.back.trim(),
        reviewCount: 0,
        knowledgeLevel: 0
      });
      
      await loadDeck(); // إعادة تحميل البطاقات لضمان الترتيب الصحيح
      setNewCard({ front: '', back: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding card:', error);
      setError('حدث خطأ أثناء إضافة البطاقة');
    }
  }, [deck?.id, newCard, loadDeck]);

  const sortedCards = useMemo(() => {
    if (!deck?.cards) return [];
    return [...deck.cards].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [deck?.cards]);

  if (loading) {
    return (
      <div className="review-page">
        <Navbar />
        <div className="review-container">
          <div className="loading">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="review-page">
        <Navbar />
        <div className="review-container">
          <div className="error">{error || 'لم يتم العثور على المجموعة'}</div>
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
    <div className="review-page">
      <Navbar />
      <div className="review-container">
        <div className="review-header">
          <h1>{deck.title}</h1>
          <p>{deck.description}</p>
        </div>

        {showAddForm && (
          <div className="add-card-form">
            <h3>إضافة بطاقة جديدة</h3>
            <form onSubmit={handleAddCard}>
              <div className="form-group">
                <label className="form-label">الوجه الأمامي</label>
                <input
                  type="text"
                  className="form-input"
                  value={newCard.front}
                  onChange={(e) => setNewCard(prev => ({ ...prev, front: e.target.value }))}
                  placeholder="أدخل نص الوجه الأمامي"
                />
              </div>
              <div className="form-group">
                <label className="form-label">الوجه الخلفي</label>
                <input
                  type="text"
                  className="form-input"
                  value={newCard.back}
                  onChange={(e) => setNewCard(prev => ({ ...prev, back: e.target.value }))}
                  placeholder="أدخل نص الوجه الخلفي"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button">إضافة</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewCard({ front: '', back: '' });
                  }}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {sortedCards.length === 0 ? (
          <div className="empty-state">
            <h2>لا توجد بطاقات</h2>
            <p>ابدأ بإضافة بطاقات جديدة إلى هذه المجموعة</p>
          </div>
        ) : (
          <>
            <div className="cards-grid">
              {sortedCards.map(card => (
                <div key={card.id} className="card-item">
                  <div className="card-content">
                    {editingCards[card.id] ? (
                      <>
                        <div className="card-side">
                          <label className="card-label">الوجه الأمامي</label>
                          <input
                            type="text"
                            className="card-input"
                            value={editingCards[card.id].front}
                            onChange={(e) => setEditingCards(prev => ({
                              ...prev,
                              [card.id]: { ...prev[card.id], front: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="card-side">
                          <label className="card-label">الوجه الخلفي</label>
                          <input
                            type="text"
                            className="card-input"
                            value={editingCards[card.id].back}
                            onChange={(e) => setEditingCards(prev => ({
                              ...prev,
                              [card.id]: { ...prev[card.id], back: e.target.value }
                            }))}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="card-side">
                          <label className="card-label">الوجه الأمامي</label>
                          <div className="card-text">{card.front}</div>
                        </div>
                        <div className="card-side">
                          <label className="card-label">الوجه الخلفي</label>
                          <div className="card-text">{card.back}</div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="card-actions">
                    {editingCards[card.id] ? (
                      <>
                        <button 
                          className="save-button"
                          onClick={() => handleSave(card.id)}
                        >
                          حفظ
                        </button>
                        <button 
                          className="cancel-button"
                          onClick={() => setEditingCards(prev => {
                            const newState = { ...prev };
                            delete newState[card.id];
                            return newState;
                          })}
                        >
                          إلغاء
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="edit-button"
                          onClick={() => handleEdit(card.id)}
                        >
                          تعديل
                        </button>
                        <button 
                          className="delete-button"
                          onClick={() => handleDelete(card.id)}
                        >
                          حذف
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="load-more">
                <button 
                  className="load-more-button"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'جاري التحميل...' : 'تحميل المزيد'}
                </button>
              </div>
            )}
          </>
        )}

        <button 
          className="add-card-button"
          onClick={() => setShowAddForm(true)}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default Review; 