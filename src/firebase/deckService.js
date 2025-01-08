import { db } from './config';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  limit, 
  orderBy,
  writeBatch,
  updateDoc,
  deleteDoc,
  addDoc,
  startAfter,
  serverTimestamp
} from 'firebase/firestore';

const CARDS_PER_PAGE = 20;
const DECKS_PER_PAGE = 10;

// إنشاء مجموعة جديدة
export const createDeck = async (userId, deckData) => {
  try {
    const decksRef = collection(db, 'decks');
    const newDeck = {
      ...deckData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      cardsCount: 0
    };
    const docRef = await addDoc(decksRef, newDeck);
    return { id: docRef.id, ...newDeck };
  } catch (error) {
    console.error('Error creating deck:', error);
    throw error;
  }
};

// حذف مجموعة
export const deleteDeck = async (deckId) => {
  try {
    const batch = writeBatch(db);
    
    // حذف جميع البطاقات في المجموعة
    const cardsQuery = query(
      collection(db, 'cards'),
      where('deckId', '==', deckId)
    );
    const cardsSnap = await getDocs(cardsQuery);
    cardsSnap.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // حذف المجموعة نفسها
    batch.delete(doc(db, 'decks', deckId));
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error deleting deck:', error);
    throw error;
  }
};

// جلب مجموعات المستخدم
export const getUserDecks = async (userId, lastDoc = null) => {
  try {
    let decksQuery = query(
      collection(db, 'decks'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(DECKS_PER_PAGE)
    );

    if (lastDoc) {
      decksQuery = query(decksQuery, startAfter(lastDoc));
    }

    const snapshot = await getDocs(decksQuery);
    const decks = await Promise.all(
      snapshot.docs.map(async doc => {
        const deckData = { id: doc.id, ...doc.data() };
        
        // جلب عدد البطاقات لكل مجموعة
        const cardsQuery = query(
          collection(db, 'cards'),
          where('deckId', '==', doc.id)
        );
        const cardsSnap = await getDocs(cardsQuery);
        deckData.cardsCount = cardsSnap.size;
        
        return deckData;
      })
    );

    return {
      decks,
      lastDoc: snapshot.docs[snapshot.docs.length - 1],
      hasMore: snapshot.docs.length === DECKS_PER_PAGE
    };
  } catch (error) {
    console.error('Error getting user decks:', error);
    throw error;
  }
};

export const getDeck = async (deckId) => {
  try {
    const deckRef = doc(db, 'decks', deckId);
    const deckSnap = await getDoc(deckRef);
    
    if (!deckSnap.exists()) {
      return null;
    }

    const deckData = { id: deckSnap.id, ...deckSnap.data() };
    
    // جلب البطاقات على دفعات
    const cardsQuery = query(
      collection(db, 'cards'),
      where('deckId', '==', deckId),
      orderBy('createdAt', 'desc'),
      limit(CARDS_PER_PAGE)
    );
    
    const cardsSnap = await getDocs(cardsQuery);
    const cards = cardsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { ...deckData, cards };
  } catch (error) {
    console.error('Error getting deck:', error);
    throw error;
  }
};

export const loadMoreCards = async (deckId, lastCard) => {
  try {
    const cardsQuery = query(
      collection(db, 'cards'),
      where('deckId', '==', deckId),
      orderBy('createdAt', 'desc'),
      startAfter(lastCard.createdAt),
      limit(CARDS_PER_PAGE)
    );
    
    const cardsSnap = await getDocs(cardsQuery);
    return cardsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error loading more cards:', error);
    throw error;
  }
};

export const updateCardInDeck = async (deckId, cardId, cardData) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    await updateDoc(cardRef, {
      ...cardData,
      updatedAt: new Date().toISOString()
    });
    
    // تحديث وقت تعديل المجموعة
    const deckRef = doc(db, 'decks', deckId);
    await updateDoc(deckRef, {
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating card:', error);
    throw error;
  }
};

export const deleteCardFromDeck = async (deckId, cardId) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    await deleteDoc(cardRef);
    
    // تحديث وقت تعديل المجموعة
    const deckRef = doc(db, 'decks', deckId);
    await updateDoc(deckRef, {
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
};

export const addCardToDeck = async (deckId, cardData) => {
  try {
    const cardsRef = collection(db, 'cards');
    const timestamp = serverTimestamp();
    
    await addDoc(cardsRef, {
      ...cardData,
      deckId,
      createdAt: timestamp,
      updatedAt: timestamp
    });
    
    // تحديث وقت تعديل المجموعة
    const deckRef = doc(db, 'decks', deckId);
    await updateDoc(deckRef, {
      updatedAt: timestamp
    });
  } catch (error) {
    console.error('Error adding card:', error);
    throw error;
  }
};

export const addMultipleCardsToDeck = async (deckId, cardsData) => {
  try {
    const batch = writeBatch(db);
    const timestamp = serverTimestamp();

    cardsData.forEach(cardData => {
      const cardRef = doc(collection(db, 'cards'));
      batch.set(cardRef, {
        ...cardData,
        deckId,
        createdAt: timestamp,
        updatedAt: timestamp
      });
    });
    
    // تحديث وقت تعديل المجموعة
    const deckRef = doc(db, 'decks', deckId);
    batch.update(deckRef, {
      updatedAt: timestamp
    });

    await batch.commit();
  } catch (error) {
    console.error('Error adding multiple cards:', error);
    throw error;
  }
}; 