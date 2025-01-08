import React, { useState, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShareButton from './ShareButton';
import KnowledgeLevelRating from './KnowledgeLevelRating';
import '../styles/Flashcard.css';

const Flashcard = memo(({ frontContent, backContent, onComplete, disabled, deckTitle }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showRating, setShowRating] = useState(false);

  const handleFlip = useCallback(() => {
    if (!disabled) {
      setIsFlipped(!isFlipped);
      if (!isFlipped) {
        setShowRating(true);
      }
    }
  }, [disabled, isFlipped]);

  const handleRate = useCallback((knowledgeLevel) => {
    if (!disabled && onComplete) {
      onComplete(knowledgeLevel);
      setShowRating(false);
    }
  }, [disabled, onComplete]);

  const cardContent = useMemo(() => ({
    front: frontContent,
    back: backContent
  }), [frontContent, backContent]);

  const cardVariants = useMemo(() => ({
    initial: false,
    animate: { rotateY: isFlipped ? 180 : 0 },
    transition: { duration: 0.6, type: 'spring', stiffness: 150 }
  }), [isFlipped]);

  return (
    <div className="flashcard-container">
      <motion.div
        className={`flashcard ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
        {...cardVariants}
        layoutId={`card-${frontContent}`}
      >
        <div className="flashcard-front">
          <div className="content">{cardContent.front}</div>
          <div className="flip-hint">انقر للكشف عن الإجابة</div>
        </div>
        <div className="flashcard-back">
          <div className="content">{cardContent.back}</div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showRating && isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <KnowledgeLevelRating 
              onRate={handleRate}
              disabled={disabled}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flashcard-actions">
        <ShareButton 
          card={cardContent}
          deckTitle={deckTitle}
        />
      </div>
    </div>
  );
});

Flashcard.displayName = 'Flashcard';

export default Flashcard; 