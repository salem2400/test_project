import React from 'react';
import { Button } from '@mui/material';

const ShareCard = ({ card }) => {
  const shareCard = () => {
    const shareData = {
      title: 'Flashcard',
      text: `Word: ${card.word}, Translation: ${card.translation}`,
      url: window.location.href
    };
    navigator.share(shareData).catch(console.error);
  };

  return (
    <Button variant="contained" color="primary" onClick={shareCard}>
      Share
    </Button>
  );
};

export default ShareCard;
