import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { updateCardInDeck } from '../firebase/deckService';
import { updateReviewStats } from '../firebase/statsService';
import '../styles/Deck.css';

const Card = memo(({ card, isFlipped, onFlip }) => (
  <motion.div
    key={card.id + (isFlipped ? '-flipped' : '')}
    className={`card ${isFlipped ? 'flipped' : ''}`}
    onClick={onFlip}
    initial={{ rotateY: 0 }}
    animate={{ rotateY: isFlipped ? 180 : 0 }}
    exit={{ x: -300, opacity: 0 }}
    transition={{ duration: 0.3, type: 'spring', stiffness: 150 }}
    layoutId={`card-${card.id}`}
  >
    <div className="card-content">
      <div className="card-front">
        {card.front}
      </div>
      <div className="card-back">
        {card.back}
      </div>
    </div>
  </motion.div>
));

Card.displayName = 'Card';

const KnowledgeLevels = memo(({ onSelect, disabled }) => (
  <div className="knowledge-levels">
    <button onClick={() => onSelect(1)} className="level-1" disabled={disabled}>لا أعرف</button>
    <button onClick={() => onSelect(2)} className="level-2" disabled={disabled}>صعب</button>
    <button onClick={() => onSelect(3)} className="level-3" disabled={disabled}>متوسط</button>
    <button onClick={() => onSelect(4)} className="level-4" disabled={disabled}>سهل</button>
    <button onClick={() => onSelect(5)} className="level-5" disabled={disabled}>أعرف جيداً</button>
  </div>
));

KnowledgeLevels.displayName = 'KnowledgeLevels';

function Deck({ title, cards = [], deckId }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewStartTime, setReviewStartTime] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setReviewStartTime(new Date());
    return () => {
      if (reviewStartTime) {
        const endTime = new Date();
        const timeSpent = Math.floor((endTime - reviewStartTime) / 60000);
        updateReviewStats(user.uid, {
          timeSpent,
          isCorrect: false,
          isMastered: false
        }).catch(console.error);
      }
    };
  }, [reviewStartTime, user?.uid]);

  const handleCardFlip = useCallback(() => {
    if (!isUpdating) {
      setIsFlipped(!isFlipped);
    }
  }, [isFlipped, isUpdating]);

  const handleKnowledgeLevel = useCallback(async (level) => {
    if (!cards[currentCardIndex] || isUpdating) return;

    const isMastered = level >= 4;
    const isCorrect = level >= 3;

    try {
      setIsUpdating(true);

      await Promise.all([
        updateCardInDeck(deckId, cards[currentCardIndex].id, {
          lastReviewDate: new Date().toISOString(),
          knowledgeLevel: level,
          reviewCount: (cards[currentCardIndex].reviewCount || 0) + 1
        }),
        updateReviewStats(user.uid, {
          isCorrect,
          isMastered
        })
      ]);

      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setIsFlipped(false);
      }
    } catch (error) {
      console.error('Error updating card status:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [currentCardIndex, cards, deckId, user.uid, isUpdating]);

  if (!cards.length) {
    return (
      <div className="deck-empty">
        <h2>{title}</h2>
        <p>لا توجد بطاقات في هذه المجموعة</p>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="deck-container">
      <h2>{title}</h2>
      <div className="progress">
        البطاقة {currentCardIndex + 1} من {cards.length}
      </div>
      
      <AnimatePresence mode="wait">
        <Card
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={handleCardFlip}
        />
      </AnimatePresence>

      <KnowledgeLevels
        onSelect={handleKnowledgeLevel}
        disabled={isUpdating}
      />
    </div>
  );
}

export default memo(Deck); 