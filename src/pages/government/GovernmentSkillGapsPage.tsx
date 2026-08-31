import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { governmentApi } from '../../api/governmentApi';
import type { SkillGapTheme } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, BrainCircuit } from 'lucide-react';

export const GovernmentSkillGapsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [gaps, setGaps] = useState<SkillGapTheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGaps = async () => {
      try {
        const data = await governmentApi.getSkillGaps();
        setGaps(data);
      } catch (err: any) {
        showToast(err.message || 'Failed to sync skill gap intelligence data.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchGaps();
  }, []);

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <div className="loading-spinner" style={{ margin: '0 auto 16px' }} />
        <p className="text-muted">Analyzing corporate feedback and classifying skill-gaps...</p>
      </div>
    );
  }

  return (
    <div className="gov-skillgaps py-8">
      <div className="container" style={{ maxWidth: '850px' }}>
        
        <button onClick={() => navigate('/government/dashboard')} className="btn btn-outline btn-sm mb-4">
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </button>

        <div className="card mb-6">
          <div className="flex gap-3 items-center pb-2 mb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <BrainCircuit size={20} className="text-saffron" />
            <h3 style={{ margin: 0, fontSize: '18px' }}>Ecosystem Skill-Gap Intelligence Desk</h3>
          </div>
          <p className="text-xs text-muted" style={{ margin: 0 }}>
            This portal aggregates corporate feedback using natural language processing (NLP) to classify recurring workplace issues and training gaps identified by employers of certified ITI graduates.
          </p>
        </div>

        <div className="gaps-grid flex flex-col gap-6">
          {gaps.map((gap) => (
            <div key={gap.id} className="card gap-theme-card border-saffron">
              <div className="gap-header flex justify-between items-start pb-2 mb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <span className="badge badge-yellow" style={{ fontSize: '10px' }}>{gap.category}</span>
                  <h4 className="gap-theme-title mt-2" style={{ margin: '8px 0 0 0', fontSize: '15px' }}>
                    "{gap.themeText}"
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted block">REPORT COUNT</span>
                  <strong className="text-lg text-brown">{gap.count} reports</strong>
                </div>
              </div>

              <div className="gap-body grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-muted block">AFFECTED DISTRICT</span>
                  <strong className="text-brown">{gap.district}</strong>
                </div>
                <div>
                  <span className="text-muted block">NLP CLASSIFICATION CONFIDENCE</span>
                  <strong className="text-brown">{(gap.confidence * 100).toFixed(0)}%</strong>
                </div>
                <div className="col-span-3 mt-2">
                  <span className="text-muted block mb-1">DETECTED RECURRING KEYWORDS:</span>
                  <div className="keyword-badges flex gap-2">
                    {gap.recentKeywords.map((kw, idx) => (
                      <span key={idx} className="keyword-badge bg-primary text-sm font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        .gap-theme-card {
          border-top: 3px solid var(--accent-saffron);
        }
        .gap-theme-title {
          color: var(--text-saffron-dark);
          font-weight: 700;
        }
        .keyword-badges {
          flex-wrap: wrap;
        }
        .keyword-badge {
          background-color: var(--bg-cream);
          color: var(--text-brown);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          border: 1px solid var(--border-color);
        }
      `}</style>
    </div>
  );
};
export default GovernmentSkillGapsPage;
