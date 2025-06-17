import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDG_ezAeYgbdBdReF90wlcnSOardH2x46I",
  authDomain: "vue-firebase-7de77.firebaseapp.com",
  projectId: "vue-firebase-7de77",
  storageBucket: "vue-firebase-7de77.appspot.com",
  messagingSenderId: "120517127738",
  appId: "1:120517127738:web:2f30d11e5cf8da65a9cf03",
  measurementId: "G-7TZVZQ6PY9",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(firebaseApp);
// Import and initialize Firebase Authentication
const auth = getAuth();
export { db, auth };