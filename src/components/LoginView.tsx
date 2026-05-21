import React, { useState } from 'react';
import { Mail, Eye, EyeOff } from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    onLogin(email);
  };

  const handleQuickSelect = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setPassword('••••••••');
    setError('');
    // Slight timeout for high-quality mock login feel
    setTimeout(() => {
      onLogin(selectedEmail);
    }, 400);
  };

  return (
    <div className="login-page-container" id="login-page">
      <style dangerouslySetInnerHTML={{ __html: `
        .login-page-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          width: 100vw;
          background: #FFFFFF;
          box-sizing: border-box;
          padding: 24px;
        }

        .login-form-wrapper {
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: scaleIn 0.25s ease;
        }

        .login-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          text-align: center;
          margin-bottom: 32px;
          letter-spacing: -0.02em;
        }

        .login-form {
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .login-field {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .login-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
          letter-spacing: -0.01em;
          text-align: left;
        }

        .login-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .login-input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-secondary);
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          font-size: 14px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: #F9FAFB;
          color: var(--text-primary);
          outline: none;
          transition: border-color var(--transition-fast), background-color var(--transition-fast);
          font-family: var(--font-family);
        }

        .login-input::placeholder {
          color: var(--text-tertiary);
        }

        .login-input:focus {
          border-color: var(--text-primary);
          background: #FFFFFF;
        }

        .login-input-password {
          width: 100%;
          padding: 12px 42px 12px 14px;
          font-size: 14px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: #F9FAFB;
          color: var(--text-primary);
          outline: none;
          transition: border-color var(--transition-fast), background-color var(--transition-fast);
          font-family: var(--font-family);
        }

        .login-input-password::placeholder {
          color: var(--text-tertiary);
        }

        .login-input-password:focus {
          border-color: var(--text-primary);
          background: #FFFFFF;
        }

        .login-password-toggle {
          position: absolute;
          right: 14px;
          color: var(--text-secondary);
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: color var(--transition-fast);
        }

        .login-password-toggle:hover {
          color: var(--text-primary);
        }

        .login-error {
          font-size: 12px;
          color: var(--color-error);
          margin-bottom: 16px;
          text-align: left;
          width: 100%;
          font-weight: 500;
        }

        .login-btn-container {
          display: flex;
          justify-content: center;
          width: 100%;
          margin-top: 8px;
        }

        .login-btn {
          width: 100%;
          padding: 12px 24px;
          background: #000000;
          color: #FFFFFF;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: opacity var(--transition-fast);
          text-align: center;
          font-family: var(--font-family);
        }

        .login-btn:hover {
          opacity: 0.9;
        }

        /* Demo helper styling */
        .login-demo-helper {
          margin-top: 64px;
          padding: 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-hover);
          width: 100%;
          max-width: 400px;
          box-sizing: border-box;
          text-align: center;
        }

        .login-demo-helper-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .login-demo-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .login-demo-btn {
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: #FFFFFF;
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color var(--transition-fast), border-color var(--transition-fast);
        }

        .login-demo-btn:hover {
          background: var(--bg-hover);
          border-color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .login-btn {
            width: 140px;
          }
          .login-demo-actions {
            flex-direction: column;
            gap: 8px;
          }
          .login-demo-btn {
            width: 100%;
          }
        }
      ` }} />

      <div className="login-form-wrapper">
        <h1 className="login-title">Login</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-label">Email</label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">
                <Mail size={16} />
              </span>
              <input
                type="email"
                className="login-input"
                placeholder="Example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="login-email"
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <div className="login-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="login-input-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="login-password"
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <div className="login-error">{error}</div>}

          <div className="login-btn-container">
            <button type="submit" className="login-btn" id="btn-login-submit">
              Login
            </button>
          </div>
        </form>
      </div>

      {/* Developer Demo Account Selector */}
      <div className="login-demo-helper">
        <h3 className="login-demo-helper-title">Demo User Profiles</h3>
        <div className="login-demo-actions">
          <button
            className="login-demo-btn"
            onClick={() => handleQuickSelect('jane@gmail.com')}
            title="Log in as Jane Smith (populated data)"
            id="btn-demo-user2"
          >
            User 2 — Jane Smith (Data)
          </button>
          <button
            className="login-demo-btn"
            onClick={() => handleQuickSelect('john@gmail.com')}
            title="Log in as John Doe (empty state)"
            id="btn-demo-user1"
          >
            User 1 — John Doe (Empty)
          </button>
        </div>
      </div>
    </div>
  );
};
