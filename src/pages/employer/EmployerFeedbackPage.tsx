import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employerApi } from '../../api/employerApi';
import type { EmployerFeedbackResponse } from '../../api/employerApi';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, MessageSquare, Save, RefreshCw, Sparkles } from 'lucide-react';

export const EmployerFeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [candidates, setCandidates] = useState<{ id: string; name: string }[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [selectedTrainee, setSelectedTrainee] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<EmployerFeedbackResponse | null>(null);

  // Inline Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchHiredCandidates = async () => {
      try {
        const verifications = await employerApi.getVerifications();
        // Extract unique candidates
        const uniq: Record<string, string> = {};
        verifications.forEach(v => {
          uniq[v.trainee.id] = v.trainee.name;
        });
        const parsed = Object.entries(uniq).map(([id, name]) => ({ id, name }));
        setCandidates(parsed);
        if (parsed.length > 0) {
          setSelectedTrainee(parsed[0].id);
        }
      } catch (err: any) {
        showToast('Failed to load candidate listings.', 'error');
      } finally {
        setLoadingCandidates(false);
      }
    };
    fetchHiredCandidates();
  }, []);

  const validate = () => {
    const localErrors: Record<string, string> = {};
    if (!selectedTrainee) {
      localErrors.selectedTrainee = 'This field is required. Please select a candidate trainee.';
    }
    if (!feedbackText.trim()) {
      localErrors.feedbackText = 'This field is required. Please describe the skill gap.';
    } else if (feedbackText.trim().length < 15) {
      localErrors.feedbackText = 'Feedback must be at least 15 characters long.';
    }

    setErrors(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Validation failed. Please correct the inline errors.', 'error');
      return;
    }

    setSubmitting(true);
    setResult(null);
    try {
      const response = await employerApi.submitFeedback(selectedTrainee, feedbackText);
      setResult(response);
      showToast('Workplace feedback logged successfully.', 'success');
      setFeedbackText(''); // Clear input
      setErrors({});
    } catch (err: any) {
      showToast(err.message || 'Failed to submit feedback log.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-page-container py-8">
      <div className="container" style={{ maxWidth: '650px' }}>
        
        <button onClick={() => navigate('/employer/dashboard')} className="btn btn-outline btn-sm mb-4">
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </button>

        <div className="card">
          <div className="flex gap-3 items-center mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div className="feedback-icon-box">
              <MessageSquare size={22} />
            </div>
            <div>
              <span className="text-xs text-muted font-bold block">FEEDBACK CONSOLE</span>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Log Workplace Skill Gap Feedback</h3>
            </div>
          </div>

          {loadingCandidates ? (
            <div className="text-center py-6 text-muted">
              <div className="loading-spinner animate-spin" style={{ margin: '0 auto 12px' }} />
              <span>Fetching employee records...</span>
            </div>
          ) : candidates.length > 0 ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
              
              <div className="form-group">
                <label className="form-label" htmlFor="traineeId">Hired Employee Candidate</label>
                <select 
                  id="traineeId" 
                  value={selectedTrainee}
                  onChange={(e) => {
                    setSelectedTrainee(e.target.value);
                    if (errors.selectedTrainee) {
                      setErrors(prev => {
                        const copy = { ...prev };
                        delete copy.selectedTrainee;
                        return copy;
                      });
                    }
                  }}
                  className="form-control"
                  disabled={submitting}
                >
                  <option value="">-- Choose Candidate --</option>
                  {candidates.map(c => (
                    <option key={c.id} value={c.id}>{c.name} (Candidate ID: {c.id})</option>
                  ))}
                </select>
                {errors.selectedTrainee && <div className="inline-error-msg">{errors.selectedTrainee}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="feedbackText">Any recurring skill gaps you've noticed? (Minimum 15 characters)</label>
                <textarea
                  id="feedbackText"
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => {
                    setFeedbackText(e.target.value);
                    if (errors.feedbackText) {
                      setErrors(prev => {
                        const copy = { ...prev };
                        delete copy.feedbackText;
                        return copy;
                      });
                    }
                  }}
                  className="form-control"
                  placeholder="e.g. good on basic theory, but needs more hands-on practice with Siemens CNC controllers, or lacks familiarity with safety gauges..."
                  disabled={submitting}
                />
                {errors.feedbackText && <div className="inline-error-msg">{errors.feedbackText}</div>}
              </div>

              <button type="submit" disabled={submitting} className="btn btn-primary flex items-center gap-2 justify-center" style={{ alignSelf: 'flex-end' }}>
                {submitting ? <RefreshCw className="loading-spinner animate-spin" size={14} /> : <Save size={14} />}
                <span>{submitting ? 'Analyzing & Saving...' : 'Submit Feedback'}</span>
              </button>

            </form>
          ) : (
            <div className="text-center py-6 text-muted">
              <p>No verified employee candidates found under your registration logs.</p>
            </div>
          )}
        </div>

        {/* Dynamic classification result card */}
        {result?.skillGap && (
          <div className="card mt-6 border-saffron classification-result-card animate-slide-up">
            <div className="flex items-center gap-2 mb-3 text-saffron font-bold text-sm">
              <Sparkles size={16} />
              <span>DET Artificial Intelligence Classifier Outcome</span>
            </div>
            <h5 className="theme-text mb-2">"{result.skillGap.themeText}"</h5>
            <div className="classification-metrics grid grid-cols-3 gap-4 mt-2 text-xs">
              <div>
                <span className="text-muted block">CLASSIFIED CATEGORY</span>
                <strong className="text-brown">{result.skillGap.category}</strong>
              </div>
              <div>
                <span className="text-muted block">MATCH CONFIDENCE</span>
                <strong className="text-brown">{(result.skillGap.confidence * 100).toFixed(0)}%</strong>
              </div>
              <div>
                <span className="text-muted block">DISTRICT SIGNALED</span>
                <strong className="text-brown">{result.skillGap.district}</strong>
              </div>
            </div>
            <p className="classification-note mt-3 text-muted" style={{ fontSize: '10px', margin: '12px 0 0 0', borderTop: '1px dashed var(--border-color)', paddingTop: '8px' }}>
              * This feedback theme has been logged and aggregate counts will instantly update the Government directorate monitoring analytics.
            </p>
          </div>
        )}

      </div>

      <style>{`
        .feedback-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          background-color: var(--bg-cream);
          color: var(--accent-icon);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .border-saffron {
          border: 1px solid var(--accent-saffron);
          background-color: #FAF8F2;
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
        .classification-result-card {
          border-top: 4px solid var(--accent-saffron);
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
export default EmployerFeedbackPage;
