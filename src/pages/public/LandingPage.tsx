import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { mockLandingStats } from '../../data/mockData';
import { 
  UserCheck, 
  Building2, 
  GraduationCap, 
  ShieldAlert, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  CheckSquare, 
  MessageSquare, 
  BarChart3 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const roleCards = [
    {
      role: 'trainee',
      title: t('role.trainee'),
      icon: <UserCheck size={28} className="role-card-icon" />,
      desc: t('role.trainee.action'),
      path: '/login/trainee',
      color: 'saffron'
    },
    {
      role: 'employer',
      title: t('role.employer'),
      icon: <Building2 size={28} className="role-card-icon" />,
      desc: t('role.employer.action'),
      path: '/login/employer',
      color: 'brown'
    },
    {
      role: 'provider',
      title: t('role.provider'),
      icon: <GraduationCap size={28} className="role-card-icon" />,
      desc: t('role.provider.action'),
      path: '/login/training-provider',
      color: 'saffron'
    },
    {
      role: 'government',
      title: t('role.government'),
      icon: <ShieldCheck size={28} className="role-card-icon" />,
      desc: t('role.government.action'),
      path: '/login/government',
      color: 'brown'
    }
  ];

  const steps = [
    { num: '1', title: t('step1.title'), desc: t('step1.desc') },
    { num: '2', title: t('step2.title'), desc: t('step2.desc') },
    { num: '3', title: t('step3.title'), desc: t('step3.desc') },
    { num: '4', title: t('step4.title'), desc: t('step4.desc') },
    { num: '5', title: t('step5.title'), desc: t('step5.desc') },
    { num: '6', title: t('step6.title'), desc: t('step6.desc') },
    { num: '7', title: t('step7.title'), desc: t('step7.desc') },
    { num: '8', title: t('step8.title'), desc: t('step8.desc') }
  ];

  return (
    <div className="landing-container">
      {/* Compact Hero Banner Section */}
      <section className="landing-hero">
        <div className="container hero-content text-center">
          <h1 className="hero-title text-brown-dark">{t('platform.title')}</h1>
          <div className="hero-subtitle text-brown">{t('platform.subtitle')}</div>
          <p className="hero-tagline text-muted">{t('platform.tagline')}</p>
        </div>
      </section>

      {/* Role Selection Matrix */}
      <section className="role-matrix-section py-8">
        <div className="container">
          <h3 className="section-title text-center mb-6">{t('home.select_role')}</h3>
          <div className="grid grid-cols-4 gap-6">
            {roleCards.map((card) => (
              <div
                key={card.role}
                className="role-card card card-hover"
                onClick={() => navigate(card.path)}
              >
                <div className={`role-icon-box color-${card.color}`}>
                  {card.icon}
                </div>
                <h4 className="role-card-title">{card.title}</h4>
                <p className="role-card-desc">{card.desc}</p>
                <div className="role-card-action">
                  <span>{t('home.authorized_login')}</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What KaushalSetu Enables Section */}
      <section className="enables-section py-8">
        <div className="container">
          <h3 className="section-title text-center mb-6" style={{ fontSize: '18px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {t('home.enables_title')}
          </h3>
          <div className="grid grid-cols-4 gap-6">
            <div className="enables-card card text-center">
              <div className="enables-icon-box">
                <TrendingUp size={24} />
              </div>
              <h4 className="enables-title">{t('home.enables.track')}</h4>
              <p className="enables-desc">{t('home.enables.track_desc')}</p>
            </div>
            <div className="enables-card card text-center">
              <div className="enables-icon-box">
                <CheckSquare size={24} />
              </div>
              <h4 className="enables-title">{t('home.enables.verify')}</h4>
              <p className="enables-desc">{t('home.enables.verify_desc')}</p>
            </div>
            <div className="enables-card card text-center">
              <div className="enables-icon-box">
                <MessageSquare size={24} />
              </div>
              <h4 className="enables-title">{t('home.enables.improve')}</h4>
              <p className="enables-desc">{t('home.enables.improve_desc')}</p>
            </div>
            <div className="enables-card card text-center">
              <div className="enables-icon-box">
                <BarChart3 size={24} />
              </div>
              <h4 className="enables-title">{t('home.enables.decide')}</h4>
              <p className="enables-desc">{t('home.enables.decide_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Process Timeline Diagram */}
      <section className="timeline-section py-12">
        <div className="container">
          <h3 className="section-title text-center mb-2">{t('home.lifecycle_title')}</h3>
          <p className="section-subtitle text-center text-muted mb-8">
            {t('home.lifecycle_subtitle')}
          </p>
          
          <div className="timeline-flow">
            {steps.map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="timeline-step card">
                  <div className="step-badge">{step.num}</div>
                  <h5 className="step-title">{step.title}</h5>
                  <p className="step-desc">{step.desc}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="timeline-connector">
                    <ArrowRight size={18} className="connector-arrow" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="stats-section py-8">
        <div className="container">
          <h3 className="section-title text-center mb-6">{t('home.metrics_title')}</h3>
          <div className="grid grid-cols-4 gap-6">
            {mockLandingStats.map((stat, idx) => {
              const labelKeys = ['stats.trainees', 'stats.retention', 'stats.districts', 'stats.flagged'];
              return (
                <div key={idx} className="stat-card card text-center">
                  <span className="stat-val">{stat.value}</span>
                  <span className="stat-lbl">{t(labelKeys[idx])}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Synthetic Disclaimer Banner */}
      <section className="disclaimer-section container py-4 mb-6">
        <div className="alert-card alert-card-warning flex items-center gap-4">
          <ShieldAlert size={28} className="text-saffron" style={{ flexShrink: 0 }} />
          <div className="disclaimer-text">
            <h5 className="disclaimer-title" style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>
              {t('home.disclaimer_title')}
            </h5>
            <p className="disclaimer-desc" style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
              {t('home.disclaimer_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Styling */}
      <style>{`
        .landing-container {
          background-color: var(--bg-primary);
          flex: 1;
        }
        .landing-hero {
          padding: 40px 0 28px 0;
          background-color: var(--bg-primary);
        }
        .hero-title {
          font-family: var(--font-title);
          font-size: 56px;
          font-weight: 850;
          letter-spacing: 2px;
          line-height: 1.05;
          margin-bottom: 4px;
          text-transform: uppercase;
          color: var(--text-saffron-dark);
        }
        .hero-subtitle {
          font-family: var(--font-title);
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--text-brown);
          margin-bottom: 8px;
        }
        .hero-tagline {
          font-size: 14px;
          font-weight: 550;
          font-style: italic;
          color: var(--text-muted);
          margin-top: 4px;
        }
        
        .section-title {
          font-size: 20px;
          font-family: var(--font-title);
          color: var(--text-saffron-dark);
        }
        .section-subtitle {
          font-size: 13px;
        }

        /* What KaushalSetu Enables styles */
        .enables-section {
          background-color: var(--bg-card);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }
        .enables-card {
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-color: var(--border-color);
        }
        .enables-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: var(--bg-cream);
          color: var(--accent-icon);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          border: 1px solid var(--border-color);
        }
        .enables-title {
          font-family: var(--font-title);
          font-size: 14px;
          font-weight: 750;
          color: var(--text-saffron-dark);
          margin-bottom: 6px;
          letter-spacing: 0.5px;
        }
        .enables-desc {
          font-size: 11px;
          color: var(--text-muted);
          line-height: 1.4;
          margin: 0;
        }

        .role-matrix-section {
          background-color: var(--bg-cream);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }
        .role-card {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 24px 16px;
        }
        .role-icon-box {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          border: 1px solid var(--border-color);
        }
        .role-icon-box.color-saffron {
          background-color: var(--bg-cream);
          color: var(--accent-icon);
        }
        .role-icon-box.color-brown {
          background-color: #F0E6D8;
          color: var(--secondary-brown);
        }
        .role-card-title {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        .role-card-desc {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 16px;
          line-height: 1.4;
          flex: 1;
        }
        .role-card-action {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-brown);
        }
        .role-card:hover .role-card-action {
          color: var(--accent-icon);
        }

        /* Timeline Horizontal Flow Scroll styling */
        .timeline-section {
          background-color: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
        }
        .timeline-flow {
          display: flex;
          align-items: center;
          gap: 12px;
          overflow-x: auto;
          padding: 16px 8px 24px;
          scrollbar-width: thin;
        }
        .timeline-step {
          min-width: 180px;
          max-width: 200px;
          flex-shrink: 0;
          padding: 16px;
          position: relative;
          text-align: center;
          border-color: var(--border-color);
        }
        .step-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 24px;
          background-color: var(--accent-saffron);
          color: var(--text-saffron-dark);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid var(--text-brown);
        }
        .step-title {
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 6px;
          color: var(--text-saffron-dark);
        }
        .step-desc {
          font-size: 11px;
          color: var(--text-muted);
          line-height: 1.3;
        }
        .timeline-connector {
          display: flex;
          align-items: center;
          color: var(--border-color-hover);
        }
        .connector-arrow {
          animation: pulse-arrow 1.5s infinite;
        }

        /* Stat cards */
        .stat-val {
          font-family: var(--font-title);
          font-size: 26px;
          font-weight: 700;
          color: var(--text-saffron-dark);
          display: block;
        }
        .stat-lbl {
          font-size: 12px;
          font-weight: 550;
          color: var(--text-muted);
        }

        @keyframes pulse-arrow {
          0% { transform: translateX(0); opacity: 0.5; }
          50% { transform: translateX(3px); opacity: 1; }
          100% { transform: translateX(0); opacity: 0.5; }
        }

        @media (max-width: 900px) {
          .timeline-flow {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
};
export default LandingPage;
