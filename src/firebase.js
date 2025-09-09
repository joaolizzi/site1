import { initializeApp, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getStorage } from "firebase/storage"; // <-- ADICIONE ISSO

const firebaseConfig = {
  apiKey: "AIzaSyBfADQYaRc8EQFppGQnVNpD6XBai50totE",
  authDomain: "meuprojeto-257f0.firebaseapp.com",
  projectId: "meuprojeto-257f0",
  storageBucket: "meuprojeto-257f0.firebasestorage.app",
  messagingSenderId: "710773486236",
  appId: "1:710773486236:web:de6516c37c1709140bf359",
  measurementId: "G-Z8M0Q3M4RB"
};

// Inicializa Firebase (evita duplicação)
let app;
try {
  app = getApp(); // Tenta pegar a instância existente
} catch (error) {
  // Se não existe, inicializa uma nova
  app = initializeApp(firebaseConfig);
}

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); // <-- EXPORTA STORAGE

// Login anônimo (temporariamente desabilitado devido a problemas de API key)
export const loginAnonymously = async () => {
  try {
    // Verifica se a API key é válida antes de tentar fazer login
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey.length < 20) {
      console.warn("API key do Firebase inválida. Login anônimo desabilitado.");
      return;
    }
    
    const userCredential = await signInAnonymously(auth);
    console.log("Usuário anônimo logado:", userCredential.user.uid);
  } catch (error) {
    console.error("Erro no login anônimo:", error);
    console.warn("Para corrigir: verifique sua API key do Firebase no console do Firebase");
  }
};
