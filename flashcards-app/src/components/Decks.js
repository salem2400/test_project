import React, { useState } from 'react';

const Decks = ({ onSelectDeck }) => {
  const [decks, setDecks] = useState([]);

  const createDeck = (name) => {
    setDecks([...decks, { name, cards: [] }]);
  };

  return (
    <div>
      <h2>Your Decks</h2>
      <button onClick={() => createDeck(prompt('Enter deck name'))}>Create Deck</button>
      <ul>
        {decks.map((deck, index) => (
          <li key={index} onClick={() => onSelectDeck(deck)}>{deck.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Decks;
