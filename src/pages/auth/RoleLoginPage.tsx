import React, { useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserCheck, Building2, GraduationCap, ShieldCheck, ArrowLeft, Eye, EyeOff, Lock, RefreshCw } from 'lucide-react';

export const RoleLoginPage: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Normalize path role to official role names
  let normalizedRole = 'trainee';
  if (role === 'employer') normalizedRole = 'employer';
  else if (role === 'training-provider') normalizedRole = 'provider';
  else if (role === 'government') normalizedRole = 'government';

  // Info mapping based on role
  const roleMeta: Record<string, { title: string; icon: React.ReactNode; color: string; demoCreds: string }> = {
    trainee: {
      title: t('role.trainee'),
      icon: <UserCheck size={28} />,
      color: 'saffron',
      demoCreds: 'trainee@kaushalsetu.gov.in / password123'
    },
    employer: {
      title: t('role.employer'),
      icon: <Building2 size={28} />,
      color: 'brown',
      demoCreds: 'employer@kaushalsetu.gov.in / password123'
    },
    provider: {
      title: t('role.provider'),
      icon: <GraduationCap size={28} />,
      color: 'saffron',
      demoCreds: 'provider@kaushalsetu.gov.in / password123'
    },
    government: {
      title: t('role.government'),
      icon: <ShieldCheck size={28} />,
      color: 'brown',
      demoCreds: 'government@kaushalsetu.gov.in / password123'
    }
  };

  const meta = roleMeta[normalizedRole] || roleMeta.trainee;

  const validateForm = () => {
    const localErrors: Record<string, string> = {};
    if (!email) {
      localErrors.email = 'Email / Username is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        localErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (!password) {
      localErrors.password = 'Password is required';
    } else if (password.length < 6) {
      localErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Validation failed. Please correct the inline errors.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const authenticatedUser = await login(email, password);
      showToast(`Welcome back, ${authenticatedUser.name}!`, 'success');

      // The authenticated role returned by the backend is authoritative.
      const targetRole = authenticatedUser.role;
      let redirectPath = '/';
      if (targetRole === 'trainee') redirectPath = '/trainee/dashboard';
      else if (targetRole === 'employer') redirectPath = '/employer/dashboard';
      else if (targetRole === 'provider') redirectPath = '/training-provider/dashboard';
      else if (targetRole === 'government') redirectPath = '/government/dashboard';

      // Check if they tried to access a route that redirected them here
      const from = (location.state as any)?.from?.pathname;
      
      // If the authenticated role doesn't match the route role they logged in from, 
      // let them know and route them safely to their official dashboard.
      if (targetRole !== normalizedRole) {
        showToast(`Redirected to your official portal: ${targetRole.toUpperCase()}`, 'info');
      }

      navigate(from && from.startsWith(`/${targetRole}`) ? from : redirectPath, { replace: true });
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Authentication failed. Please verify credentials.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const autofillDemo = () => {
    if (normalizedRole === 'trainee') {
      setEmail('trainee@kaushalsetu.gov.in');
    } else if (normalizedRole === 'employer') {
      setEmail('employer@kaushalsetu.gov.in');
    } else if (normalizedRole === 'provider') {
      setEmail('provider@kaushalsetu.gov.in');
    } else if (normalizedRole === 'government') {
      setEmail('government@kaushalsetu.gov.in');
    }
    setPassword('password123');
    setErrors({});
  };

  return (
    <div className="login-page-container py-12 flex items-center justify-center">
      <div className="login-card-wrapper card">
        {/* Card Header with Role Styling */}
        <div className={`login-card-header color-${meta.color}`}>
          <div className="login-role-icon">{meta.icon}</div>
          <div className="login-role-title">
            <span className="portal-sub">Secure Login Gate</span>
            <h3>{meta.title}</h3>
          </div>
        </div>

        <div className="login-card-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="email">{t('login.email')}</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors(prev => {
                      const copy = { ...prev };
                      delete copy.email;
                      return copy;
                    });
                  }
                }}
                className="form-control"
                placeholder="Enter email e.g. name@gujarat.gov.in"
                disabled={submitting}
              />
              {errors.email && <div className="inline-error-msg">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">{t('login.password')}</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors(prev => {
                        const copy = { ...prev };
                        delete copy.password;
                        return copy;
                      });
                    }
                  }}
                  className="form-control password-control"
                  placeholder="••••••••"
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  disabled={submitting}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <div className="inline-error-msg">{errors.password}</div>}
            </div>

            <div className="login-actions flex justify-between items-center mb-4">
              <a href="#forgot" className="forgot-pw-link text-sm font-medium">
                {t('login.forgot')}
              </a>
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary login-submit-btn flex items-center justify-center gap-2">
              {submitting ? <RefreshCw className="loading-spinner animate-spin" size={14} /> : <Lock size={14} />}
              <span>{submitting ? 'Verifying...' : t('login.button')}</span>
            </button>
          </form>

          {/* Quick Demo Autofill section */}
          <div className="demo-credentials-box card mt-6">
            <h5 className="demo-title">Demonstration Credentials</h5>
            <p className="demo-desc">Click autofill to instantly configure the mock candidate parameters:</p>
            <div className="creds-line mt-2">
              <code>{meta.demoCreds}</code>
            </div>
            <button type="button" onClick={autofillDemo} className="btn btn-secondary btn-sm mt-3" style={{ width: '100%' }}>
              Autofill Credentials
            </button>
          </div>

          <div className="back-selection-wrapper mt-6 text-center">
            <Link to="/login" className="back-link flex items-center justify-center gap-1 text-sm">
              <ArrowLeft size={14} />
              <span>{t('login.back')}</span>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .login-page-container {
          min-height: calc(100vh - 160px);
          background-color: var(--bg-primary);
        }
        .login-card-wrapper {
          max-width: 440px;
          width: 100%;
          padding: 0;
          overflow: hidden;
        }
        .login-card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px;
          border-bottom: 1px solid var(--border-color);
        }
        .login-card-header.color-saffron {
          background-color: var(--bg-cream);
        }
        .login-card-header.color-brown {
          background-color: #F0E6D8;
        }
        .login-role-icon {
          width: 48px;
          height: 48px;
          background-color: var(--bg-card);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color);
          color: var(--text-saffron-dark);
        }
        .login-role-title h3 {
          margin: 0;
          font-size: 18px;
        }
        .portal-sub {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-muted);
          display: block;
        }
        .login-card-body {
          padding: 24px;
        }
        .password-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .password-control {
          width: 100%;
          padding-right: 40px !important;
        }
        .password-toggle-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .forgot-pw-link {
          color: var(--text-brown);
        }
        .forgot-pw-link:hover {
          color: var(--accent-icon);
        }
        .login-submit-btn {
          width: 100%;
          height: 40px;
        }

        .demo-credentials-box {
          border-style: dashed;
          background-color: #FAF9F5;
          padding: 12px 16px;
        }
        .demo-title {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-saffron-dark);
          margin: 0;
        }
        .demo-desc {
          font-size: 11px;
          color: var(--text-muted);
          margin: 2px 0 0 0;
        }
        .creds-line {
          font-size: 11px;
          background-color: var(--bg-cream);
          padding: 4px 8px;
          border-radius: 4px;
          display: inline-block;
          font-weight: 600;
        }
        
        .back-link {
          color: var(--text-muted);
        }
        .back-link:hover {
          color: var(--text-primary);
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
export default RoleLoginPage;
