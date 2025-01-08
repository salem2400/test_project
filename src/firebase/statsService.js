import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';
import { db } from './config';

// الحصول على إحصائيات المستخدم
export const getUserStats = async (userId) => {
  const statsRef = doc(db, 'stats', userId);
  const statsDoc = await getDoc(statsRef);
  
  if (!statsDoc.exists()) {
    // إنشاء إحصائيات جديدة إذا لم تكن موجودة
    const initialStats = {
      totalCards: 0,
      reviewedCards: 0,
      masteredCards: 0,
      streakDays: 0,
      lastReviewDate: null
    };
    await setDoc(statsRef, initialStats);
    return initialStats;
  }
  
  return statsDoc.data();
};

// تحديث إحصائيات المستخدم
export const updateUserStats = async (userId, statsData) => {
  const statsRef = doc(db, 'stats', userId);
  return updateDoc(statsRef, statsData);
};

// تحديث إحصائيات المراجعة
export const updateReviewStats = async (userId, { isCorrect, isMastered }) => {
  const statsRef = doc(db, 'stats', userId);
  const stats = await getDoc(statsRef);
  const currentStats = stats.exists() ? stats.data() : {};
  
  const now = new Date();
  const lastReviewDate = currentStats.lastReviewDate ? new Date(currentStats.lastReviewDate) : null;
  
  // التحقق من التتابع اليومي
  let streakDays = currentStats.streakDays || 0;
  if (lastReviewDate) {
    const dayDiff = Math.floor((now - lastReviewDate) / (1000 * 60 * 60 * 24));
    if (dayDiff === 1) {
      streakDays++;
    } else if (dayDiff > 1) {
      streakDays = 1;
    }
  } else {
    streakDays = 1;
  }
  
  return updateDoc(statsRef, {
    reviewedCards: (currentStats.reviewedCards || 0) + 1,
    masteredCards: isMastered ? (currentStats.masteredCards || 0) + 1 : (currentStats.masteredCards || 0),
    streakDays,
    lastReviewDate: now.toISOString(),
    correctAnswers: isCorrect ? (currentStats.correctAnswers || 0) + 1 : (currentStats.correctAnswers || 0),
    totalReviews: (currentStats.totalReviews || 0) + 1
  });
}; 