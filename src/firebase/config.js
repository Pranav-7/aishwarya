import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// Replace with your actual Firebase config from Firebase Console

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDaXFB5qPQ_-NMTSTxq3TTPm6f4_H3vHuw",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "aishwarya-cac35.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "aishwarya-cac35",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "aishwarya-cac35.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "977495159633",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:977495159633:web:a4ac94f5f9d8156bc55970",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-GH4TP7ERGX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app; 