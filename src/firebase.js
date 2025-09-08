// Firebase configuration - inserido pelo usuário
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBfADQYaRc8EQFppGQnVNpD6XBai50totE",
  authDomain: "meuprojeto-257f0.firebaseapp.com",
  projectId: "meuprojeto-257f0",
  storageBucket: "meuprojeto-257f0.appspot.com",
  messagingSenderId: "710773486236",
  appId: "1:710773486236:web:e9529bab7f7ec7c80bf359",
  measurementId: "G-05PKZ06N10"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
