import React, { useState } from 'react';
import { Star, ArrowLeft, Trash2, Menu } from 'lucide-react';
import type { FeedbackData } from '../types';

interface FeedbackWizardProps {
  isOpen: boolean;
  onClose: () => void;
  showHistoryOnly?: boolean;
}

export const FeedbackWizard: React.FC<FeedbackWizardProps> = ({
  isOpen,
  onClose,
  showHistoryOnly = false,
}) => {
  const [step, setStep] = useState<number>(showHistoryOnly ? 0 : 1);
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [details, setDetails] = useState<string>('');
  const [pastFeedback, setPastFeedback] = useState<FeedbackData[]>(() => {
    const data = localStorage.getItem('hintro_feedback');
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Error parsing feedback history:', e);
      }
    }
    return [];
  });
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleBack = () => {
    if (showHistoryOnly && step === 1) {
      setStep(0);
    } else {
      onClose();
    }
  };

  const handleSubmit = () => {
    if (rating === 0) {
      setError('Please select a rating to continue');
      return;
    }
    if (!details.trim()) {
      setError('Please fill in your response');
      return;
    }

    const newFeedback: FeedbackData = {
      id: 'fb-' + Date.now(),
      rating,
      category: 'General',
      details,
      email: '',
      timestamp: new Date().toISOString(),
    };

    const updated = [newFeedback, ...pastFeedback];
    localStorage.setItem('hintro_feedback', JSON.stringify(updated));
    setPastFeedback(updated);
    setError('');
    
    // Reset inputs
    setRating(0);
    setDetails('');
    
    if (showHistoryOnly) {
      setStep(0);
    } else {
      onClose();
    }
  };

  const handleDeleteFeedback = (id: string) => {
    const updated = pastFeedback.filter(fb => fb.id !== id);
    localStorage.setItem('hintro_feedback', JSON.stringify(updated));
    setPastFeedback(updated);
  };

  const getInitials = () => {
    const activeUserId = localStorage.getItem('hintro_userId') || 'u2';
    return activeUserId === 'u2' ? 'JS' : 'JD';
  };

  // Custom formatted date matching: '10th May 2026 , 5:00 pm'
  const formatFeedbackDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '10th May 2026 , 5:00 pm';
      
      const day = date.getDate();
      let suffix = 'th';
      if (day === 1 || day === 21 || day === 31) suffix = 'st';
      else if (day === 2 || day === 22) suffix = 'nd';
      else if (day === 3 || day === 23) suffix = 'rd';
      
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthName = months[date.getMonth()];
      const year = date.getFullYear();
      
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const strMinutes = minutes < 10 ? '0' + minutes : minutes;
      
      return `${day}${suffix} ${monthName} ${year} , ${hours}:${strMinutes} ${ampm}`;
    } catch {
      return '10th May 2026 , 5:00 pm';
    }
  };

  return (
    <div className="fb-overlay" onClick={onClose}>
      <style dangerouslySetInnerHTML={{ __html: `
        .fb-overlay {
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
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        .fb-modal {
          width: 90%;
          max-width: 580px;
          background: #FFFFFF;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          animation: scaleIn 0.2s ease;
          overflow: hidden;
          padding: 36px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .fb-header-clean {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
        }

        .fb-title {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
        }

        .fb-subtitle {
          font-size: 14px;
          color: #9CA3AF;
        }

        .fb-stars-container {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin: 16px 0;
        }

        .fb-star-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px;
          transition: transform 0.15s ease;
          outline: none;
        }

        .fb-star-btn:hover {
          transform: scale(1.15);
        }

        .fb-textarea-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
        }

        .fb-textarea-label {
          font-size: 14px;
          font-weight: 600;
          color: #4B5563;
        }

        .fb-textarea {
          width: 100%;
          min-height: 140px;
          padding: 16px;
          border-radius: 10px;
          border: 1px solid #D1D5DB;
          background: #FFFFFF;
          color: #111827;
          font-size: 14px;
          resize: none;
          outline: none;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }

        .fb-textarea::placeholder {
          color: #9CA3AF;
        }

        .fb-textarea:focus {
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }

        .fb-error-clean {
          color: #EF4444;
          font-size: 13px;
          font-weight: 500;
          text-align: left;
        }

        .fb-footer-clean {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
        }

        .fb-btn-back {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 8px;
          border: 1px solid #D1D5DB;
          background: #FFFFFF;
          color: #374151;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.15s ease, border-color 0.15s ease;
        }

        .fb-btn-back:hover {
          background: #F9FAFB;
          border-color: #9CA3AF;
        }

        .fb-btn-submit {
          padding: 10px 24px;
          border-radius: 8px;
          border: none;
          background: #4B5563;
          color: #FFFFFF;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.15s ease, opacity 0.15s ease;
        }

        .fb-btn-submit:hover {
          background: #374151;
        }

        /* History view styles */
        .fb-history-view {
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: 16px;
        }

        .fb-history-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: #FFFFFF;
          border-bottom: 1px solid #E5E7EB;
          margin: -36px -36px 0 -36px;
        }

        .fb-history-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .fb-history-menu-icon {
          color: #374151;
          cursor: pointer;
        }

        .fb-history-header-title {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }

        .fb-history-header-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #8B5CF6;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
        }

        .fb-history-subtitle {
          font-size: 13px;
          color: #6B7280;
          text-align: left;
          margin-top: 8px;
        }

        .fb-history-list-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 480px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .fb-history-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .fb-history-card:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          border-color: #D1D5DB;
        }

        .fb-card-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          text-align: left;
          flex: 1;
        }

        .fb-card-title {
          font-size: 15px;
          font-weight: 600;
          color: #111827;
        }

        .fb-card-details {
          font-size: 13px;
          color: #6B7280;
          line-height: 1.4;
          word-break: break-word;
        }

        .fb-card-date {
          font-size: 12px;
          font-weight: 500;
          color: #3B82F6;
          margin-top: 4px;
        }

        .fb-card-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .fb-card-stars {
          display: flex;
          gap: 4px;
        }

        .fb-card-delete-btn {
          background: transparent;
          border: none;
          color: #9CA3AF;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.15s ease, background-color 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fb-card-delete-btn:hover {
          color: #EF4444;
          background: #FEF2F2;
        }

        .fb-history-empty {
          color: var(--text-secondary);
          text-align: center;
          padding: 48px 24px;
          font-size: 14px;
        }

        .fb-history-write-btn {
          padding: 10px 20px;
          background: #4B5563;
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.15s ease;
          margin-top: 16px;
        }

        .fb-history-write-btn:hover {
          background: #374151;
        }

        @media (max-width: 768px) {
          .fb-modal {
            width: 100vw;
            height: 100vh;
            max-width: 100vw;
            max-height: 100vh;
            border-radius: 0;
            margin: 0;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            justify-content: space-between;
          }

          .fb-history-header-bar {
            margin: -24px -24px 0 -24px;
            padding: 16px 20px;
          }

          .fb-history-list-container {
            max-height: calc(100vh - 160px);
            padding-bottom: 24px;
          }
        }
      ` }} />

      <div className="fb-modal" onClick={(e) => e.stopPropagation()}>
        {step === 1 ? (
          <>
            {/* Header section (clean, left-aligned) */}
            <div className="fb-header-clean">
              <h3 className="fb-title">Give Feedback</h3>
              <p className="fb-subtitle">Describe your experience using Hintro...</p>
            </div>

            {/* Stars rating component (centered) */}
            <div className="fb-stars-container" onMouseLeave={() => setHoveredRating(0)}>
              {[1, 2, 3, 4, 5].map((index) => {
                const isHighlighted = index <= (hoveredRating || rating);
                return (
                  <button
                    key={index}
                    type="button"
                    className="fb-star-btn"
                    onClick={() => {
                      setRating(index);
                      setError('');
                    }}
                    onMouseEnter={() => setHoveredRating(index)}
                  >
                    <Star
                      size={36}
                      color={isHighlighted ? '#FBBF24' : '#D1D5DB'}
                      fill={isHighlighted ? '#FBBF24' : 'transparent'}
                    />
                  </button>
                );
              })}
            </div>

            {/* Input textarea */}
            <div className="fb-textarea-container">
              <label className="fb-textarea-label">What did you like the most?</label>
              <textarea
                className="fb-textarea"
                placeholder="Write your feedback here..."
                value={details}
                onChange={(e) => {
                  setDetails(e.target.value);
                  if (e.target.value.trim()) setError('');
                }}
              />
            </div>

            {/* Error display */}
            {error && <div className="fb-error-clean">{error}</div>}

            {/* Footer buttons */}
            <div className="fb-footer-clean">
              <button type="button" className="fb-btn-back" onClick={handleBack}>
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button type="button" className="fb-btn-submit" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </>
        ) : (
          <div className="fb-history-view">
            {/* Header bar from Screenshot 2 */}
            <div className="fb-history-header-bar">
              <div className="fb-history-header-left">
                <Menu size={20} className="fb-history-menu-icon" onClick={onClose} />
                <span className="fb-history-header-title">Feedback History</span>
              </div>
              <div className="fb-history-header-avatar">
                {getInitials()}
              </div>
            </div>

            {/* Subtitle */}
            <p className="fb-history-subtitle">Review your previous feedbacks</p>

            {/* Cards container */}
            <div className="fb-history-list-container">
              {pastFeedback.length === 0 ? (
                <div className="fb-history-empty">
                  <p>No feedback submitted yet.</p>
                  <button
                    type="button"
                    className="fb-history-write-btn"
                    onClick={() => setStep(1)}
                  >
                    Give Feedback
                  </button>
                </div>
              ) : (
                pastFeedback.map((fb) => (
                  <div key={fb.id} className="fb-history-card">
                    <div className="fb-card-left">
                      <h4 className="fb-card-title">Feedback Title</h4>
                      <p className="fb-card-details">{fb.details}</p>
                      <span className="fb-card-date">{formatFeedbackDate(fb.timestamp)}</span>
                    </div>
                    <div className="fb-card-right">
                      <div className="fb-card-stars">
                        {[1, 2, 3, 4, 5].map((starIndex) => (
                          <Star
                            key={starIndex}
                            size={14}
                            color={starIndex <= fb.rating ? '#FBBF24' : '#D1D5DB'}
                            fill={starIndex <= fb.rating ? '#FBBF24' : 'transparent'}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        className="fb-card-delete-btn"
                        onClick={() => handleDeleteFeedback(fb.id)}
                        title="Delete feedback"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
