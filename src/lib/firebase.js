// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
 apiKey: "AIzaSyB2LpViBE5VnIaPRBK_x15Ym2OCznKsT1Y",
  authDomain: "workcomfo-368fa.firebaseapp.com",
  projectId: "workcomfo-368fa",
  storageBucket: "workcomfo-368fa.firebasestorage.app",
  messagingSenderId: "135282646273",
  appId: "1:135282646273:web:99b55559e1ebb9f877cf00",
  measurementId: "G-FTP1DV8JGV"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
