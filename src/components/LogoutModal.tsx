import React from 'react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="logout-overlay" id="logout-modal" onClick={onClose}>
      <style dangerouslySetInnerHTML={{ __html: `
        .logout-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: var(--bg-overlay);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.15s ease;
        }

        .logout-modal {
          width: 100%;
          max-width: 420px;
          background: var(--bg-card);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-overlay);
          padding: 32px;
          animation: scaleIn 0.2s ease;
        }

        .logout-modal h2 {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .logout-modal p {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 28px;
        }

        .logout-modal-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .logout-cancel-btn {
          padding: 8px 20px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }

        .logout-cancel-btn:hover {
          background: var(--bg-hover);
        }

        .logout-confirm-btn {
          padding: 8px 20px;
          border-radius: var(--radius-sm);
          border: none;
          background: var(--text-primary);
          color: #FFFFFF;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity var(--transition-fast);
        }

        .logout-confirm-btn:hover {
          opacity: 0.9;
        }
      ` }} />

      <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Leaving already?</h2>
        <p>
          You can log back in anytime to continue your meetings with Hintro.
        </p>
        <div className="logout-modal-actions">
          <button className="logout-cancel-btn" onClick={onClose} id="btn-cancel-logout">
            Cancel
          </button>
          <button className="logout-confirm-btn" onClick={onConfirm} id="btn-confirm-logout">
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};
