import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  BookOpen,
  MessageSquare,
  Settings2,
  Info,
  Gift,
  Download,
  X,
  History,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openFeedback: () => void;
  openFeedbackHistory?: () => void;
  used?: number;
  limit?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  openFeedback,
  openFeedbackHistory,
  used = 0,
  limit = 1000,
  isOpen = false,
  onClose,
}) => {
  const percentage = limit > 0 ? Math.min(Math.round((used / limit) * 100), 100) : 0;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
      <style dangerouslySetInnerHTML={{ __html: `
        .sidebar {
          width: var(--sidebar-width);
          min-width: var(--sidebar-width);
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg-sidebar);
          border-right: 1px solid var(--border-color);
          padding: 24px 16px;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .sidebar-close-btn {
          display: none;
          position: absolute;
          top: 16px;
          left: 16px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 4px;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-xs);
          z-index: 101;
          transition: background-color var(--transition-fast);
        }

        .sidebar-close-btn:hover {
          background-color: var(--bg-hover);
        }

        .desktop-only {
          display: flex !important;
        }

        .mobile-only {
          display: none !important;
        }

        .sidebar-logo {
          padding: 0 12px;
          margin-bottom: 32px;
        }

        .sidebar-logo h1 {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          background: transparent;
          border: none;
          text-align: left;
          width: 100%;
          transition: background-color var(--transition-fast), color var(--transition-fast);
          position: relative;
        }

        .sidebar-nav-item:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .sidebar-nav-item.active {
          background: var(--bg-active);
          color: var(--color-primary);
        }

        .sidebar-nav-item.active .sidebar-nav-icon {
          color: var(--color-primary);
        }

        .sidebar-nav-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          color: var(--text-tertiary);
          transition: color var(--transition-fast);
        }

        .sidebar-nav-item:hover .sidebar-nav-icon {
          color: var(--text-secondary);
        }

        .sidebar-nav-item.active .sidebar-nav-icon {
          color: var(--color-primary);
        }

        .sidebar-nav-label {
          flex: 1;
        }

        .sidebar-nav-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          color: var(--text-tertiary);
          flex-shrink: 0;
        }

        .sidebar-bottom {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: auto;
          padding-top: 16px;
        }

        .sidebar-bottom-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          background: transparent;
          border: none;
          text-align: left;
          width: 100%;
          transition: background-color var(--transition-fast), color var(--transition-fast);
        }

        .sidebar-bottom-item:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .sidebar-bottom-item .sidebar-nav-icon {
          color: var(--text-tertiary);
        }

        .sidebar-usage-card {
          background: rgba(0, 0, 0, 0.04);
          border-radius: var(--radius-sm);
          padding: 16px;
          margin-top: 16px;
          margin-bottom: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .sidebar-usage-text {
          font-size: 13px;
          color: var(--text-primary);
          text-align: center;
          font-weight: 500;
        }

        .sidebar-usage-text strong {
          font-weight: 700;
        }

        .sidebar-usage-progress-container {
          width: 100%;
          height: 6px;
          background: rgba(0, 0, 0, 0.08);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin: 4px 0;
          position: relative;
        }

        .sidebar-usage-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #3B82F6, #60A5FA);
          border-radius: var(--radius-full);
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }


        .sidebar-usage-btn {
          width: 100%;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          border: none;
          background: #6B7280;
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color var(--transition-fast);
          text-align: center;
        }

        .sidebar-usage-btn:hover {
          background: #4B5563;
        }

        .sidebar-footer {
          font-size: 12px;
          color: var(--text-secondary);
          padding: 8px 12px 4px 12px;
          margin-top: 4px;
          text-align: left;
          font-weight: 500;
        }


        @media (max-width: 1024px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            width: 280px;
            max-width: 75%;
            height: 100vh;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 100;
            background: #FFFFFF;
            border-right: 1px solid var(--border-color);
            border-bottom: none;
            display: flex;
            flex-direction: column;
            padding: 64px 16px 24px 16px;
            box-shadow: var(--shadow-lg);
            overflow-y: auto;
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .sidebar-close-btn {
            display: flex;
          }

          .desktop-only {
            display: none !important;
          }

          .mobile-only {
            display: flex !important;
          }

          .sidebar-logo {
            margin-bottom: 24px;
            padding: 0 12px;
          }

          .sidebar-nav {
            flex-direction: column;
            gap: 2px;
            overflow-x: visible;
          }

          .sidebar-nav-item {
            white-space: normal;
            padding: 10px 12px;
            font-size: 14px;
          }

          .sidebar-bottom {
            display: flex;
            flex-direction: column;
            gap: 2px;
            margin-top: auto;
            padding-top: 16px;
            border-top: 1px solid var(--border-color);
          }

          .sidebar-nav-badge {
            display: none;
          }

          .sidebar-mobile-upgrade-btn {
            width: 100%;
            padding: 10px 16px;
            border-radius: var(--radius-sm);
            border: none;
            background: #9CA3AF;
            color: #FFFFFF;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            text-align: center;
            margin-top: 12px;
            transition: background-color var(--transition-fast);
          }

          .sidebar-mobile-upgrade-btn:hover {
            background: #6B7280;
          }
        }
      ` }} />

      {/* Close button for Mobile Drawer */}
      <button
        className="sidebar-close-btn"
        onClick={onClose}
        aria-label="Close sidebar"
        id="btn-close-sidebar"
      >
        <X size={20} />
      </button>

      {/* Logo */}
      <div className="sidebar-logo">
        <h1>Hintro</h1>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <button
          id="nav-dashboard"
          className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard className="sidebar-nav-icon" size={20} />
          <span className="sidebar-nav-label">Dashboard</span>
        </button>

        <button
          id="nav-call-insights"
          className={`sidebar-nav-item ${activeTab === 'call-insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('call-insights')}
        >
          <BarChart3 className="sidebar-nav-icon" size={20} />
          <span className="sidebar-nav-label">Call Insights</span>
        </button>

        <button
          id="nav-knowledge-base"
          className={`sidebar-nav-item ${activeTab === 'knowledge-base' ? 'active' : ''}`}
          onClick={() => setActiveTab('knowledge-base')}
        >
          <BookOpen className="sidebar-nav-icon" size={20} />
          <span className="sidebar-nav-label">Knowledge Base</span>
          <span className="sidebar-nav-badge">
            <Info size={16} />
          </span>
        </button>

        <button
          id="nav-prompts"
          className={`sidebar-nav-item ${activeTab === 'prompts' ? 'active' : ''}`}
          onClick={() => setActiveTab('prompts')}
        >
          <MessageSquare className="sidebar-nav-icon" size={20} />
          <span className="sidebar-nav-label">Prompts</span>
          <span className="sidebar-nav-badge">
            <Info size={16} />
          </span>
        </button>

        <button
          id="nav-boxy-controls"
          className={`sidebar-nav-item ${activeTab === 'boxy-controls' ? 'active' : ''}`}
          onClick={() => setActiveTab('boxy-controls')}
        >
          <Settings2 className="sidebar-nav-icon" size={20} />
          <span className="sidebar-nav-label">Boxy Controls</span>
          <span className="sidebar-nav-badge">
            <Info size={16} />
          </span>
        </button>
      </nav>

      {/* Bottom Section */}
      <div className="sidebar-bottom">
        <button
          className="sidebar-bottom-item desktop-only"
          onClick={() => alert("Thank you for choosing Hintro! The desktop app installer is downloading in the background.")}
          id="btn-download-app"
        >
          <Download className="sidebar-nav-icon" size={20} />
          <span>Download Desktop App</span>
        </button>

        <button
          className="sidebar-bottom-item"
          onClick={openFeedbackHistory}
          id="btn-feedback-history"
        >
          <History className="sidebar-nav-icon" size={20} />
          <span>Feedback History</span>
        </button>

        <button className="sidebar-bottom-item" onClick={openFeedback} id="btn-feedback">
          <Gift className="sidebar-nav-icon" size={20} />
          <span>Feedback</span>
        </button>

        <div className="sidebar-usage-card desktop-only">
          <div className="sidebar-usage-text">
            <strong>{used} of {limit}</strong> hours used
          </div>
          <div className="sidebar-usage-progress-container">
            <div className="sidebar-usage-progress-bar" style={{ width: `${percentage}%` }} />
          </div>
          <button className="sidebar-usage-btn" id="btn-upgrade">
            Upgrade
          </button>
        </div>

        <button className="sidebar-mobile-upgrade-btn mobile-only" id="btn-mobile-upgrade">
          Upgrade
        </button>

        <div className="sidebar-footer desktop-only">
          © 2025 Hintro. Made in India 🇮🇳
        </div>
      </div>
    </aside>
  );
};
