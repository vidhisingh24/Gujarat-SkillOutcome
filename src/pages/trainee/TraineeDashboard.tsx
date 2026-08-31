import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { traineeApi } from '../../api/traineeApi';
import { useToast } from '../../context/ToastContext';
import type { TraineeProfile, CheckIn } from '../../data/mockData';
import { User, CheckCircle, Clock, AlertCircle, FileText, Share2, RefreshCw } from 'lucide-react';

export const TraineeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<TraineeProfile | null>(null);
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selfEmploymentOpen, setSelfEmploymentOpen] = useState(false);
  const [selfEmpBusiness, setSelfEmpBusiness] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [profData, chkData] = await Promise.all([
        traineeApi.getProfile(),
        traineeApi.getCheckins()
      ]);
      setProfile(profData);
      setCheckins(chkData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to retrieve trainee profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelfEmploymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfEmpBusiness.trim()) {
      showToast('Please enter business details', 'warning');
      return;
    }
    showToast('Self-employment declared successfully! Verified by Directorate.', 'success');
    setSelfEmploymentOpen(false);
    setSelfEmpBusiness('');
    // Refresh page
    loadData();
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="skeleton skeleton-profile-card mb-6" />
        <div className="skeleton skeleton-section mb-6" />
        <style>{`
          .skeleton {
            background: linear-gradient(90deg, #F0EDE4 25%, #E5E2D7 50%, #F0EDE4 75%);
            background-size: 200% 100%;
            animation: loading-shimmer 1.5s infinite;
            border-radius: var(--radius-card);
          }
          .skeleton-profile-card { height: 180px; }
          .skeleton-section { height: 320px; }
          @keyframes loading-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 text-center">
        <div className="card text-center" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <AlertCircle size={40} className="text-red-text" style={{ margin: '0 auto 12px', color: 'var(--status-red-text)' }} />
          <h4>Database Sync Issue</h4>
          <p className="text-muted text-sm mb-4">{error}</p>
          <button onClick={loadData} className="btn btn-primary flex items-center justify-center gap-2" style={{ margin: '0 auto' }}>
            <RefreshCw size={14} />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  // Get active due check-in if any
  const nextDueCheckin = checkins.find(c => c.status === 'pending');

  return (
    <div className="trainee-dashboard py-8">
      <div className="container">
        
        {/* Profile Card Summary */}
        {profile && (
          <div className="card profile-card flex justify-between items-start mb-6">
            <div className="profile-details flex gap-4">
              <div className="profile-avatar">
                <User size={32} />
              </div>
              <div className="profile-info">
                <span className="text-xs text-muted font-bold uppercase tracking-wider">Candidate Profile</span>
                <h3 className="profile-name text-brown-dark">{profile.name}</h3>
                <p className="profile-meta-text text-sm">
                  {profile.trade} · <strong>{profile.batch}</strong>
                </p>
                <p className="provider-sub-text text-xs text-muted">
                  Training Center: {profile.trainingProvider.name} ({profile.trainingProvider.code})
                </p>
              </div>
            </div>

            <div className="profile-status flex flex-col items-end">
              <span className="text-xs text-muted block mb-1">EMPLOYMENT STATUS</span>
              <span className={`badge ${profile.employment?.status === 'employed' || profile.employment?.status === 'self_employed' ? 'badge-green' : 'badge-yellow'}`}>
                {profile.employment?.status ? profile.employment.status.replace('_', ' ').toUpperCase() : 'NOT EMPLOYED'}
              </span>
              {profile.employment && (
                <div className="employment-sub-meta text-right mt-2 text-xs text-muted">
                  <div>Role: <strong>{profile.employment.currentRole}</strong></div>
                  <div>At: <strong>{profile.employment.companyName}</strong></div>
                  <div>Since: <strong>{profile.employment.startDate}</strong></div>
                  <div>Verify: 
                    <strong className={`ml-1 text-sm ${
                      profile.employment.verificationStatus === 'confirmed' ? 'badge-green-text' : 
                      profile.employment.verificationStatus === 'denied' ? 'badge-red-text' : 'badge-yellow-text'
                    }`}>
                      {profile.employment.verificationStatus?.toUpperCase() || 'PENDING'}
                    </strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Main timeline column */}
          <div className="col-span-2 timeline-column flex flex-col gap-6">
            
            {/* CTA alert for pending checkin */}
            {nextDueCheckin && (
              <div className="alert-card alert-card-warning flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock size={24} className="text-saffron" />
                  <div>
                    <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>Action Required: Check-in Update</h5>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>
                      Your <strong>{nextDueCheckin.cycle.replace('_', ' ')} check-in</strong> is due. Please submit your current employment details before {nextDueCheckin.dueDate}.
                    </p>
                  </div>
                </div>
                <button onClick={() => navigate('/trainee/check-in')} className="btn btn-primary btn-sm">
                  Update Now
                </button>
              </div>
            )}

            {/* Timeline component */}
            <div className="card">
              <h4 className="card-title mb-6">Longitudinal Check-in History</h4>
              
              <div className="checkin-timeline-list">
                {checkins.map((chk) => {
                  let statusLabel = 'Upcoming';
                  let statusClass = 'status-locked';
                  let icon = <Clock size={16} />;

                  if (chk.status === 'completed') {
                    statusLabel = 'Completed';
                    statusClass = 'status-completed';
                    icon = <CheckCircle size={16} />;
                  } else if (chk.status === 'missed') {
                    statusLabel = 'Missed';
                    statusClass = 'status-missed';
                    icon = <AlertCircle size={16} />;
                  } else if (chk.status === 'pending') {
                    statusLabel = 'Due Now';
                    statusClass = 'status-due';
                    icon = <Clock size={16} />;
                  }

                  return (
                    <div key={chk.id} className={`timeline-node ${statusClass}`}>
                      <div className="timeline-node-line" />
                      <div className="timeline-node-dot">
                        {icon}
                      </div>
                      <div className="timeline-node-details flex justify-between items-start">
                        <div>
                          <h5 className="node-cycle">{chk.cycle.replace('_', '-').toUpperCase()} CHECK-IN</h5>
                          <span className="node-date text-xs text-muted block mt-1">
                            {chk.status === 'completed' 
                              ? `Submitted Date: ${chk.submittedDate}` 
                              : `Due Date: ${chk.dueDate}`}
                          </span>
                          {chk.status === 'completed' && (
                            <div className="node-submitted-data card mt-3 text-xs">
                              <div>Status: <strong>{chk.employmentStatus?.replace('_', ' ')}</strong></div>
                              <div>Wage Band: <strong>₹{chk.salaryBand}</strong></div>
                              {chk.feedbackText && <div className="mt-1">Feedback: <em className="text-muted">"{chk.feedbackText}"</em></div>}
                            </div>
                          )}
                        </div>
                        <div className="node-badge-col flex flex-col items-end">
                          <span className="node-status-badge">{statusLabel}</span>
                          {chk.status === 'pending' && (
                            <button onClick={() => navigate('/trainee/check-in')} className="btn btn-secondary btn-sm mt-2">
                              Fill Form
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions sidebar */}
          <div className="actions-column flex flex-col gap-6">
            <div className="card flex flex-col gap-4">
              <h4 className="card-title">Portal Actions</h4>
              
              <Link to="/trainee/certificate" className="btn btn-outline flex items-center justify-start gap-3 py-3" style={{ textAlign: 'left' }}>
                <FileText className="text-saffron" size={20} />
                <div>
                  <strong className="block text-sm">Download Certificate</strong>
                  <span className="text-xs text-muted">View outcome registration certificate.</span>
                </div>
              </Link>

              <button 
                onClick={() => setSelfEmploymentOpen(true)} 
                className="btn btn-outline flex items-center justify-start gap-3 py-3" 
                style={{ textAlign: 'left' }}
              >
                <Share2 className="text-saffron" size={20} />
                <div>
                  <strong className="block text-sm">Report Self-Employment</strong>
                  <span className="text-xs text-muted">Register an independent trade startup.</span>
                </div>
              </button>

              <Link to="/trainee/outcomes" className="btn btn-secondary text-center">
                View Longitudinal Outcomes
              </Link>
            </div>

            {/* Synthetic Disclaimer mini */}
            {profile?.isSynthetic && (
              <div className="card text-center" style={{ backgroundColor: '#FAF9F5', borderStyle: 'dashed' }}>
                <span className="text-xs text-muted" style={{ fontSize: '10px' }}>
                  * This profile Ravi Parmar is a synthetic demonstration registry representing CNC Operator outcomes.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Self-employment modal */}
        {selfEmploymentOpen && (
          <div className="modal-overlay flex items-center justify-center">
            <div className="modal-container card" style={{ maxWidth: '480px', width: '100%' }}>
              <h4 className="modal-title mb-4">Report Self-Employment</h4>
              <form onSubmit={handleSelfEmploymentSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="business">Business Name / Trade Description</label>
                  <textarea 
                    id="business" 
                    rows={3} 
                    value={selfEmpBusiness}
                    onChange={(e) => setSelfEmpBusiness(e.target.value)}
                    className="form-control"
                    placeholder="e.g. Parmar Woodcrafts Shop, local carpentry and lathe fitting shop"
                    required
                  />
                </div>
                <div className="modal-actions flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setSelfEmploymentOpen(false)} className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-primary">Declare Startup</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .col-span-2 { grid-column: span 2; }
        .profile-card {
          border-top: 4px solid var(--accent-saffron);
          padding: 24px;
        }
        .profile-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: var(--bg-cream);
          color: var(--accent-icon);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .badge-green-text { color: var(--status-green-text); font-weight: bold; }
        .badge-red-text { color: var(--status-red-text); font-weight: bold; }
        .badge-yellow-text { color: var(--status-yellow-text); font-weight: bold; }

        /* Timeline vertical nodes styling */
        .checkin-timeline-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding-left: 20px;
          position: relative;
        }
        .checkin-timeline-list::before {
          content: '';
          position: absolute;
          left: 8px;
          top: 8px;
          bottom: 8px;
          width: 2px;
          background-color: var(--border-color);
          z-index: 1;
        }
        
        .timeline-node {
          position: relative;
          display: flex;
          gap: 20px;
          z-index: 2;
        }
        .timeline-node-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: var(--bg-card);
          border: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          flex-shrink: 0;
          color: var(--text-muted);
        }
        .timeline-node-details {
          flex: 1;
          background-color: #FCFAF5;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-button);
          padding: 16px;
        }
        
        /* Node states styling */
        .status-completed .timeline-node-dot {
          border-color: var(--status-green-text);
          background-color: var(--status-green-bg);
          color: var(--status-green-text);
        }
        .status-completed .node-status-badge {
          background-color: var(--status-green-bg);
          color: var(--status-green-text);
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
        }
        
        .status-due .timeline-node-dot {
          border-color: var(--status-yellow-text);
          background-color: var(--status-yellow-bg);
          color: var(--status-yellow-text);
        }
        .status-due .node-status-badge {
          background-color: var(--status-yellow-bg);
          color: var(--status-yellow-text);
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .status-due .timeline-node-details {
          border-color: var(--status-yellow-text);
        }

        .status-missed .timeline-node-dot {
          border-color: var(--status-red-text);
          background-color: var(--status-red-bg);
          color: var(--status-red-text);
        }
        .status-missed .node-status-badge {
          background-color: var(--status-red-bg);
          color: var(--status-red-text);
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .status-locked .timeline-node-dot {
          border-color: var(--border-color);
          background-color: var(--bg-primary);
          color: var(--text-muted);
        }
        .status-locked .node-status-badge {
          background-color: var(--bg-primary);
          color: var(--text-muted);
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 4px;
        }
        
        .node-cycle {
          font-size: 13px;
          font-weight: 750;
          color: var(--text-saffron-dark);
          margin: 0;
        }
        .node-submitted-data {
          border-style: solid;
          background-color: var(--bg-card);
          padding: 10px;
          border-color: var(--border-color);
        }

        /* Modal Overlay */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.4);
          z-index: 10000;
          padding: 16px;
        }

        @media (max-width: 900px) {
          .grid-cols-3 { grid-template-columns: 1fr; }
          .col-span-2 { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
};
export default TraineeDashboard;
