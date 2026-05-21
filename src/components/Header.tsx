import React, { useState, useRef, useEffect } from 'react';
import { Play, ChevronDown, LogOut, User, Users, Menu } from 'lucide-react';

interface HeaderProps {
  userId: string;
  setUserId: (id: string) => void;
  userName: string;
  userEmail: string;
  isLoading: boolean;
  onLogout: () => void;
  activeTab: string;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userId,
  setUserId,
  userName,
  isLoading,
  onLogout,
  activeTab,
  onOpenMobileMenu,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'call-insights': return 'Call Insights';
      case 'knowledge-base': return 'Knowledge Base';
      case 'prompts': return 'Prompts';
      case 'boxy-controls': return 'Boxy Controls';
      default: return 'Dashboard';
    }
  };

  const initials = isLoading
    ? '..'
    : userName
      ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : 'U';

  return (
    <header className="header" id="header">
      <style dangerouslySetInnerHTML={{ __html: `
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 32px;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-content);
          position: sticky;
          top: 0;
          z-index: 5;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-mobile-menu-btn {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: 4px;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-xs);
          transition: background-color var(--transition-fast);
        }

        .header-mobile-menu-btn:hover {
          background-color: var(--bg-hover);
        }

        .header-title {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-tutorial-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color var(--transition-fast), border-color var(--transition-fast);
        }

        .header-tutorial-btn:hover {
          background: var(--bg-hover);
          border-color: var(--text-tertiary);
        }

        .header-tutorial-btn svg {
          color: var(--text-secondary);
        }

        .header-profile-wrapper {
          position: relative;
        }

        .header-profile-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: var(--radius-full);
          transition: opacity var(--transition-fast);
        }

        .header-profile-btn:hover {
          opacity: 0.8;
        }

        .header-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #E5E7EB;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .header-avatar svg {
          color: #9CA3AF;
        }

        .header-avatar-initials {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--color-purple);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
        }

        .header-chevron {
          color: var(--text-tertiary);
        }

        .header-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 220px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          z-index: 100;
          animation: scaleIn 0.15s ease;
          overflow: hidden;
        }

        .header-dropdown-section {
          padding: 8px;
        }

        .header-dropdown-section + .header-dropdown-section {
          border-top: 1px solid var(--border-color);
        }

        .header-dropdown-label {
          padding: 8px 12px 4px;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .header-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 8px 12px;
          border-radius: var(--radius-xs);
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          transition: background-color var(--transition-fast), color var(--transition-fast);
        }

        .header-dropdown-item:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .header-dropdown-item.active {
          background: var(--bg-active);
          color: var(--color-primary);
        }

        .header-dropdown-item.danger {
          color: var(--color-error);
        }

        .header-dropdown-item.danger:hover {
          background: var(--color-error-bg);
          color: var(--color-error);
        }

        .header-dropdown-user-info {
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-dropdown-user-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .header-dropdown-user-email {
          font-size: 12px;
          color: var(--text-tertiary);
        }

        @media (max-width: 1024px) {
          .header {
            padding: 12px 16px;
            min-height: 56px;
          }

          .header-mobile-menu-btn {
            display: flex;
          }

          .header-title {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: 17px;
            font-weight: 600;
            margin: 0;
          }

          .header-tutorial-btn {
            display: none !important;
          }
        }

        @media (max-width: 640px) {
          .header {
            padding: 12px 16px;
          }
        }
      ` }} />

      <div className="header-left">
        <button
          className="header-mobile-menu-btn"
          onClick={onOpenMobileMenu}
          id="btn-mobile-menu"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="header-title">{getPageTitle()}</h1>
      </div>

      <div className="header-right">
        <button className="header-tutorial-btn" id="btn-watch-tutorial">
          <Play size={14} fill="currentColor" />
          <span>Watch Tutorial</span>
        </button>

        <div className="header-profile-wrapper" ref={dropdownRef}>
          <button
            className="header-profile-btn"
            id="btn-profile"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {userName ? (
              <div className="header-avatar-initials">{initials}</div>
            ) : (
              <div className="header-avatar">
                <User size={20} />
              </div>
            )}
            <ChevronDown size={16} className="header-chevron" />
          </button>

          {isDropdownOpen && (
            <div className="header-dropdown" id="profile-dropdown">
              <div className="header-dropdown-section">
                <div className="header-dropdown-label">Switch User</div>
                <button
                  className={`header-dropdown-item ${userId === 'u1' ? 'active' : ''}`}
                  onClick={() => { setUserId('u1'); setIsDropdownOpen(false); }}
                >
                  <Users size={14} />
                  <span>User 1 — John Doe (Empty)</span>
                </button>
                <button
                  className={`header-dropdown-item ${userId === 'u2' ? 'active' : ''}`}
                  onClick={() => { setUserId('u2'); setIsDropdownOpen(false); }}
                >
                  <Users size={14} />
                  <span>User 2 — Jane Smith (Data)</span>
                </button>
              </div>

              <div className="header-dropdown-section">
                <button
                  className="header-dropdown-item danger"
                  onClick={() => { setIsDropdownOpen(false); onLogout(); }}
                  id="btn-logout"
                >
                  <LogOut size={14} />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
