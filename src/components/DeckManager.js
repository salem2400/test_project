import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addCardToDeck, updateCardInDeck, deleteCardFromDeck } from '../firebase/deckService';
import '../styles/DeckManager.css';

function DeckManager({ deck, onClose, onUpdate }) {
  const [newCard, setNewCard] = useState({ front: '', back: '' });
  const [editingCard, setEditingCard] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddCard = useCallback(async (e) => {
    e.preventDefault();
    if (!newCard.front.trim() || !newCard.back.trim()) {
      setError('يرجى ملء جميع الحقول');
      return;
    }

    setLoading(true);
    try {
      await addCardToDeck(deck.id, {
        front: newCard.front.trim(),
        back: newCard.back.trim(),
        reviewCount: 0,
        knowledgeLevel: 0
      });
      setNewCard({ front: '', back: '' });
      setError('');
      onUpdate();
    } catch (error) {
      console.error('Error adding card:', error);
      setError('حدث خطأ أثناء إضافة البطاقة');
    } finally {
      setLoading(false);
    }
  }, [deck.id, newCard, onUpdate]);

  const handleEditCard = useCallback(async (card) => {
    if (editingCard?.id === card.id) {
      if (!editingCard.front.trim() || !editingCard.back.trim()) {
        setError('يرجى ملء جميع الحقول');
        return;
      }

      setLoading(true);
      try {
        await updateCardInDeck(deck.id, card.id, {
          front: editingCard.front.trim(),
          back: editingCard.back.trim()
        });
        setEditingCard(null);
        setError('');
        onUpdate();
      } catch (error) {
        console.error('Error updating card:', error);
        setError('حدث خطأ أثناء تحديث البطاقة');
      } finally {
        setLoading(false);
      }
    } else {
      setEditingCard({ ...card });
    }
  }, [deck.id, editingCard, onUpdate]);

  const handleDeleteCard = useCallback(async (cardId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه البطاقة؟')) {
      setLoading(true);
      try {
        await deleteCardFromDeck(deck.id, cardId);
        onUpdate();
      } catch (error) {
        console.error('Error deleting card:', error);
        setError('حدث خطأ أثناء حذف البطاقة');
      } finally {
        setLoading(false);
      }
    }
  }, [deck.id, onUpdate]);

  const sortedCards = useMemo(() => {
    return [...(deck.cards || [])].sort((a, b) => {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [deck.cards]);

  const cardInputProps = useMemo(() => ({
    disabled: loading,
    className: "card-input"
  }), [loading]);

  return (
    <div className="deck-manager">
      <div className="deck-manager-header">
        <h2>{deck.title}</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <form onSubmit={handleAddCard} className="add-card-form">
        <h3>إضافة بطاقة جديدة</h3>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <input
            type="text"
            value={newCard.front}
            onChange={(e) => setNewCard(prev => ({ ...prev, front: e.target.value }))}
            placeholder="الوجه الأمامي"
            {...cardInputProps}
          />
          <input
            type="text"
            value={newCard.back}
            onChange={(e) => setNewCard(prev => ({ ...prev, back: e.target.value }))}
            placeholder="الوجه الخلفي"
            {...cardInputProps}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'جاري الإضافة...' : 'إضافة بطاقة'}
          </button>
        </div>
      </form>

      <div className="cards-list">
        <h3>البطاقات الحالية ({sortedCards.length})</h3>
        <AnimatePresence>
          {sortedCards.map((card) => (
            <motion.div
              key={card.id}
              className="card-item"
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {editingCard?.id === card.id ? (
                <div className="card-edit-form">
                  <input
                    type="text"
                    value={editingCard.front}
                    onChange={(e) => setEditingCard(prev => ({ ...prev, front: e.target.value }))}
                    placeholder="الوجه الأمامي"
                    {...cardInputProps}
                  />
                  <input
                    type="text"
                    value={editingCard.back}
                    onChange={(e) => setEditingCard(prev => ({ ...prev, back: e.target.value }))}
                    placeholder="الوجه الخلفي"
                    {...cardInputProps}
                  />
                  <div className="card-actions">
                    <button
                      className="save-button"
                      onClick={() => handleEditCard(card)}
                      disabled={loading}
                    >
                      {loading ? 'جاري الحفظ...' : 'حفظ'}
                    </button>
                    <button
                      className="cancel-button"
                      onClick={() => setEditingCard(null)}
                      disabled={loading}
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="card-content">
                    <div className="card-side">
                      <span className="card-label">السؤال:</span>
                      <span className="card-text">{card.front}</span>
                    </div>
                    <div className="card-side">
                      <span className="card-label">الإجابة:</span>
                      <span className="card-text">{card.back}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEditCard(card)}
                      disabled={loading}
                    >
                      تعديل
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteCard(card.id)}
                      disabled={loading}
                    >
                      حذف
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default DeckManager; 