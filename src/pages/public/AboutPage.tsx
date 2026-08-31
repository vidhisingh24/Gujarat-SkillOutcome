import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Info, 
  AlertTriangle, 
  UserX, 
  History, 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  CheckCircle, 
  BarChart3, 
  Search, 
  User, 
  Building2, 
  Award, 
  ShieldCheck, 
  Database, 
  Activity, 
  Zap,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="about-page-container py-10">
      <div className="container">
        
        {/* 1. PAGE INTRO */}
        <div className="about-intro text-center mb-8">
          <h1 className="about-main-title">{t('about.title')}</h1>
          <p className="about-subtitle">{t('about.subtitle')}</p>
        </div>

        {/* 2. WHAT IS KAUSHALSETU? */}
        <div className="card enables-intro-card flex gap-4 items-center mb-8">
          <div className="about-info-icon-box">
            <Info size={32} />
          </div>
          <div className="about-info-text">
            <p className="about-info-paragraph">
              {t('about.what_is_desc')}
            </p>
          </div>
        </div>

        {/* 3. THE CHALLENGE */}
        <section className="mb-10">
          <h3 className="about-section-heading text-center mb-6">{t('about.challenge_title')}</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="card challenge-card text-center">
              <div className="challenge-icon-box text-red"><AlertTriangle size={24} /></div>
              <h5 className="challenge-title">{t('about.challenge.placement')}</h5>
              <p className="challenge-desc text-muted">{t('about.challenge.placement_desc')}</p>
            </div>
            <div className="card challenge-card text-center">
              <div className="challenge-icon-box text-red"><UserX size={24} /></div>
              <h5 className="challenge-title">{t('about.challenge.skills')}</h5>
              <p className="challenge-desc text-muted">{t('about.challenge.skills_desc')}</p>
            </div>
            <div className="card challenge-card text-center">
              <div className="challenge-icon-box text-red"><History size={24} /></div>
              <h5 className="challenge-title">{t('about.challenge.followup')}</h5>
              <p className="challenge-desc text-muted">{t('about.challenge.followup_desc')}</p>
            </div>
          </div>
        </section>

        {/* 4. HOW KAUSHALSETU SOLVES IT (Process Diagram) */}
        <section className="mb-10">
          <h3 className="about-section-heading text-center mb-6">{t('about.solves_title')}</h3>
          <div className="process-flow-container card">
            <div className="process-flow">
              <div className="process-step">
                <div className="step-icon-wrapper"><GraduationCap size={18} /></div>
                <span className="step-label">{t('step1.title')}</span>
              </div>
              <ArrowRight className="flow-arrow" size={14} />
              
              <div className="process-step">
                <div className="step-icon-wrapper"><Briefcase size={18} /></div>
                <span className="step-label">{t('step2.title')}</span>
              </div>
              <ArrowRight className="flow-arrow" size={14} />

              <div className="process-step">
                <div className="step-icon-wrapper"><Calendar size={18} /></div>
                <span className="step-label">{t('step3.title')}</span>
              </div>
              <ArrowRight className="flow-arrow" size={14} />

              <div className="process-step">
                <div className="step-icon-wrapper"><Calendar size={18} /></div>
                <span className="step-label">{t('step4.title')}</span>
              </div>
              <ArrowRight className="flow-arrow" size={14} />

              <div className="process-step">
                <div className="step-icon-wrapper"><Calendar size={18} /></div>
                <span className="step-label">{t('step5.title')}</span>
              </div>
              <ArrowRight className="flow-arrow" size={14} />

              <div className="process-step">
                <div className="step-icon-wrapper"><CheckCircle size={18} /></div>
                <span className="step-label">{t('step6.title')}</span>
              </div>
              <ArrowRight className="flow-arrow" size={14} />

              <div className="process-step">
                <div className="step-icon-wrapper"><BarChart3 size={18} /></div>
                <span className="step-label">{t('step7.title')}</span>
              </div>
              <ArrowRight className="flow-arrow" size={14} />

              <div className="process-step">
                <div className="step-icon-wrapper"><Search size={18} /></div>
                <span className="step-label">{t('step8.title')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FOUR STAKEHOLDERS */}
        <section className="mb-10">
          <h3 className="about-section-heading text-center mb-6">{t('about.roles_title')}</h3>
          <div className="grid grid-cols-4 gap-6">
            <div className="card role-card text-center">
              <div className="role-icon-box"><User size={22} /></div>
              <h5 className="role-title">{t('role.trainee')}</h5>
              <p className="role-desc text-muted">{t('about.role.trainee_desc')}</p>
            </div>
            <div className="card role-card text-center">
              <div className="role-icon-box"><Building2 size={22} /></div>
              <h5 className="role-title">{t('role.employer')}</h5>
              <p className="role-desc text-muted">{t('about.role.employer_desc')}</p>
            </div>
            <div className="card role-card text-center">
              <div className="role-icon-box"><Award size={22} /></div>
              <h5 className="role-title">{t('role.provider')}</h5>
              <p className="role-desc text-muted">{t('about.role.provider_desc')}</p>
            </div>
            <div className="card role-card text-center">
              <div className="role-icon-box"><ShieldCheck size={22} /></div>
              <h5 className="role-title">{t('role.government')}</h5>
              <p className="role-desc text-muted">{t('about.role.government_desc')}</p>
            </div>
          </div>
        </section>

        {/* 6. FROM DATA TO DECISION */}
        <section className="mb-10">
          <h3 className="about-section-heading text-center mb-6">{t('about.lifecycle_title')}</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="card step-card text-center">
              <div className="step-circle mb-3"><Database size={20} /></div>
              <h5 className="step-title">{t('about.cycle.collect')}</h5>
              <p className="step-desc text-muted">{t('about.cycle.collect_desc')}</p>
            </div>
            <div className="card step-card text-center">
              <div className="step-circle mb-3"><Activity size={20} /></div>
              <h5 className="step-title">{t('about.cycle.analyse')}</h5>
              <p className="step-desc text-muted">{t('about.cycle.analyse_desc')}</p>
            </div>
            <div className="card step-card text-center">
              <div className="step-circle mb-3"><Zap size={20} /></div>
              <h5 className="step-title">{t('about.cycle.act')}</h5>
              <p className="step-desc text-muted">{t('about.cycle.act_desc')}</p>
            </div>
          </div>
        </section>

        {/* 7. WHY IT MATTERS */}
        <section className="mb-10">
          <h3 className="about-section-heading text-center mb-6">{t('about.why_title')}</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="card highlight-card text-center flex flex-col items-center gap-3">
              <CheckCircle className="text-saffron" size={24} />
              <h5 className="highlight-title">{t('about.why.tracking')}</h5>
            </div>
            <div className="card highlight-card text-center flex flex-col items-center gap-3">
              <CheckCircle className="text-saffron" size={24} />
              <h5 className="highlight-title">{t('about.why.feedback')}</h5>
            </div>
            <div className="card highlight-card text-center flex flex-col items-center gap-3">
              <TrendingUp className="text-saffron" size={24} />
              <h5 className="highlight-title">{t('about.why.development')}</h5>
            </div>
          </div>
        </section>

        {/* 8. FINAL STATEMENT */}
        <div className="about-footer-block text-center mt-12 mb-6">
          <div className="gold-accent-divider mb-4" />
          <h4 className="final-statement text-brown-dark">
            {t('about.final_statement')}
          </h4>
        </div>

      </div>

      <style>{`
        .about-page-container {
          background-color: var(--bg-primary);
          flex: 1;
        }
        .about-main-title {
          font-family: var(--font-title);
          font-size: 28px;
          font-weight: 800;
          color: var(--text-saffron-dark);
          text-transform: uppercase;
          margin-bottom: 4px;
          letter-spacing: 0.5px;
        }
        .about-subtitle {
          font-size: 14px;
          font-style: italic;
          color: var(--text-muted);
          margin: 0;
        }

        .enables-intro-card {
          border-left: 4px solid var(--accent-saffron);
          padding: 16px 20px;
        }
        .about-info-icon-box {
          color: var(--accent-icon);
          flex-shrink: 0;
        }
        .about-info-paragraph {
          font-size: 15px;
          font-weight: 550;
          color: var(--text-primary);
          line-height: 1.5;
          margin: 0;
        }

        .about-section-heading {
          font-family: var(--font-title);
          font-size: 16px;
          font-weight: 750;
          color: var(--text-saffron-dark);
          letter-spacing: 0.5px;
          border-bottom: 2px solid #E5E2D7;
          display: inline-block;
          padding-bottom: 4px;
          width: auto;
          margin: 0 auto 24px auto;
          display: table;
        }

        .challenge-card, .role-card, .step-card, .highlight-card {
          border-color: var(--border-color);
          padding: 20px 16px;
        }
        .challenge-icon-box {
          color: var(--status-red-text);
          margin-bottom: 10px;
        }
        .challenge-title {
          font-size: 12px;
          font-weight: 750;
          color: var(--text-primary);
          margin-bottom: 6px;
          letter-spacing: 0.5px;
        }
        .challenge-desc {
          font-size: 11px;
          margin: 0;
        }

        /* Process horizontal timeline */
        .process-flow-container {
          padding: 20px;
          border-color: var(--border-color);
          overflow-x: auto;
        }
        .process-flow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-width: 900px;
        }
        .process-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          flex: 1;
        }
        .step-icon-wrapper {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: var(--bg-cream);
          color: var(--accent-icon);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color);
        }
        .step-label {
          font-size: 9px;
          font-weight: 750;
          color: var(--text-primary);
          text-transform: uppercase;
          text-align: center;
          white-space: nowrap;
        }
        .flow-arrow {
          color: var(--border-color-hover);
          flex-shrink: 0;
        }

        /* Role Cards styling */
        .role-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          background-color: var(--bg-cream);
          color: var(--accent-icon);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          border: 1px solid var(--border-color);
        }
        .role-title {
          font-size: 12px;
          font-weight: 750;
          color: var(--text-saffron-dark);
          margin-bottom: 6px;
          letter-spacing: 0.5px;
        }
        .role-desc {
          font-size: 11px;
          line-height: 1.4;
          margin: 0;
        }

        /* Data Decision steps */
        .step-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--bg-cream);
          color: var(--accent-icon);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          border: 1px solid var(--border-color);
        }
        .step-title {
          font-size: 13px;
          font-weight: 750;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .step-desc {
          font-size: 11px;
          margin: 0;
        }

        /* Highlights */
        .highlight-card {
          justify-content: center;
        }
        .highlight-title {
          font-size: 11px;
          font-weight: 750;
          color: var(--text-saffron-dark);
          margin: 0;
          letter-spacing: 0.5px;
          line-height: 1.3;
        }

        .gold-accent-divider {
          width: 80px;
          height: 3px;
          background-color: var(--accent-saffron);
          margin: 0 auto;
          border-radius: 2px;
        }
        .final-statement {
          font-size: 15px;
          font-weight: 700;
          font-style: italic;
          margin: 0;
        }

        @media (max-width: 900px) {
          .grid-cols-3, .grid-cols-4 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
export default AboutPage;
