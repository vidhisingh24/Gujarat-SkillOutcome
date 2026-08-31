import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import type { Language } from '../../context/LanguageContext';
import { Menu, X, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';

export const GovernmentHeader: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleSettings = () => setSettingsOpen(!settingsOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
    setSettingsOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'trainee': return '/trainee/dashboard';
      case 'employer': return '/employer/dashboard';
      case 'provider': return '/training-provider/dashboard';
      case 'government': return '/government/dashboard';
      default: return '/';
    }
  };

  const menuItems = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.programmes'), path: '/programmes' },
    { label: t('nav.track'), path: '/track-outcome' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  return (
    <header className="gov-header">
      {/* Top Banner with Emblem */}
      <div className="gov-top-banner">
        <div className="container banner-flex">
          {/* Left: Gujarat Government Identity */}
          <div className="gov-identity-left">
            <span className="gov-state-name">{t('gov.gujarat')}</span>
            <span className="gov-state-sub">{t('header.det_title')}</span>
          </div>

          {/* Center: Indian Emblem Treatment */}
          <div className="gov-emblem-center">
            <svg className="ashok-chakra" viewBox="0 0 100 100" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="44" stroke="#000080" strokeWidth="3"/>
              <circle cx="50" cy="50" r="10" stroke="#000080" strokeWidth="2" fill="#000080"/>
              {Array.from({ length: 24 }).map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 44 * Math.cos((i * 15 * Math.PI) / 180)}
                  y2={50 + 44 * Math.sin((i * 15 * Math.PI) / 180)}
                  stroke="#000080"
                  strokeWidth="1.5"
                />
              ))}
            </svg>
            <div className="gov-national-info">
              <span className="gov-national-name">{t('gov.india')}</span>
              <span className="satyameva-text">{t('satyameva')}</span>
            </div>
          </div>

          {/* Right: Actions, Language & Settings */}
          <div className="gov-actions-right">
            {/* Language Selector */}
            <div className="language-selector">
              {(['EN', 'GU', 'HI'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  className={`lang-btn ${language === lang ? 'active' : ''}`}
                  onClick={() => setLanguage(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Settings & Profile Portal Action */}
            <div className="settings-portal">
              {isAuthenticated ? (
                <div className="dropdown-container">
                  <button className="settings-trigger" onClick={toggleSettings}>
                    <UserIcon size={16} />
                    <span className="user-name-text">{user?.name}</span>
                    <ChevronDown size={14} />
                  </button>
                  {settingsOpen && (
                    <div className="settings-dropdown">
                      <Link to={getDashboardLink()} className="dropdown-item" onClick={() => setSettingsOpen(false)}>
                        <UserIcon size={14} />
                        <span>{t('nav.my_dashboard')}</span>
                      </Link>
                      <button className="dropdown-item logout-btn" onClick={handleLogout}>
                        <LogOut size={14} />
                        <span>{t('nav.logout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary login-nav-btn">
                  <UserIcon size={14} />
                  <span>{t('nav.login')}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="gov-main-nav">
        <div className="container nav-container">
          <div className="platform-branding">
            <Link to="/" className="brand-link">
              <span className="brand-accent">KaushalSetu</span>
              <span className="brand-suffix">Gujarat</span>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <ul className="nav-menu-desktop">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Hamburguer */}
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <ul className="mobile-nav-list">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {isAuthenticated ? (
              <>
                <li className="mobile-menu-divider" />
                <li>
                  <Link
                    to={getDashboardLink()}
                    className="mobile-nav-link text-saffron"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.go_to_dashboard')} ({user?.role})
                  </Link>
                </li>
                <li>
                  <button className="mobile-nav-logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>{t('nav.logout')}</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="mobile-menu-divider" />
                <li>
                  <Link
                    to="/login"
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '8px' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}

      {/* Styles for Gov Header */}
      <style>{`
        .gov-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 4px rgba(0,0,0,0.03);
          border-bottom: 1px solid var(--border-color);
        }
        .gov-top-banner {
          background-color: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
          padding: 8px 0;
        }
        .banner-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }
        .gov-identity-left {
          display: flex;
          flex-direction: column;
        }
        .gov-state-name {
          font-weight: 700;
          font-size: 14px;
          color: var(--text-saffron-dark);
          line-height: 1.2;
        }
        .gov-state-sub {
          font-size: 11px;
          color: var(--text-muted);
        }
        .gov-emblem-center {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ashok-chakra {
          animation: spin-slow 20s linear infinite;
        }
        .gov-national-info {
          display: flex;
          flex-direction: column;
        }
        .gov-national-name {
          font-weight: 700;
          font-size: 13px;
          color: #000080;
          line-height: 1.2;
        }
        .satyameva-text {
          font-size: 10px;
          color: var(--text-brown);
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .gov-actions-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .language-selector {
          display: flex;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          overflow: hidden;
        }
        .lang-btn {
          background: var(--bg-primary);
          border: none;
          color: var(--text-primary);
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          border-right: 1px solid var(--border-color);
        }
        .lang-btn:last-child {
          border-right: none;
        }
        .lang-btn.active, .lang-btn:hover {
          background-color: var(--accent-saffron);
          color: var(--text-saffron-dark);
        }
        .settings-trigger {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: 1px solid var(--border-color);
          padding: 6px 12px;
          border-radius: var(--radius-button);
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
          transition: all 0.15s ease;
        }
        .settings-trigger:hover {
          border-color: var(--text-muted);
          background-color: var(--bg-primary);
        }
        .user-name-text {
          max-width: 120px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dropdown-container {
          position: relative;
        }
        .settings-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 6px);
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-button);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          width: 180px;
          display: flex;
          flex-direction: column;
          padding: 4px 0;
          z-index: 1001;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          font-size: 13px;
          color: var(--text-primary);
          background: none;
          border: none;
          text-align: left;
          width: 100%;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .dropdown-item:hover {
          background-color: var(--bg-primary);
          color: var(--accent-icon);
        }
        .dropdown-item.logout-btn {
          border-top: 1px solid var(--border-color);
          color: var(--status-red-text);
        }
        .dropdown-item.logout-btn:hover {
          background-color: var(--status-red-bg);
        }
        
        /* Main Navigation styling */
        .gov-main-nav {
          background-color: var(--text-saffron-dark);
          color: var(--bg-primary);
          padding: 0;
        }
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 52px;
        }
        .brand-link {
          font-family: var(--font-title);
          font-weight: 700;
          font-size: 20px;
          color: #FFF !important;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .brand-accent {
          color: var(--accent-saffron);
        }
        .brand-suffix {
          font-weight: 400;
          opacity: 0.9;
        }
        .nav-menu-desktop {
          display: flex;
          list-style: none;
          height: 100%;
        }
        .nav-menu-desktop li {
          height: 100%;
        }
        .nav-link {
          display: flex;
          align-items: center;
          padding: 0 16px;
          height: 100%;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8) !important;
          transition: all 0.15s ease;
        }
        .nav-link:hover, .nav-link.active {
          color: #FFF !important;
          background-color: var(--secondary-brown);
          border-bottom: 3px solid var(--accent-saffron);
        }
        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          color: #FFF;
          cursor: pointer;
        }

        /* Mobile menu drawer */
        .mobile-menu-drawer {
          position: fixed;
          top: 106px;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--bg-card);
          z-index: 999;
          border-top: 1px solid var(--border-color);
          overflow-y: auto;
        }
        .mobile-nav-list {
          list-style: none;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .mobile-nav-link {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary) !important;
          display: block;
          padding: 8px 0;
        }
        .mobile-nav-link.active {
          color: var(--accent-icon) !important;
          border-left: 3px solid var(--accent-saffron);
          padding-left: 8px;
        }
        .mobile-menu-divider {
          height: 1px;
          background-color: var(--border-color);
          margin: 8px 0;
        }
        .mobile-nav-logout {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: var(--status-red-text);
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          padding: 8px 0;
          text-align: left;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .nav-menu-desktop { display: none; }
          .mobile-menu-toggle { display: block; }
          .gov-emblem-center { display: none; }
        }

        @media (max-width: 600px) {
          .gov-identity-left { display: none; }
          .gov-emblem-center { display: flex; }
          .gov-actions-right { gap: 12px; }
          .user-name-text { display: none; }
        }
      `}</style>
    </header>
  );
};
export default GovernmentHeader;
