import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore, 
  CACHE_SIZE_UNLIMITED,
  enableMultiTabIndexedDbPersistence
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDS_BB059VTZp9j8ggIhFxo7jadYA2ut3Y",
  authDomain: "alx-project-graduation.firebaseapp.com",
  projectId: "alx-project-graduation",
  storageBucket: "alx-project-graduation.firebasestorage.app",
  messagingSenderId: "802036035513",
  appId: "1:802036035513:web:237b2dd2087a8417b99068",
  measurementId: "G-22K8BQ2WBP"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تهيئة Firestore مع تحسينات الأداء
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true,
  ignoreUndefinedProperties: true
});

// تمكين التخزين المحلي متعدد التبويبات
try {
  enableMultiTabIndexedDbPersistence(db);
} catch (err) {
  console.error('Error enabling multi-tab persistence:', err);
}

// الحصول على مثيل المصادقة
const auth = getAuth(app);

// تهيئة Analytics
const analytics = getAnalytics(app);

export { app, db, auth, analytics }; 