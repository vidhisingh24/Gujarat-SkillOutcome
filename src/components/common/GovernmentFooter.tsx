import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export const GovernmentFooter: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="gov-footer">
      <div className="gov-footer-top-accent" />
      
      <div className="container footer-grid">
        {/* Directorate Column */}
        <div className="footer-col brand-col">
          <h4 className="footer-title">{t('footer.brand_title')}</h4>
          <p className="footer-desc">
            {t('footer.brand_desc')}
          </p>
          <div className="gov-tag">{t('footer.tag')}</div>
        </div>

        {/* Contact Column */}
        <div className="footer-col contact-col">
          <h4 className="footer-title">{t('footer.contact_title')}</h4>
          <ul className="footer-contact-list">
            <li>
              <MapPin size={16} className="contact-icon" style={{ flexShrink: 0 }} />
              <span>{t('footer.address')}</span>
            </li>
            <li>
              <Phone size={16} className="contact-icon" style={{ flexShrink: 0 }} />
              <span>+91 79 23253812 / 13 (DET Desk)</span>
            </li>
            <li>
              <Mail size={16} className="contact-icon" style={{ flexShrink: 0 }} />
              <span>support-kaushalsetu@gujarat.gov.in</span>
            </li>
          </ul>
        </div>

        {/* External Resources / Quick links */}
        <div className="footer-col links-col">
          <h4 className="footer-title">{t('footer.links_title')}</h4>
          <ul className="footer-links-list">
            <li>
              <a 
                href="https://gujaratindia.gov.in" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Gujarat State Portal (opens in a new tab)"
              >
                <span>{t('footer.link.state')}</span>
                <ExternalLink size={12} style={{ flexShrink: 0 }} />
              </a>
            </li>
            <li>
              <a 
                href="https://skills.gujarat.gov.in" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="DET Gujarat Portal (opens in a new tab)"
              >
                <span>{t('footer.link.det')}</span>
                <ExternalLink size={12} style={{ flexShrink: 0 }} />
              </a>
            </li>
            <li>
              <a 
                href="https://msde.gov.in" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Ministry of Skill Development (opens in a new tab)"
              >
                <span>{t('footer.link.msde')}</span>
                <ExternalLink size={12} style={{ flexShrink: 0 }} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Legal & Synthetic Warning Bottom bar */}
      <div className="gov-footer-bottom">
        <div className="container bottom-flex">
          <div className="bottom-info">
            <span className="det-copy">{t('footer.det')}</span>
            <p className="legal-notice">{t('footer.copy')}</p>
          </div>
          <div className="footer-legal-links">
            <a href="#privacy">{t('footer.privacy')}</a>
            <span>|</span>
            <a href="#terms">{t('footer.terms')}</a>
            <span>|</span>
            <a href="#help">{t('footer.help')}</a>
          </div>
        </div>
      </div>

      {/* Styled inline for Gov Footer */}
      <style>{`
        .gov-footer {
          background-color: #262420;
          color: #E2DFD5;
          padding-top: 48px;
          border-top: 1px solid var(--border-color);
          position: relative;
        }
        .gov-footer-top-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background-color: var(--accent-saffron);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr;
          gap: 40px;
          padding-bottom: 40px;
        }
        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .footer-title {
          color: var(--accent-saffron);
          font-family: var(--font-title);
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .footer-desc {
          font-size: 13px;
          line-height: 1.6;
          color: #C1BEB5;
          word-wrap: break-word;
          margin: 0;
        }
        .gov-tag {
          font-size: 11px;
          background-color: #383530;
          color: var(--accent-saffron);
          padding: 6px 12px;
          border-radius: 4px;
          align-self: flex-start;
          font-weight: 600;
          letter-spacing: 0.5px;
          border: 1px solid #4C4840;
        }
        .footer-contact-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-size: 13px;
          padding: 0;
          margin: 0;
        }
        .footer-contact-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          line-height: 1.5;
          color: #C1BEB5;
          word-break: break-word;
        }
        .contact-icon {
          color: var(--accent-saffron);
          margin-top: 2px;
        }
        .footer-links-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 13px;
          padding: 0;
          margin: 0;
        }
        .footer-links-list a {
          color: #C1BEB5;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 0.15s ease;
          line-height: 1.4;
          word-break: break-word;
        }
        .footer-links-list a:hover {
          color: var(--accent-saffron);
        }
        
        .gov-footer-bottom {
          border-top: 1px solid #383530;
          background-color: #1E1D19;
          padding: 24px 0;
          font-size: 12px;
          color: #A3A097;
        }
        .bottom-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }
        .bottom-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }
        .det-copy {
          font-weight: 600;
          color: #C1BEB5;
          line-height: 1.4;
          display: block;
        }
        .legal-notice {
          font-size: 11px;
          color: #8C8981;
          line-height: 1.5;
          margin: 0;
          word-wrap: break-word;
        }
        .footer-legal-links {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .footer-legal-links a {
          color: #C1BEB5;
          line-height: 1.4;
          white-space: nowrap;
        }
        .footer-legal-links a:hover {
          color: var(--accent-saffron);
        }

        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
          .links-col {
            grid-column: span 2;
          }
        }
        @media (max-width: 768px) {
          .bottom-flex {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .footer-legal-links {
            margin-top: 4px;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .links-col {
            grid-column: span 1;
          }
        }
      `}</style>
    </footer>
  );
};
export default GovernmentFooter;
