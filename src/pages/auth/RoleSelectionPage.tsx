import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { UserCheck, Building2, GraduationCap, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export const RoleSelectionPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const roles = [
    {
      id: 'trainee',
      title: t('role.trainee'),
      icon: <UserCheck size={32} />,
      desc: 'Update check-ins, view placement statuses, and access your graduation outcome certificates.',
      path: '/login/trainee',
      color: 'saffron'
    },
    {
      id: 'employer',
      title: t('role.employer'),
      icon: <Building2 size={32} />,
      desc: 'Verify employment records for candidates, and submit industry-specific workplace skill gaps.',
      path: '/login/employer',
      color: 'brown'
    },
    {
      id: 'provider',
      title: t('role.provider'),
      icon: <GraduationCap size={32} />,
      desc: 'Access batch performance metrics, tracking status audits, and trade placement statistics.',
      path: '/login/training-provider',
      color: 'saffron'
    },
    {
      id: 'government',
      title: t('role.government'),
      icon: <ShieldCheck size={32} />,
      desc: 'Monitor state-wide indicators, district employment rates, early warnings, and skill gap intelligence.',
      path: '/login/government',
      color: 'brown'
    }
  ];

  return (
    <div className="selection-container py-12 flex items-center justify-center">
      <div className="container" style={{ maxWidth: '850px' }}>
        <div className="text-center mb-8">
          <h2 className="selection-title text-brown-dark">{t('login.title')}</h2>
          <p className="selection-subtitle text-muted text-sm mt-1">{t('login.welcome')}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {roles.map((r) => (
            <div
              key={r.id}
              className="selection-card card card-hover flex gap-4"
              onClick={() => navigate(r.path)}
            >
              <div className={`selection-icon-box color-${r.color}`}>
                {r.icon}
              </div>
              <div className="selection-details flex flex-col justify-between">
                <div>
                  <h4 className="selection-card-title">{r.title}</h4>
                  <p className="selection-card-desc">{r.desc}</p>
                </div>
                <div className="selection-action">
                  <span>Open login portal</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/" className="btn btn-outline btn-sm">
            <ArrowLeft size={14} style={{ marginRight: '4px' }} />
            Return to Landing Page
          </Link>
        </div>
      </div>

      <style>{`
        .selection-container {
          min-height: calc(100vh - 160px);
          background-color: var(--bg-primary);
        }
        .selection-title {
          font-family: var(--font-title);
          font-size: 26px;
        }
        .selection-card {
          cursor: pointer;
          padding: 24px;
        }
        .selection-icon-box {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid var(--border-color);
        }
        .selection-icon-box.color-saffron {
          background-color: var(--bg-cream);
          color: var(--accent-icon);
        }
        .selection-icon-box.color-brown {
          background-color: #F0E6D8;
          color: var(--secondary-brown);
        }
        
        .selection-card-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 6px;
          color: var(--text-saffron-dark);
        }
        .selection-card-desc {
          font-size: 11px;
          color: var(--text-muted);
          line-height: 1.45;
          margin-bottom: 12px;
        }
        .selection-action {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-brown);
        }
        .selection-card:hover .selection-action {
          color: var(--accent-icon);
        }

        @media (max-width: 768px) {
          .grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
export default RoleSelectionPage;
