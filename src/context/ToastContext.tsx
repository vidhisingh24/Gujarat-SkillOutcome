import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Render Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast-item toast-${toast.type}`}>
            <div className="toast-content">
              {toast.type === 'success' && <span className="toast-icon">✓</span>}
              {toast.type === 'error' && <span className="toast-icon">✗</span>}
              {toast.type === 'warning' && <span className="toast-icon">⚠</span>}
              {toast.type === 'info' && <span className="toast-icon">ℹ</span>}
              <p className="toast-message">{toast.message}</p>
            </div>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>×</button>
          </div>
        ))}
      </div>

      {/* Styled inline for container, items styling should compile */}
      <style>{`
        .toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 9999;
          max-width: 380px;
          width: calc(100% - 48px);
        }
        .toast-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-button);
          padding: 12px 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          animation: slideIn 0.2s ease-out;
        }
        .toast-content {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .toast-icon {
          font-weight: bold;
          font-size: 16px;
        }
        .toast-message {
          font-size: 13px;
          color: var(--text-primary);
          margin: 0;
          font-weight: 500;
        }
        .toast-close {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 18px;
          cursor: pointer;
          padding-left: 8px;
          display: flex;
          align-items: center;
        }
        .toast-close:hover {
          color: var(--text-primary);
        }
        .toast-success {
          border-left: 4px solid var(--status-green-text);
        }
        .toast-success .toast-icon {
          color: var(--status-green-text);
        }
        .toast-error {
          border-left: 4px solid var(--status-red-text);
        }
        .toast-error .toast-icon {
          color: var(--status-red-text);
        }
        .toast-warning {
          border-left: 4px solid var(--status-yellow-text);
        }
        .toast-warning .toast-icon {
          color: var(--status-yellow-text);
        }
        .toast-info {
          border-left: 4px solid var(--accent-icon);
        }
        .toast-info .toast-icon {
          color: var(--accent-icon);
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
