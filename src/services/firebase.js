// src/services/firebase.js
import { initializeApp, getApps, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut as fbSignOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyAQy9z5kUrEcAaKdCKGkv2dsj4Nrjv3rn8",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "team-portfolio-2.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "team-portfolio-2",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "team-portfolio-2.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "151683874008",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:151683874008:web:a5828e498f4b7cb3aaabad",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-SWEFY90WPB",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Helper to create Firebase Auth accounts for team members without logging out the current admin
export const registerUserWithSecondaryAuth = async (email, password) => {
  const secondaryApp = initializeApp(firebaseConfig, `SecondaryAuth-${Date.now()}`);
  const secondaryAuth = getAuth(secondaryApp);
  try {
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const uid = userCredential.user.uid;
    await fbSignOut(secondaryAuth);
    await deleteApp(secondaryApp);
    return uid;
  } catch (err) {
    try {
      await deleteApp(secondaryApp);
    } catch {}
    throw err;
  }
};

// Analytics
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export { analytics };
export default app;
