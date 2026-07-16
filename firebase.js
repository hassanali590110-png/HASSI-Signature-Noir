// ====================================
// FIREBASE CONFIG - HASSI SIGNATURE NOIR
// ====================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    setDoc
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBhdX1JwrCHyNF6paDiYtAQGSVRglWq9kY",
    authDomain: "hassi-signature-noir-23fb4.firebaseapp.com",
    projectId: "hassi-signature-noir-23fb4",
    storageBucket: "hassi-signature-noir-23fb4.firebasestorage.app",
    messagingSenderId: "108810711103",
    appId: "1:108810711103:web:5f35b8ece93159a598088a",
    measurementId: "G-LZ6SWF8CXJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export all functions
export {
    app,
    auth,
    db,
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    setDoc,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut
};

console.log('✅ Firebase Connected Successfully!');
console.log('🔥 Project:', firebaseConfig.projectId);