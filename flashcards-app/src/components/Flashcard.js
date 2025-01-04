import React, { useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const Flashcard = ({ card, onReview }) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
    onReview(card);
  };

  return (
    <Card onClick={handleFlip} className={`flashcard ${flipped ? 'flipped' : ''}`}>
      <CardContent>
        <Typography variant="h5" component="div">
          {flipped ? card.translation : card.word}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Flashcard;