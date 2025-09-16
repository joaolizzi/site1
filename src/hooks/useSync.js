import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const useSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('syncing');
      performSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('error');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificar status inicial
    if (navigator.onLine) {
      performSync();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const performSync = async () => {
    try {
      setSyncStatus('syncing');
      
      // Salvar timestamp da última sincronização
      await setDoc(doc(db, 'admin', 'sync_status'), {
        lastSync: serverTimestamp(),
        status: 'success',
        userAgent: navigator.userAgent
      });

      setLastSync(new Date());
      setSyncStatus('success');
      
      // Resetar status após 3 segundos
      setTimeout(() => {
        setSyncStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Erro na sincronização:', error);
      setSyncStatus('error');
    }
  };

  const forceSync = async () => {
    await performSync();
  };

  return {
    isOnline,
    lastSync,
    syncStatus,
    forceSync
  };
};
