// Configuração centralizada do Firebase
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBfADQYaRc8EQFppGQnVNpD6XBai50totE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "meuprojeto-257f0.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "meuprojeto-257f0",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "meuprojeto-257f0.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "710773486236",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:710773486236:web:de6516c37c1709140bf359",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Z8M0Q3M4RB"
};

// Configurações da aplicação
export const appConfig = {
  adminPassword: import.meta.env.VITE_ADMIN_PASSWORD || "mmgadmin",
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  candidateStatuses: ['Backlog', 'Aprovado', 'Rejeitado']
};
