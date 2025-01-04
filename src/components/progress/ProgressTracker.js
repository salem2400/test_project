import React from 'react';
import { useProgress } from '../../contexts/ProgressContext';

const ProgressTracker = () => {
  const { progress } = useProgress();

  return (
    <div className="progress-tracker">
      <h3>Your Progress</h3>
      <div className="stats">
        <div>Cards Reviewed: {progress.cardsReviewed}</div>
        <div>Current Streak: {progress.streak} days</div>
        <div>Accuracy: {progress.accuracy}%</div>
      </div>
    </div>
  );
};

export default ProgressTracker;
