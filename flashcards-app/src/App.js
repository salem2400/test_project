import React, { useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import Login from './components/Login';
import Register from './components/Register';
import Decks from './components/Decks';
import Flashcard from './components/Flashcard';
import ProgressTracker from './components/ProgressTracker';
import ShareCard from './components/ShareCard';
import './App.css';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentCard, setCurrentCard] = useState({ word: 'Hello', translation: 'Hola' });
  const [reviewedCards, setReviewedCards] = useState([]);

  const handleReview = (card) => {
    setReviewedCards([...reviewedCards, card]);
    setProgress(progress + 1);
  };

  const handleSelectDeck = (deck) => {
    // Set the current card to the first card in the selected deck
    if (deck.cards.length > 0) {
      setCurrentCard(deck.cards[0]);
    }
  };

  return (
    <Container>
      {!authenticated ? (
        <>
          <Login onLogin={setAuthenticated} />
          <Register onRegister={setAuthenticated} />
        </>
      ) : (
        <>
          <Decks onSelectDeck={handleSelectDeck} />
          <Flashcard card={currentCard} onReview={handleReview} />
          <ProgressTracker progress={progress} />
          <ShareCard card={currentCard} />
          <div>
            <Typography variant="h4" component="h2" gutterBottom>
              Reviewed Cards
            </Typography>
            <List>
              {reviewedCards.map((card, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${card.word} - ${card.translation}`} />
                </ListItem>
              ))}
            </List>
          </div>
        </>
      )}
    </Container>
  );
}

export default App;
