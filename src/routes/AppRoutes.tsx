import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { GovernmentHeader } from '../components/common/GovernmentHeader';
import { GovernmentFooter } from '../components/common/GovernmentFooter';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import AboutPage from '../pages/public/AboutPage';
import ProgrammesPage from '../pages/public/ProgrammesPage';
import TrackOutcomePage from '../pages/public/TrackOutcomePage';
import ContactPage from '../pages/public/ContactPage';

// Auth Pages
import RoleSelectionPage from '../pages/auth/RoleSelectionPage';
import RoleLoginPage from '../pages/auth/RoleLoginPage';

// Trainee Pages
import TraineeDashboard from '../pages/trainee/TraineeDashboard';
import TraineeCheckInPage from '../pages/trainee/TraineeCheckInPage';
import TraineeOutcomesPage from '../pages/trainee/TraineeOutcomesPage';
import TraineeCertificatePage from '../pages/trainee/TraineeCertificatePage';

// Employer Pages
import EmployerDashboard from '../pages/employer/EmployerDashboard';
import EmployerVerificationsPage from '../pages/employer/EmployerVerificationsPage';
import EmployerFeedbackPage from '../pages/employer/EmployerFeedbackPage';

// Training Provider Pages
import ProviderDashboard from '../pages/provider/ProviderDashboard';
import ProviderProgrammesPage from '../pages/provider/ProviderProgrammesPage';
import ProviderOutcomesPage from '../pages/provider/ProviderOutcomesPage';

// Government Pages
import GovernmentDashboard from '../pages/government/GovernmentDashboard';
import GovernmentAnalyticsPage from '../pages/government/GovernmentAnalyticsPage';
import GovernmentProgrammesPage from '../pages/government/GovernmentProgrammesPage';
import GovernmentSkillGapsPage from '../pages/government/GovernmentSkillGapsPage';
import GovernmentAlertsPage from '../pages/government/GovernmentAlertsPage';

// App Layout Wrapper
const AppLayout: React.FC = () => {
  return (
    <div className="app-layout">
      <GovernmentHeader />
      <main className="main-content">
        <Outlet />
      </main>
      <GovernmentFooter />
      <style>{`
        .app-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-primary);
        }
      `}</style>
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Public Routes */}
        <Route index element={<LandingPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="programmes" element={<ProgrammesPage />} />
        <Route path="track-outcome" element={<TrackOutcomePage />} />
        <Route path="contact" element={<ContactPage />} />

        {/* Auth Routes */}
        <Route path="login" element={<RoleSelectionPage />} />
        <Route path="login/:role" element={<RoleLoginPage />} />

        {/* Trainee Protected Routes */}
        <Route
          path="trainee/dashboard"
          element={
            <ProtectedRoute allowedRole="trainee">
              <TraineeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="trainee/check-in"
          element={
            <ProtectedRoute allowedRole="trainee">
              <TraineeCheckInPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="trainee/outcomes"
          element={
            <ProtectedRoute allowedRole="trainee">
              <TraineeOutcomesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="trainee/certificate"
          element={
            <ProtectedRoute allowedRole="trainee">
              <TraineeCertificatePage />
            </ProtectedRoute>
          }
        />

        {/* Employer Protected Routes */}
        <Route
          path="employer/dashboard"
          element={
            <ProtectedRoute allowedRole="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="employer/verifications"
          element={
            <ProtectedRoute allowedRole="employer">
              <EmployerVerificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="employer/feedback"
          element={
            <ProtectedRoute allowedRole="employer">
              <EmployerFeedbackPage />
            </ProtectedRoute>
          }
        />

        {/* Training Provider Protected Routes */}
        <Route
          path="training-provider/dashboard"
          element={
            <ProtectedRoute allowedRole="provider">
              <ProviderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="training-provider/programmes"
          element={
            <ProtectedRoute allowedRole="provider">
              <ProviderProgrammesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="training-provider/outcomes"
          element={
            <ProtectedRoute allowedRole="provider">
              <ProviderOutcomesPage />
            </ProtectedRoute>
          }
        />

        {/* Government Protected Routes */}
        <Route
          path="government/dashboard"
          element={
            <ProtectedRoute allowedRole="government">
              <GovernmentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="government/analytics"
          element={
            <ProtectedRoute allowedRole="government">
              <GovernmentAnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="government/programmes"
          element={
            <ProtectedRoute allowedRole="government">
              <GovernmentProgrammesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="government/skill-gaps"
          element={
            <ProtectedRoute allowedRole="government">
              <GovernmentSkillGapsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="government/alerts"
          element={
            <ProtectedRoute allowedRole="government">
              <GovernmentAlertsPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<LandingPage />} />
      </Route>
    </Routes>
  );
};
export default AppRoutes;
