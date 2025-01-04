import React, { useState } from 'react';
import './Flashcard.css';

const Flashcard = ({ front, back, onNext }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
      <div className="flashcard-inner">
        <div className="flashcard-front">{front}</div>
        <div className="flashcard-back">{back}</div>
      </div>
      <button onClick={onNext}>Next Card</button>
    </div>
  );
};

export default Flashcard;
