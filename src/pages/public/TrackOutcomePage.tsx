import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldAlert, CheckCircle, Lock, ArrowLeft } from 'lucide-react';

export const TrackOutcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [queryId, setQueryId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    
    // Simulate lookup. We only recognize the mock ID trn_ravi_01
    if (queryId.trim() === 'trn_ravi_01') {
      setResult({
        id: 'trn_ravi_01',
        trade: 'CNC Operator',
        batch: 'CNC-2025-BATCH-02',
        district: 'Ahmedabad',
        trackingStatus: 'Active',
        outcomes: [
          { cycle: '3-Month Check-in', status: 'Completed & Verified by Employer' },
          { cycle: '6-Month Check-in', status: 'Pending Verification' },
          { cycle: '12-Month Check-in', status: 'Locked / Not Due' }
        ],
        isSynthetic: true
      });
    } else {
      setResult(null);
    }
  };

  return (
    <div className="track-container py-12">
      <div className="container" style={{ maxWidth: '650px' }}>
        
        <button onClick={() => navigate('/')} className="btn btn-outline btn-sm mb-4">
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>

        <h1 className="page-title text-center mb-2">Track Outcome</h1>
        <p className="page-subtitle text-center text-muted mb-8">
          Verify the longitudinal tracking progress of a vocational trainee registration using their system ID.
        </p>

        {/* Search form */}
        <form onSubmit={handleSearch} className="search-form card flex mb-6">
          <input 
            type="text" 
            placeholder="Enter Trainee Registry ID (e.g. trn_ravi_01)..." 
            value={queryId}
            onChange={(e) => setQueryId(e.target.value)}
            className="form-control"
            style={{ flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
            <Search size={16} />
            <span>Verify Status</span>
          </button>
        </form>

        {/* Info card on Privacy */}
        <div className="alert-card flex gap-3 mb-6">
          <Lock size={20} className="text-saffron" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p className="text-muted text-sm" style={{ margin: 0 }}>
            <strong>Privacy Protection Standard:</strong> To secure candidate identities, this public portal does not disclose trainee names, contact numbers, exact salary figures, or corporate employer tags. Use this tool purely to audit check-in completions.
          </p>
        </div>

        {/* Result Area */}
        {searched && (
          <div className="search-results-area">
            {result ? (
              <div className="card result-card">
                <div className="result-header flex justify-between items-center mb-4 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <span className="text-xs text-muted">REGISTRY ID: {result.id}</span>
                    <h4 style={{ margin: '2px 0 0 0', fontSize: '16px' }}>{result.trade}</h4>
                  </div>
                  <span className="badge badge-green">Tracking {result.trackingStatus}</span>
                </div>

                <div className="result-body flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted text-xs block">BATCH CODE</span>
                      <strong className="text-brown">{result.batch}</strong>
                    </div>
                    <div>
                      <span className="text-muted text-xs block">REGISTERED DISTRICT</span>
                      <strong className="text-brown">{result.district}</strong>
                    </div>
                  </div>

                  <div className="checkin-steps mt-2">
                    <span className="text-muted text-xs block mb-2">LONGITUDINAL PROGRESS TIMELINE</span>
                    <ul className="public-timeline-list">
                      {result.outcomes.map((item: any, idx: number) => (
                        <li key={idx} className="timeline-item flex items-start gap-3 mb-3">
                          <CheckCircle size={16} className={item.status.includes('Completed') ? 'text-green' : 'text-muted-icon'} />
                          <div>
                            <span className="timeline-step-name text-sm font-semibold">{item.cycle}</span>
                            <p className="timeline-step-status text-xs text-muted" style={{ margin: 0 }}>{item.status}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.isSynthetic && (
                    <div className="text-center text-sm text-muted mt-2 py-2" style={{ borderTop: '1px dashed var(--border-color)', fontSize: '11px' }}>
                      * Verified under synthetic demonstration database records.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card text-center py-8">
                <ShieldAlert size={36} className="text-muted" style={{ margin: '0 auto 8px' }} />
                <h5>Invalid Registration ID</h5>
                <p className="text-muted text-sm">No records found matching ID. Please double-check characters or request verification through authorized employer logins.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .search-form {
          padding: 8px;
          gap: 0;
        }
        .result-card {
          border-top: 3px solid var(--status-green-text);
        }
        .public-timeline-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .text-green {
          color: var(--status-green-text);
          margin-top: 2px;
        }
        .text-muted-icon {
          color: var(--border-color-hover);
          margin-top: 2px;
        }
        .timeline-step-name {
          color: var(--text-saffron-dark);
        }
      `}</style>
    </div>
  );
};
export default TrackOutcomePage;
