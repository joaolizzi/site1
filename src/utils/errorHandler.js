// Utilitários para tratamento de erros
export const getErrorMessage = (error) => {
  if (error.code) {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/user-disabled':
        return 'Usuário desabilitado';
      case 'auth/user-not-found':
        return 'Usuário não encontrado';
      case 'auth/wrong-password':
        return 'Senha incorreta';
      case 'auth/email-already-in-use':
        return 'Email já está em uso';
      case 'auth/weak-password':
        return 'Senha muito fraca';
      case 'storage/unauthorized':
        return 'Não autorizado para fazer upload';
      case 'storage/canceled':
        return 'Upload cancelado';
      case 'storage/unknown':
        return 'Erro desconhecido no storage';
      case 'firestore/permission-denied':
        return 'Permissão negada';
      case 'firestore/unavailable':
        return 'Serviço indisponível';
      default:
        return error.message || 'Erro desconhecido';
    }
  }
  return error.message || 'Erro desconhecido';
};

export const showNotification = (message, type = 'info') => {
  // Criar elemento de notificação
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Estilos
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  // Cores baseadas no tipo
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };
  
  notification.style.backgroundColor = colors[type] || colors.info;
  
  document.body.appendChild(notification);
  
  // Animar entrada
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remover após 5 segundos
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
};
