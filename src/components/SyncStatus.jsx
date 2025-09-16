import React from 'react';
import { useSync } from '../hooks/useSync';

export default function SyncStatus() {
  const { isOnline, lastSync, syncStatus, forceSync } = useSync();

  const getStatusIcon = () => {
    if (!isOnline) return '🔴';
    if (syncStatus === 'syncing') return '🔄';
    if (syncStatus === 'success') return '✅';
    if (syncStatus === 'error') return '⚠️';
    return '🟢';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (syncStatus === 'syncing') return 'Sincronizando...';
    if (syncStatus === 'success') return 'Sincronizado';
    if (syncStatus === 'error') return 'Erro na sincronização';
    return 'Online';
  };

  const formatLastSync = () => {
    if (!lastSync) return '';
    return `Última sincronização: ${lastSync.toLocaleTimeString()}`;
  };

  return (
    <div className="sync-status">
      <div className="sync-indicator">
        <span className="sync-icon">{getStatusIcon()}</span>
        <span className="sync-text">{getStatusText()}</span>
      </div>
      {lastSync && (
        <div className="sync-details">
          <small>{formatLastSync()}</small>
        </div>
      )}
      {!isOnline && (
        <button 
          onClick={forceSync} 
          className="sync-button"
          disabled={!isOnline}
        >
          Tentar Sincronizar
        </button>
      )}
    </div>
  );
}
