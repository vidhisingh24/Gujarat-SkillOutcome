import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employerApi } from '../../api/employerApi';
import { useToast } from '../../context/ToastContext';
import type { VerificationRequest } from '../../data/mockData';
import { ClipboardCheck, Building2, CheckCircle, AlertCircle, ChevronRight, Clock } from 'lucide-react';

export const EmployerDashboard: React.FC = () => {
  const { showToast } = useToast();

  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Local corporate profile info
  const companyProfile = {
    name: 'Gujarat Precision Tools Pvt Ltd',
    registeredNo: 'EMP-GJ-380012',
    district: 'Ahmedabad'
  };

  const loadVerifications = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await employerApi.getVerifications();
      setVerifications(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to retrieve corporate verification records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerifications();
  }, []);

  const handleAction = async (id: string, status: 'confirmed' | 'denied') => {
    try {
      await employerApi.updateVerification(id, status);
      showToast(`Verification request successfully marked as ${status}.`, 'success');
      loadVerifications(); // Reload
    } catch (err: any) {
      showToast(err.message || 'Failed to process verification change.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="skeleton skeleton-profile-card mb-6" />
        <div className="skeleton skeleton-section" />
        <style>{`
          .skeleton {
            background: linear-gradient(90deg, #F0EDE4 25%, #E5E2D7 50%, #F0EDE4 75%);
            background-size: 200% 100%;
            animation: loading-shimmer 1.5s infinite;
            border-radius: var(--radius-card);
          }
          .skeleton-profile-card { height: 120px; }
          .skeleton-section { height: 380px; }
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
          <AlertCircle size={40} className="text-red" style={{ margin: '0 auto 12px', color: 'var(--status-red-text)' }} strokeWidth={2} />
          <h4>Database Synced Issues</h4>
          <p className="text-muted text-sm mb-4">{error}</p>
          <button onClick={loadVerifications} className="btn btn-primary">Retry Sync</button>
        </div>
      </div>
    );
  }

  const pending = verifications.filter(v => v.status === 'pending');
  const verified = verifications.filter(v => v.status === 'confirmed');
  const total = verifications.length;

  return (
    <div className="employer-dashboard py-8">
      <div className="container">
        
        {/* Company info header */}
        <div className="card company-card flex gap-4 items-center mb-6">
          <div className="company-logo-box">
            <Building2 size={30} />
          </div>
          <div>
            <span className="text-xs text-muted font-bold block">REGISTERED CORPORATION</span>
            <h3 className="company-name text-brown-dark">{companyProfile.name}</h3>
            <p className="text-xs text-muted mt-1" style={{ margin: 0 }}>
              District: <strong>{companyProfile.district}</strong> · Registry ID: <strong>{companyProfile.registeredNo}</strong>
            </p>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="stat-card card flex items-center justify-between">
            <div>
              <span className="stat-val" style={{ color: 'var(--status-yellow-text)' }}>{pending.length}</span>
              <span className="stat-lbl">Pending Verifications</span>
            </div>
            <Clock className="text-muted" size={28} style={{ opacity: 0.3 }} />
          </div>
          <div className="stat-card card flex items-center justify-between">
            <div>
              <span className="stat-val" style={{ color: 'var(--status-green-text)' }}>{verified.length}</span>
              <span className="stat-lbl">Verified Employees</span>
            </div>
            <CheckCircle className="text-muted" size={28} style={{ opacity: 0.3 }} />
          </div>
          <div className="stat-card card flex items-center justify-between">
            <div>
              <span className="stat-val">{total}</span>
              <span className="stat-lbl">From KaushalSetu</span>
            </div>
            <ClipboardCheck className="text-muted" size={28} style={{ opacity: 0.3 }} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main List Table preview */}
          <div className="col-span-2 flex flex-col gap-6">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h4 className="card-title" style={{ margin: 0 }}>Pending Verification Audits</h4>
                <Link to="/employer/verifications" className="btn btn-outline btn-sm flex items-center gap-1">
                  <span>Manage All</span>
                  <ChevronRight size={14} />
                </Link>
              </div>

              {pending.length > 0 ? (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Employee Name</th>
                        <th>Job Role</th>
                        <th>Cycle</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pending.slice(0, 5).map(v => (
                        <tr key={v.id}>
                          <td><strong>{v.trainee.name}</strong></td>
                          <td>{v.jobRole}</td>
                          <td>{v.cycle.replace('_', ' ').toUpperCase()}</td>
                          <td>
                            <div className="flex gap-2">
                              <button onClick={() => handleAction(v.id, 'confirmed')} className="btn btn-primary btn-sm py-1 font-semibold">
                                Confirm
                              </button>
                              <button onClick={() => handleAction(v.id, 'denied')} className="btn btn-outline btn-sm py-1 font-semibold" style={{ color: 'var(--status-red-text)' }}>
                                Deny
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted">
                  <CheckCircle size={36} className="text-green mb-2" style={{ margin: '0 auto', color: 'var(--status-green-text)' }} />
                  <h5>All Verifications Completed</h5>
                  <p className="text-xs">No pending verification requests on file for this cycle.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick links sidebar */}
          <div className="sidebar-column flex flex-col gap-6">
            <div className="card flex flex-col gap-4">
              <h4 className="card-title">Corporate Actions</h4>
              
              <Link to="/employer/verifications" className="btn btn-outline py-3 flex flex-col items-start gap-1" style={{ textAlign: 'left' }}>
                <strong className="text-sm">Verification Requests</strong>
                <span className="text-xs text-muted">Confirm/deny candidate registry entries.</span>
              </Link>

              <Link to="/employer/feedback" className="btn btn-outline py-3 flex flex-col items-start gap-1" style={{ textAlign: 'left' }}>
                <strong className="text-sm">Submit Skill Feedback</strong>
                <span className="text-xs text-muted">Submit recurring skill gaps to DET desks.</span>
              </Link>
            </div>

            <div className="card alert-card">
              <h5 style={{ margin: '0 0 6px 0', fontSize: '13px', color: 'var(--text-saffron-dark)' }}>Ecosystem Standard</h5>
              <p className="text-xs text-muted" style={{ margin: 0, lineHeight: 1.4 }}>
                Under Gujarat Skill Development mandate, employers should verify candidate placement status within 15 days of candidate log submission. Feedback is automatically processed by DET.
              </p>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .col-span-2 { grid-column: span 2; }
        .company-card {
          border-top: 4px solid var(--secondary-brown);
          padding: 20px 24px;
        }
        .company-logo-box {
          width: 50px;
          height: 50px;
          background-color: var(--bg-cream);
          color: var(--text-brown);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color);
        }
      `}</style>
    </div>
  );
};
export default EmployerDashboard;
