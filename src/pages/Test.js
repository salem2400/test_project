import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeck } from '../firebase/deckService';
import { updateReviewStats } from '../firebase/statsService';
import Navbar from '../components/Navbar';
import '../styles/Test.css';

function Test() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [testComplete, setTestComplete] = useState(false);

  const loadDeck = useCallback(async () => {
    try {
      const deckData = await getDeck(id);
      if (!deckData) {
        setError('لم يتم العثور على المجموعة');
        return;
      }
      const shuffledCards = [...deckData.cards].sort(() => Math.random() - 0.5);
      setDeck({ ...deckData, cards: shuffledCards });
    } catch (err) {
      console.error('Error loading deck:', err);
      setError('حدث خطأ أثناء تحميل المجموعة');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDeck();
  }, [loadDeck]);

  const handleAnswer = useCallback(async (isCorrect) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    try {
      await updateReviewStats(deck.userId, {
        isCorrect,
        isMastered: false,
        timeSpent: 0
      });
    } catch (err) {
      console.error('Error updating stats:', err);
    }

    if (currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setTestComplete(true);
    }
  }, [currentCardIndex, deck?.cards?.length, deck?.userId]);

  const currentCard = useMemo(() => 
    deck?.cards?.[currentCardIndex] || null,
    [deck?.cards, currentCardIndex]
  );

  const progress = useMemo(() => ({
    current: currentCardIndex + 1,
    total: deck?.cards?.length || 0
  }), [currentCardIndex, deck?.cards?.length]);

  const scorePercentage = useMemo(() => 
    Math.round((score / (deck?.cards?.length || 1)) * 100),
    [score, deck?.cards?.length]
  );

  if (loading) {
    return (
      <div className="test-page">
        <Navbar />
        <div className="loading">جاري التحميل...</div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="test-page">
        <Navbar />
        <div className="error">{error || 'لم يتم العثور على المجموعة'}</div>
        <button 
          className="back-button"
          onClick={() => navigate('/decks')}
        >
          العودة إلى المجموعات
        </button>
      </div>
    );
  }

  if (testComplete) {
    return (
      <div className="test-page">
        <Navbar />
        <div className="test-complete">
          <h2>اكتمل الاختبار!</h2>
          <div className="score">
            النتيجة: {score} من {progress.total} ({scorePercentage}%)
          </div>
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

  if (!currentCard) return null;

  return (
    <div className="test-page">
      <Navbar />
      <div className="test-container">
        <div className="progress">
          البطاقة {progress.current} من {progress.total}
        </div>
        
        <div className="card">
          <div className="card-front">
            {currentCard.front}
          </div>
          
          {showAnswer ? (
            <>
              <div className="card-back">
                {currentCard.back}
              </div>
              <div className="answer-buttons">
                <button 
                  className="wrong-button"
                  onClick={() => handleAnswer(false)}
                >
                  غير صحيح
                </button>
                <button 
                  className="correct-button"
                  onClick={() => handleAnswer(true)}
                >
                  صحيح
                </button>
              </div>
            </>
          ) : (
            <button 
              className="show-answer-button"
              onClick={() => setShowAnswer(true)}
            >
              عرض الإجابة
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Test; 