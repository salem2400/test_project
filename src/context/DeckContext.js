import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getUserDecks } from '../firebase/deckService';
import { useAuth } from '../context/AuthContext';

const DeckContext = createContext();

export const useDeckContext = () => {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error('useDeckContext must be used within a DeckProvider');
  }
  return context;
};

export const DeckProvider = ({ children }) => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const loadDecks = useCallback(async () => {
    if (!user) {
      setDecks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await getUserDecks(user.uid);
      setDecks(result.decks);
    } catch (err) {
      console.error('Error loading decks:', err);
      setError('حدث خطأ أثناء تحميل المجموعات');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateDeck = useCallback((deckId, newData) => {
    setDecks(prevDecks => 
      prevDecks.map(deck => 
        deck.id === deckId ? { ...deck, ...newData } : deck
      )
    );
  }, []);

  const deleteDeckFromCache = useCallback((deckId) => {
    setDecks(prevDecks => prevDecks.filter(deck => deck.id !== deckId));
  }, []);

  const addDeckToCache = useCallback((newDeck) => {
    setDecks(prevDecks => [...prevDecks, newDeck]);
  }, []);

  useEffect(() => {
    loadDecks();
  }, [loadDecks]);

  const value = {
    decks,
    loading,
    error,
    loadDecks,
    updateDeck,
    deleteDeckFromCache,
    addDeckToCache,
  };

  return (
    <DeckContext.Provider value={value}>
      {children}
    </DeckContext.Provider>
  );
}; 