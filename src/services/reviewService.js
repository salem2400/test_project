import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  limit 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// تخزين مؤقت للإحصائيات
const statsCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 دقائق

export const updateReviewStats = async (userId, stats) => {
  try {
    await addDoc(collection(db, 'users', userId, 'reviews'), {
      ...stats,
      timestamp: serverTimestamp()
    });

    // إزالة البيانات المخزنة مؤقتاً عند التحديث
    statsCache.delete(userId);
    return true;
  } catch (error) {
    console.error('Error updating review stats:', error);
    throw error;
  }
};

export const getReviewStats = async (userId) => {
  try {
    // التحقق من وجود البيانات في الذاكرة المؤقتة
    const cachedStats = statsCache.get(userId);
    if (cachedStats && Date.now() - cachedStats.timestamp < CACHE_DURATION) {
      return cachedStats.data;
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // تحميل آخر 100 مراجعة فقط
    const reviewsQuery = query(
      collection(db, 'users', userId, 'reviews'),
      where('timestamp', '>=', weekAgo),
      orderBy('timestamp', 'desc'),
      limit(100)
    );

    const snapshot = await getDocs(reviewsQuery);
    const reviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const stats = {
      activeDecks: new Set(reviews.map(r => r.deckId)).size,
      totalReviews: reviews.length,
      totalMastered: reviews.filter(r => r.isMastered).length
    };

    // تخزين الإحصائيات في الذاكرة المؤقتة
    statsCache.set(userId, {
      data: stats,
      timestamp: Date.now()
    });

    return stats;
  } catch (error) {
    console.error('Error getting review stats:', error);
    throw error;
  }
}; 