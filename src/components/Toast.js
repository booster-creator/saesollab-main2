import React, { useEffect } from 'react';

function Toast({ message, type = 'error', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4l8 8m0-8l-8 8"/>
        </svg>
      </button>
    </div>
  );
}

export default Toast; 