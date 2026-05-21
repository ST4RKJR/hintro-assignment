import React from 'react';
import { Calendar, MoreVertical } from 'lucide-react';
import type { DashboardData, CallStats, CallSession } from '../types';

interface DashboardViewProps {
  userId: string;
  dashboardData: DashboardData | null;
  statsData: CallStats | null;
  sessions: CallSession[];
  isLoading: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userId,
  dashboardData,
  statsData,
  sessions,
  isLoading,
}) => {
  const name = dashboardData?.user?.firstName || 'Name';
  const isU1 = userId === 'u1';

  const formatDuration = (seconds: number): string => {
    if (!seconds) return '0';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}sec`;
    if (mins > 0) return `${mins}m ${secs}sec`;
    return `${secs}sec`;
  };

  const formatLastSession = (lastSession: string[]): string => {
    if (!lastSession || lastSession.length === 0) return '-';
    try {
      const date = new Date(lastSession[0]);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return '1 day ago';
      return `${diffDays} days ago`;
    } catch {
      return '-';
    }
  };

  const formatCallTime = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).toLowerCase();
    } catch {
      return '';
    }
  };



  const getDateWithSuffix = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      const month = date.toLocaleDateString('en-US', { month: 'long' });
      const day = date.getDate();
      const suffix = getDaySuffix(day);
      return `${month} ${day}${suffix}`;
    } catch {
      return '';
    }
  };

  const getDaySuffix = (day: number): string => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  // Group sessions by date
  const groupSessionsByDate = (sessions: CallSession[] = []) => {
    const groups: { [key: string]: CallSession[] } = {};
    if (!sessions || !Array.isArray(sessions)) return groups;
    sessions.forEach((session) => {
      const dateKey = new Date(session.started_at).toLocaleDateString('en-US');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(session);
    });
    return groups;
  };


  if (isLoading) {
    return (
      <div className="dashboard-loading" id="dashboard-loading">
        <style dangerouslySetInnerHTML={{ __html: `
          .dashboard-loading {
            display: flex;
            flex-direction: column;
            gap: 24px;
            padding: 32px;
          }
          .skeleton {
            background: linear-gradient(90deg, var(--border-light) 25%, var(--bg-hover) 50%, var(--border-light) 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: var(--radius-sm);
          }
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        ` }} />
        <div className="skeleton" style={{ height: 80 }} />
        <div className="skeleton" style={{ height: 90 }} />
        <div className="skeleton" style={{ height: 200 }} />
      </div>
    );
  }

  const groupedSessions = groupSessionsByDate(sessions);

  return (
    <div className="dashboard" id="dashboard-view">
      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard {
          display: flex;
          flex-direction: column;
          padding: 32px;
          flex: 1;
        }

        /* Welcome Section */
        .dashboard-welcome {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 32px;
        }

        .dashboard-welcome-text h2 {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .dashboard-welcome-text p {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .dashboard-start-call-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: var(--radius-sm);
          border: none;
          background: var(--text-primary);
          color: #FFFFFF;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: opacity var(--transition-fast);
          flex-shrink: 0;
        }

        .dashboard-start-call-btn:hover {
          opacity: 0.9;
        }

        /* Stats Row */
        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 40px;
        }

        .dashboard-stat {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .dashboard-stat:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }

        .dashboard-stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dashboard-stat-icon.coral {
          background: rgba(239, 68, 68, 0.08);
          color: #EF4444;
        }

        .dashboard-stat-icon.cyan {
          background: rgba(6, 182, 212, 0.08);
          color: #06B6D4;
        }

        .dashboard-stat-icon.green {
          background: rgba(16, 185, 129, 0.08);
          color: #10B981;
        }

        .dashboard-stat-icon.purple {
          background: rgba(139, 92, 246, 0.08);
          color: #8B5CF6;
        }

        .dashboard-stat-info {
          display: flex;
          flex-direction: column;
        }

        .dashboard-stat-label {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 500;
          margin-bottom: 2px;
        }

        .dashboard-stat-value {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }

        /* Recent Calls */
        .dashboard-recent-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          text-align: center;
          margin-bottom: 24px;
        }

        /* Empty State */
        .dashboard-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 48px 24px;
          background: var(--bg-empty);
          border-radius: var(--radius-md);
        }

        .dashboard-empty-icon {
          width: 48px;
          height: 48px;
          color: var(--text-tertiary);
          margin-bottom: 16px;
        }

        .dashboard-empty h3 {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .dashboard-empty p {
          font-size: 13px;
          color: var(--text-secondary);
          max-width: 380px;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .dashboard-empty-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }

        .dashboard-empty-btn:hover {
          background: var(--bg-hover);
        }

        /* Call List */
        .dashboard-calls-list {
          display: flex;
          flex-direction: column;
        }

        .dashboard-calls-date-header {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-tertiary);
          padding: 8px 0;
          margin-top: 8px;
        }

        .dashboard-calls-date-header:first-child {
          margin-top: 0;
        }

        .dashboard-call-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-light);
          cursor: pointer;
          transition: background-color var(--transition-fast);
          border-radius: var(--radius-xs);
          padding-left: 4px;
          padding-right: 4px;
        }

        .dashboard-call-row:hover {
          background: var(--bg-hover);
        }

        .dashboard-call-row:last-child {
          border-bottom: none;
        }

        .dashboard-call-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--color-purple);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .dashboard-call-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .dashboard-call-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .dashboard-call-participants {
          display: flex;
          align-items: center;
          gap: 2px;
          margin-top: 2px;
        }

        .dashboard-call-participant-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1.5px solid #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: 700;
          color: #FFFFFF;
          margin-left: -4px;
        }

        .dashboard-call-participant-dot:first-child {
          margin-left: 0;
        }

        .dashboard-call-time {
          font-size: 13px;
          color: var(--text-tertiary);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .dashboard-call-menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          color: var(--text-tertiary);
          cursor: pointer;
          border-radius: var(--radius-xs);
          flex-shrink: 0;
          transition: background-color var(--transition-fast), color var(--transition-fast);
        }

        .dashboard-call-menu-btn:hover {
          background: var(--bg-hover);
          color: var(--text-secondary);
        }

        /* Responsive Utility Text */
        .desktop-only-text {
          display: inline;
        }

        .mobile-only-text {
          display: none;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .desktop-only-text {
            display: none !important;
          }

          .mobile-only-text {
            display: inline !important;
          }

          .dashboard {
            padding: 20px 16px;
          }

          .dashboard-welcome {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            margin-bottom: 24px;
          }

          .dashboard-welcome-text h2 {
            font-size: 18px;
            letter-spacing: -0.01em;
          }

          .dashboard-welcome-text p {
            font-size: 13px;
          }

          .dashboard-start-call-btn {
            padding: 8px 16px;
            font-size: 13px;
            border-radius: var(--radius-sm);
          }

          .dashboard-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            border: none;
            background: transparent;
            margin-bottom: 32px;
            overflow: visible;
          }

          .dashboard-stat {
            border: 1px solid var(--border-color);
            border-radius: 12px;
            background: #FFFFFF;
            padding: 14px 16px;
            gap: 12px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
          }

          .dashboard-stat-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .dashboard-stat-icon svg {
            width: 20px;
            height: 20px;
          }

          .dashboard-stat-label {
            font-size: 11px;
            margin-bottom: 1px;
          }

          .dashboard-stat-value {
            font-size: 16px;
            font-weight: 700;
          }

          .dashboard-call-row {
            padding: 12px 4px;
            gap: 10px;
          }

          .dashboard-call-avatar {
            width: 32px;
            height: 32px;
            font-size: 13px;
          }

          .dashboard-call-name {
            font-size: 13px;
          }

          .dashboard-call-time {
            font-size: 12px;
          }
        }
      ` }} />

      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <div className="dashboard-welcome-text">
          <h2>Hi, {name} 👋 Welcome to Hintro</h2>
          <p>Ready to make your next call smarter ?</p>
        </div>
        <button className="dashboard-start-call-btn" id="btn-start-new-call">
          <span className="desktop-only-text">Start New Call</span>
          <span className="mobile-only-text">Start Call</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="dashboard-stats" id="dashboard-stats">
        <div className="dashboard-stat">
          <div className="dashboard-stat-icon coral">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              {/* Main 3/4 pie piece */}
              <path d="M 12,2 A 10,10 0 1,0 22,12 L 12,12 Z" />
              {/* Separated 1/4 pie piece shifted slightly to the top-right */}
              <path d="M 12,2 A 10,10 0 0,1 22,12 L 12,12 Z" transform="translate(1.5, -1.5)" />
            </svg>
          </div>
          <div className="dashboard-stat-info">
            <span className="dashboard-stat-label">Total Sessions</span>
            <span className="dashboard-stat-value">{statsData?.totalSessions ?? 0}</span>
          </div>
        </div>

        <div className="dashboard-stat">
          <div className="dashboard-stat-icon cyan">
            <svg width="22" height="22" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" fill="currentColor" />
              <path d="M12 7v5l3.5 2" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <div className="dashboard-stat-info">
            <span className="dashboard-stat-label">Average Duration</span>
            <span className="dashboard-stat-value">
              {statsData?.averageDuration ? formatDuration(statsData.averageDuration) : '0'}
            </span>
          </div>
        </div>

        <div className="dashboard-stat">
          <div className="dashboard-stat-icon green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
              <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z" />
              <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" />
            </svg>
          </div>
          <div className="dashboard-stat-info">
            <span className="dashboard-stat-label">AI Used</span>
            <span className="dashboard-stat-value">
              {statsData?.totalAIInteractions
                ? `${statsData.totalAIInteractions} times`
                : '0 times'
              }
            </span>
          </div>
        </div>

        <div className="dashboard-stat">
          <div className="dashboard-stat-icon purple">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M8 2v4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
              <path d="M16 2v4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
              <rect width="18" height="18" x="3" y="4" rx="3" stroke="currentColor" strokeWidth={2} />
              <path d="M3 9h18V7a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3z" fill="currentColor" stroke="none" />
              <rect x="7" y="12" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
              <rect x="11" y="12" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
              <rect x="15" y="12" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
              <rect x="7" y="16" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
              <rect x="11" y="16" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
              <rect x="15" y="16" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <div className="dashboard-stat-info">
            <span className="dashboard-stat-label">Last Session</span>
            <span className="dashboard-stat-value">
              {statsData?.lastSession ? formatLastSession(statsData.lastSession) : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Calls */}
      <h3 className="dashboard-recent-title">Recent calls</h3>

      {isU1 || sessions.length === 0 ? (
        <div className="dashboard-empty" id="empty-state">
          <Calendar size={32} className="dashboard-empty-icon" />
          <h3>No Recent Calls</h3>
          <p>
            Connect your Google Calendar to see upcoming meetings,
            get reminders, and join calls directly from Hintro.
          </p>
          <button className="dashboard-empty-btn" id="btn-start-call-empty">
            Start a Call
          </button>
        </div>
      ) : (
        <div className="dashboard-calls-list" id="calls-list">
          {Object.entries(groupedSessions).map(([dateKey, dateSessions]) => (
            <React.Fragment key={dateKey}>
              <div className="dashboard-calls-date-header">
                {getDateWithSuffix(dateSessions[0].started_at)}
              </div>
              {dateSessions.map((session) => {
                const initial = session.client ? session.client[0].toUpperCase() : 'C';
                const participantColors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];

                return (
                  <div className="dashboard-call-row" key={session._id}>
                    <div className="dashboard-call-avatar">
                      {initial}
                    </div>
                    <div className="dashboard-call-info">
                      <span className="dashboard-call-name">
                        {session.description || 'Design Call'}
                      </span>
                      <div className="dashboard-call-participants">
                        {session.participants.slice(0, 4).map((p, idx) => (
                          <div
                            key={idx}
                            className="dashboard-call-participant-dot"
                            style={{
                              background: participantColors[idx % participantColors.length],
                            }}
                            title={p.name}
                          >
                            {p.name[0]}
                          </div>
                        ))}
                      </div>
                    </div>
                    <span className="dashboard-call-time">
                      {formatCallTime(session.started_at)}
                    </span>
                    <button
                      className="dashboard-call-menu-btn"
                      onClick={(e) => e.stopPropagation()}
                      title="More options"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
