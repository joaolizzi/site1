import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { appConfig } from '../config';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = sessionStorage.getItem('admin_authenticated') === 'true';
      setIsAuthenticated(authStatus);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (password) => {
    if (password === appConfig.adminPassword) {
      try {
        // Salvar sessão no banco de dados
        const sessionId = crypto.randomUUID();
        await setDoc(doc(db, 'admin', 'sessions', sessionId), {
          authenticated: true,
          loginTime: serverTimestamp(),
          userAgent: navigator.userAgent,
          ip: 'unknown' // Será preenchido pelo servidor se necessário
        });
        
        // Salvar no sessionStorage para persistência local
        sessionStorage.setItem('admin_authenticated', 'true');
        sessionStorage.setItem('admin_session_id', sessionId);
        setIsAuthenticated(true);
        
        // Log da atividade
        await setDoc(doc(db, 'logs', 'auth_logs', crypto.randomUUID()), {
          action: 'login',
          timestamp: serverTimestamp(),
          sessionId: sessionId,
          userAgent: navigator.userAgent
        });
        
        return true;
      } catch (error) {
        console.error('Erro ao salvar sessão:', error);
        // Fallback para sessionStorage apenas
        sessionStorage.setItem('admin_authenticated', 'true');
        setIsAuthenticated(true);
        return true;
      }
    }
    return false;
  };

  const logout = async () => {
    try {
      const sessionId = sessionStorage.getItem('admin_session_id');
      if (sessionId) {
        // Marcar sessão como inativa no banco de dados
        await setDoc(doc(db, 'admin', 'sessions', sessionId), {
          authenticated: false,
          logoutTime: serverTimestamp()
        }, { merge: true });
        
        // Log da atividade
        await setDoc(doc(db, 'logs', 'auth_logs', crypto.randomUUID()), {
          action: 'logout',
          timestamp: serverTimestamp(),
          sessionId: sessionId
        });
      }
    } catch (error) {
      console.error('Erro ao salvar logout:', error);
    } finally {
      sessionStorage.removeItem('admin_authenticated');
      sessionStorage.removeItem('admin_session_id');
      setIsAuthenticated(false);
      navigate('/admin');
    }
  };

  const requireAuth = () => {
    if (!isAuthenticated && !loading) {
      navigate('/admin');
    }
  };

  return {
    isAuthenticated,
    loading,
    login,
    logout,
    requireAuth
  };
};
