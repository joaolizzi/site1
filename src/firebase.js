import { initializeApp, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "./config";

// Inicializa Firebase (evita duplicação)
let app;
try {
  app = getApp(); // pega a instância existente
} catch (error) {
  // se não existe, inicializa uma nova
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
