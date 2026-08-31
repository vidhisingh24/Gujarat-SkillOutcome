import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { providerApi } from '../../api/providerApi';
import type { ProviderOverviewResponse } from '../../api/providerApi';
import { GraduationCap, AlertTriangle, RefreshCw } from 'lucide-react';

export const ProviderDashboard: React.FC = () => {
  const [data, setData] = useState<ProviderOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await providerApi.getOverview();
      setData(response);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sync training provider dataset.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
          <AlertTriangle size={40} className="text-red" style={{ margin: '0 auto 12px', color: 'var(--status-red-text)' }} />
          <h4>Database Connection Failed</h4>
          <p className="text-muted text-sm mb-4">{error}</p>
          <button onClick={loadData} className="btn btn-primary flex items-center justify-center gap-2" style={{ margin: '0 auto' }}>
            <RefreshCw size={14} />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="provider-dashboard py-8">
      <div className="container">
        
        {/* Provider details card */}
        {data?.providerInfo && (
          <div className="card provider-details-card flex gap-4 items-center mb-6">
            <div className="provider-logo-box">
              <GraduationCap size={30} />
            </div>
            <div>
              <span className="text-xs text-muted font-bold block">REGISTERED TRAINING CENTER (ITI)</span>
              <h3 className="provider-name text-brown-dark">{data.providerInfo.name}</h3>
              <p className="text-xs text-muted mt-1" style={{ margin: 0 }}>
                District: <strong>{data.providerInfo.district}</strong> · ITI Center Code: <strong>{data.providerInfo.code}</strong> · Status: <strong className="text-saffron">{data.providerInfo.status}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Metric widgets */}
        {data?.metrics && (
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="card stat-card">
              <span className="stat-val">{data.metrics.traineeCount}</span>
              <span className="stat-lbl">Enrolled Trainees</span>
            </div>
            <div className="card stat-card">
              <span className="stat-val">{data.metrics.placementRate}%</span>
              <span className="stat-lbl">Placement Rate</span>
            </div>
            <div className="card stat-card">
              <span className="stat-val">{data.metrics.sixMonthRetention}%</span>
              <span className="stat-lbl">6-Month Retention</span>
            </div>
            <div className="card stat-card">
              <span className="stat-val" style={{ color: 'var(--status-red-text)' }}>{data.metrics.mismatchRate}%</span>
              <span className="stat-lbl">Trade Mismatch Rate</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Active Programme Performance Table */}
          <div className="col-span-2 flex flex-col gap-6">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h4 className="card-title" style={{ margin: 0 }}>Programme Compliance Scorecard</h4>
                <Link to="/training-provider/programmes" className="btn btn-outline btn-sm">
                  View All Programmes
                </Link>
              </div>

              {data?.programmes && data.programmes.length > 0 ? (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Programme / Trade</th>
                        <th>Batch Code</th>
                        <th>Placement</th>
                        <th>Retention (6M)</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.programmes.slice(0, 3).map(p => (
                        <tr key={p.id}>
                          <td>
                            <strong>{p.programmeName}</strong>
                            <br />
                            <span className="text-xs text-muted">Trade: {p.trade}</span>
                          </td>
                          <td><code>{p.batchCode}</code></td>
                          <td>{p.placementRate}%</td>
                          <td>{p.sixMonthRetention}%</td>
                          <td>
                            <span className={`badge ${
                              p.status === 'GREEN' ? 'badge-green' : 
                              p.status === 'YELLOW' ? 'badge-yellow' : 'badge-red'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-muted">
                  <p>No programmes registered under this ITI Center.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick links sidebar */}
          <div className="sidebar-column flex flex-col gap-6">
            <div className="card flex flex-col gap-4">
              <h4 className="card-title">Training Management</h4>
              
              <Link to="/training-provider/programmes" className="btn btn-outline py-3 flex flex-col items-start gap-1" style={{ textAlign: 'left' }}>
                <strong className="text-sm">Registered Batches & Trades</strong>
                <span className="text-xs text-muted">Track all active course performance stats.</span>
              </Link>

              <Link to="/training-provider/outcomes" className="btn btn-outline py-3 flex flex-col items-start gap-1" style={{ textAlign: 'left' }}>
                <strong className="text-sm">Trainee Outplacement Logs</strong>
                <span className="text-xs text-muted">Review longitudinal milestones and wages.</span>
              </Link>
            </div>

            <div className="card alert-card">
              <h5 style={{ margin: '0 0 6px 0', fontSize: '13px', color: 'var(--text-saffron-dark)' }}>ITI Center Compliance</h5>
              <p className="text-xs text-muted" style={{ margin: 0, lineHeight: 1.4 }}>
                Courses flagged under <strong className="text-red-text">RED</strong> status signify placement rates below 55% or mismatch rates exceeding 30%. Government mandates corrective curriculum changes or seat audits within 30 days.
              </p>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .col-span-2 { grid-column: span 2; }
        .provider-details-card {
          border-top: 4px solid var(--accent-saffron);
          padding: 20px 24px;
        }
        .provider-logo-box {
          width: 50px;
          height: 50px;
          background-color: var(--bg-cream);
          color: var(--accent-icon);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color);
        }
        .text-red-text {
          color: var(--status-red-text);
        }
      `}</style>
    </div>
  );
};
export default ProviderDashboard;
