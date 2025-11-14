import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDFbArRrb5ms5wOh-yTs5BbLUpSDR9xXo",
  authDomain: "web-apps-5ec4c.firebaseapp.com",
  projectId: "web-apps-5ec4c",
  storageBucket: "web-apps-5ec4c.firebasestorage.app",
  messagingSenderId: "1008420765480",
  appId: "1:1008420765480:web:87a7745df25cbe885f9a1d",
  measurementId: "G-8TS8R640EK"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics only in browser
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, db, storage, analytics };
