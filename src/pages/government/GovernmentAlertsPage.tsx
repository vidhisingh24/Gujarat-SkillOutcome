import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { governmentApi } from '../../api/governmentApi';
import type { GovAlertsResponse } from '../../api/governmentApi';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const GovernmentAlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [alerts, setAlerts] = useState<GovAlertsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await governmentApi.getAlerts();
        setAlerts(data);
      } catch (err: any) {
        showToast(err.message || 'Failed to sync early warning alerts.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <div className="loading-spinner" style={{ margin: '0 auto 16px' }} />
        <p className="text-muted">Analyzing state databases and compiling early warning alerts...</p>
      </div>
    );
  }

  return (
    <div className="gov-alerts py-8">
      <div className="container" style={{ maxWidth: '750px' }}>
        
        <button onClick={() => navigate('/government/dashboard')} className="btn btn-outline btn-sm mb-4">
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </button>

        <div className="card mb-6">
          <div className="flex gap-3 items-center pb-2 mb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <AlertCircle size={20} className="text-saffron" />
            <h3 style={{ margin: 0, fontSize: '18px' }}>Ecosystem Early Warning Feed</h3>
          </div>
          <p className="text-xs text-muted" style={{ margin: 0 }}>
            These flags are triggered when candidate employment retention rates drop over consecutive quarters or trade relevance values dip below DET state compliance margins.
          </p>
        </div>

        {alerts && (
          <div className="alerts-feed-wrapper flex flex-col gap-4">
            {alerts.list.map((alert) => (
              <div 
                key={alert.id} 
                className={`card alert-item-card flex gap-4 ${
                  alert.severity === 'RED' ? 'border-status-red' : 'border-status-yellow'
                }`}
              >
                <div className="alert-icon-wrapper flex items-start">
                  <AlertCircle 
                    className={alert.severity === 'RED' ? 'text-red' : 'text-saffron'} 
                    size={24} 
                    style={{ flexShrink: 0 }}
                  />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`badge ${
                      alert.severity === 'RED' ? 'badge-red' : 'badge-yellow'
                    }`}>
                      {alert.severity} Priority
                    </span>
                    <span className="text-xs text-muted">Registry Code: {alert.programmeId}</span>
                  </div>
                  
                  <p className="text-sm font-semibold" style={{ margin: 0, color: 'var(--text-primary)' }}>{alert.message}</p>
                  
                  <div className="flex justify-between items-center mt-3 pt-2" style={{ borderTop: '1px dashed var(--border-color)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>Logged on {alert.date}</span>
                    <button onClick={() => navigate('/government/programmes')} className="btn btn-secondary btn-sm py-1">
                      Audit Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <style>{`
        .alert-item-card {
          border-left: 6px solid var(--border-color);
        }
        .alert-item-card.border-status-red {
          border-left-color: var(--status-red-text);
        }
        .alert-item-card.border-status-yellow {
          border-left-color: var(--status-yellow-text);
        }
        
        .alert-icon-wrapper {
          margin-top: 2px;
        }
        .text-red { color: var(--status-red-text); }
      `}</style>
    </div>
  );
};
export default GovernmentAlertsPage;
