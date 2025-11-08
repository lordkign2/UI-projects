import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import PaletteLibraryOrganization from './pages/palette-library-organization';
import AuthenticationPage from './pages/authentication-login-register';
import ExportIntegrationHub from './pages/export-integration-hub';
import AccessibilityValidationDashboard from './pages/accessibility-validation-dashboard';
import CollaborativePaletteCanvas from './pages/collaborative-palette-canvas';
import TeamWorkspaceManagement from './pages/team-workspace-management';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AccessibilityValidationDashboard />} />
        <Route path="/palette-library-organization" element={<PaletteLibraryOrganization />} />
        <Route path="/authentication-login-register" element={<AuthenticationPage />} />
        <Route path="/export-integration-hub" element={<ExportIntegrationHub />} />
        <Route path="/accessibility-validation-dashboard" element={<AccessibilityValidationDashboard />} />
        <Route path="/collaborative-palette-canvas" element={<CollaborativePaletteCanvas />} />
        <Route path="/team-workspace-management" element={<TeamWorkspaceManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
