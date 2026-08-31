import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: 'trainee' | 'employer' | 'provider' | 'government';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="full-page-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Verifying security credentials...</p>
        <style>{`
          .full-page-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: calc(100vh - 160px);
            background-color: var(--bg-primary);
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border-color);
            border-top: 3px solid var(--accent-saffron);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          .loading-text {
            color: var(--text-muted);
            font-size: 14px;
            font-weight: 500;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If not authenticated, redirect to role-specific or general login
  if (!isAuthenticated || !user) {
    return <Navigate to={`/login/${allowedRole}`} state={{ from: location }} replace />;
  }

  // If role mismatches, render a professional 403 Forbidden screen
  if (user.role !== allowedRole) {
    return (
      <div className="container unauthorized-container">
        <div className="unauthorized-card card">
          <div className="unauthorized-icon-wrapper">
            <ShieldAlert size={48} className="unauthorized-icon" />
          </div>
          <h2 className="unauthorized-title">Access Denied (403 Forbidden)</h2>
          <p className="unauthorized-desc">
            Your authenticated role <strong>({user.role.toUpperCase()})</strong> does not have authorization to view the requested resource: <code className="unauthorized-path">{location.pathname}</code>.
          </p>
          <div className="unauthorized-notice alert-card alert-card-danger">
            <strong>Security Notice:</strong> All unauthorized access attempts to Gujarat State data endpoints are logged under DET protocols.
          </div>
          <div className="unauthorized-actions">
            <Link to={getDefaultDashboard(user.role)} className="btn btn-primary">
              <Home size={16} />
              <span>Go to My Dashboard</span>
            </Link>
            <Link to="/" className="btn btn-outline">
              <ArrowLeft size={16} />
              <span>Return to Public Portal</span>
            </Link>
          </div>
        </div>
        <style>{`
          .unauthorized-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: calc(100vh - 200px);
            padding: 40px 16px;
          }
          .unauthorized-card {
            max-width: 520px;
            width: 100%;
            text-align: center;
            border-top: 4px solid var(--status-red-text);
          }
          .unauthorized-icon-wrapper {
            background-color: var(--status-red-bg);
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            border: 1px solid var(--status-red-border);
          }
          .unauthorized-icon {
            color: var(--status-red-text);
          }
          .unauthorized-title {
            color: var(--status-red-text);
            margin-bottom: 12px;
          }
          .unauthorized-desc {
            font-size: 14px;
            color: var(--text-muted);
            margin-bottom: 16px;
            line-height: 1.5;
          }
          .unauthorized-path {
            background-color: var(--bg-cream);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
            color: var(--text-brown);
          }
          .unauthorized-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
            margin-top: 24px;
          }
          @media (max-width: 480px) {
            .unauthorized-actions {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
};

// Map role to their dashboard page
function getDefaultDashboard(role: string): string {
  switch (role) {
    case 'trainee': return '/trainee/dashboard';
    case 'employer': return '/employer/dashboard';
    case 'provider': return '/training-provider/dashboard';
    case 'government': return '/government/dashboard';
    default: return '/';
  }
}
