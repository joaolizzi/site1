import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getStorage } from "firebase/storage"; // <-- ADICIONE ISSO

const firebaseConfig = {
  apiKey: "AIzaSyBfADQYaRc8EQFppGQnVNpD6XBai50totE",
  authDomain: "meuprojeto-257f0.firebaseapp.com",
  projectId: "meuprojeto-257f0",
  storageBucket: "meuprojeto-257f0.appspot.com",
  messagingSenderId: "710773486236",
  appId: "1:710773486236:web:e9529bab7f7ec7c80bf359",
  measurementId: "G-05PKZ06N10"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); // <-- EXPORTA STORAGE

// Login anônimo
export const loginAnonymously = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    console.log("Usuário anônimo logado:", userCredential.user.uid);
  } catch (error) {
    console.error("Erro no login anônimo:", error);
  }
};
