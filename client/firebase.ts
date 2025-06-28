// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDkf0VwbCFs-rBNwsWuzWan_YmEv6EH5Z4",
    authDomain: "trip-journal-6db6e.firebaseapp.com",
    projectId: "trip-journal-6db6e",
    storageBucket: "trip-journal-6db6e.firebasestorage.app",
    messagingSenderId: "1064769800862",
    appId: "1:1064769800862:web:2f02fb4e7d22b2c9b0c98f",
    measurementId: "G-C4H64SS3ZL"
  };
  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

const provider = new GoogleAuthProvider();

export { auth, storage, onAuthStateChanged, provider };
