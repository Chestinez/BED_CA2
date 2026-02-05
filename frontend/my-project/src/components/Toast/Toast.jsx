import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', show, onClose, duration = 3000 }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, duration]);

  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-success" />;
      case 'error':
        return <AlertCircle size={20} className="text-danger" />;
      default:
        return <CheckCircle size={20} className="text-success" />;
    }
  };

  const getBgClass = () => {
    switch (type) {
      case 'success':
        return 'bg-success';
      case 'error':
        return 'bg-danger';
      default:
        return 'bg-success';
    }
  };

  return (
    <div 
      className="position-fixed top-0 end-0 p-3" 
      style={{ zIndex: 1050 }}
    >
      <div className={`toast show ${getBgClass()} text-white`} role="alert">
        <div className="toast-body d-flex align-items-center">
          {getIcon()}
          <span className="ms-2 flex-grow-1">{message}</span>
          <button 
            type="button" 
            className="btn-close btn-close-white ms-2" 
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}