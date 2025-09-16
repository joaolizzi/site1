import React from 'react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar", type = "danger" }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content confirm-modal">
        <div className="modal-header">
          <h3 id="modal-title" className={`modal-title modal-title-${type}`}>
            {title}
          </h3>
          <button 
            className="close-modal"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>
        
        <div className="modal-footer">
          <button 
            className="modal-button modal-button-cancel"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`modal-button modal-button-${type}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
