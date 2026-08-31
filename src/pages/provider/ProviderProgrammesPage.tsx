import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { providerApi } from '../../api/providerApi';
import type { ProgrammeScorecard } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';

export const ProviderProgrammesPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [programmes, setProgrammes] = useState<ProgrammeScorecard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const data = await providerApi.getOverview();
        setProgrammes(data.programmes);
      } catch (err: any) {
        showToast(err.message || 'Failed to retrieve provider programmes data.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProgrammes();
  }, []);

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <div className="loading-spinner" style={{ margin: '0 auto 16px' }} />
        <p className="text-muted">Loading registered programmes dataset...</p>
      </div>
    );
  }

  return (
    <div className="provider-programmes-page py-8">
      <div className="container">
        
        <button onClick={() => navigate('/training-provider/dashboard')} className="btn btn-outline btn-sm mb-4">
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </button>

        <div className="card mb-6">
          <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Registered Programmes & Compliance Audits</h3>
            <span className="text-xs text-muted">Courses Logged: {programmes.length}</span>
          </div>
          <p className="text-xs text-muted mt-2" style={{ margin: 0 }}>
            Review state-level performance indicators for ITI courses. Courses flagged under Red or Yellow status require administrative response or local curriculum revisions.
          </p>
        </div>

        {/* List of scorecards */}
        <div className="grid grid-cols-1 gap-6">
          {programmes.map(prog => (
            <div key={prog.id} className={`programme-scorecard-card card border-status-${prog.status.toLowerCase()}`}>
              {/* Header */}
              <div className="scorecard-header flex justify-between items-center pb-2 mb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <span className="text-xs text-muted">BATCH CODE: <code>{prog.batchCode}</code></span>
                  <h4 style={{ margin: '2px 0 0 0', fontSize: '16px', color: 'var(--text-saffron-dark)' }}>{prog.programmeName}</h4>
                  <span className="text-xs text-muted">Trade Spec: {prog.trade} · Location: {prog.district}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`badge ${
                    prog.status === 'GREEN' ? 'badge-green' : 
                    prog.status === 'YELLOW' ? 'badge-yellow' : 'badge-red'
                  }`}>
                    {prog.status} Compliance
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-5 gap-4 text-center mb-4">
                <div className="metric-box bg-box">
                  <span className="metric-val">{prog.traineeCount}</span>
                  <span className="metric-lbl">Trainees</span>
                </div>
                <div className="metric-box bg-box">
                  <span className="metric-val">{prog.placementRate}%</span>
                  <span className="metric-lbl">Placement Rate</span>
                </div>
                <div className="metric-box bg-box">
                  <span className="metric-val">{prog.threeMonthRetention}%</span>
                  <span className="metric-lbl">3-Mo Retention</span>
                </div>
                <div className="metric-box bg-box">
                  <span className="metric-val">{prog.sixMonthRetention}%</span>
                  <span className="metric-lbl">6-Mo Retention</span>
                </div>
                <div className="metric-box bg-box">
                  <span className="metric-val" style={{ color: prog.mismatchRate > 25 ? 'var(--status-red-text)' : 'inherit' }}>
                    {prog.mismatchRate}%
                  </span>
                  <span className="metric-lbl">Trade Mismatch</span>
                </div>
              </div>

              {/* Status explanation / Corrective actions */}
              {prog.reason && (
                <div className={`status-reason-box alert-card ${
                  prog.status === 'RED' ? 'alert-card-danger' : 
                  prog.status === 'YELLOW' ? 'alert-card-warning' : ''
                }`} style={{ margin: 0, padding: '10px 14px', borderRadius: '4px' }}>
                  <div className="flex items-start gap-2">
                    {prog.status === 'RED' && <AlertTriangle size={16} className="text-red-text" style={{ marginTop: '2px' }} />}
                    {prog.status === 'YELLOW' && <AlertTriangle size={16} className="text-saffron" style={{ marginTop: '2px' }} />}
                    {prog.status === 'GREEN' && <CheckCircle size={16} className="text-green-text" style={{ marginTop: '2px' }} />}
                    <div>
                      <strong className="text-xs block">Audit Analysis Notice:</strong>
                      <p className="text-xs text-muted" style={{ margin: '2px 0 0 0' }}>{prog.reason}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      <style>{`
        .programme-scorecard-card {
          border-left: 6px solid var(--border-color);
        }
        .programme-scorecard-card.border-status-green {
          border-left-color: var(--status-green-text);
        }
        .programme-scorecard-card.border-status-yellow {
          border-left-color: var(--status-yellow-text);
        }
        .programme-scorecard-card.border-status-red {
          border-left-color: var(--status-red-text);
        }
        
        .bg-box {
          background-color: #FCFAF5;
          border: 1px solid var(--border-color);
          padding: 10px;
          border-radius: var(--radius-button);
        }
        .metric-val {
          font-family: var(--font-title);
          font-size: 18px;
          font-weight: 700;
          color: var(--text-saffron-dark);
          display: block;
        }
        .metric-lbl {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 550;
        }
        
        .text-red-text { color: var(--status-red-text); }
        .text-green-text { color: var(--status-green-text); }
      `}</style>
    </div>
  );
};
export default ProviderProgrammesPage;
