import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import TeamPresence from '../../components/ui/TeamPresence';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import components
import PaletteAnalysisPanel from './components/PaletteAnalysisPanel';
import ComplianceReportPanel from './components/ComplianceReportPanel';
import ColorblindSimulatorPanel from './components/ColorblindSimulatorPanel';
import AccessibilityMetricsChart from './components/AccessibilityMetricsChart';

const AccessibilityValidationDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('contrast');
  const [simulationData, setSimulationData] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  // Custom breadcrumbs for this page
  const breadcrumbs = [
    { label: 'Workspace', path: '/', icon: 'Home' },
    { label: 'Canvas', path: '/collaborative-palette-canvas', icon: 'Palette' },
    { label: 'Accessibility Analysis', path: '/accessibility-validation-dashboard', icon: 'Shield' }
  ];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Arrow key navigation for palette grid
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || 
          event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        // Implement palette grid navigation logic here
      }
      
      // Spacebar for color selection
      if (event.key === ' ' && selectedColor) {
        event.preventDefault();
        // Handle color selection
      }

      // Escape to clear selection
      if (event.key === 'Escape') {
        setSelectedColor(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedColor]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleFixSuggestion = (fixData) => {
    setIsAnalyzing(true);
    // Simulate applying fix
    setTimeout(() => {
      setIsAnalyzing(false);
      // Show success notification or update palette
    }, 1500);
  };

  const handleSimulationChange = (deficiency, simulatedColors) => {
    setSimulationData({ deficiency, simulatedColors });
  };

  const handleMetricChange = (metric) => {
    setSelectedMetric(metric);
  };

  const handleExportReport = () => {
    // Implement PDF export functionality
    console.log('Exporting accessibility report...');
  };

  const handleRunFullScan = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex pt-16">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'mr-16' : 'mr-80'} lg:mr-0`}>
          <div className="p-6 pb-24 lg:pb-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <Breadcrumbs customBreadcrumbs={breadcrumbs} />
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-text-primary">Accessibility Validation</h1>
                    <p className="text-text-secondary mt-1">
                      Comprehensive WCAG compliance analysis and remediation guidance
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <TeamPresence />
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="FileText"
                        iconPosition="left"
                        onClick={handleExportReport}
                      >
                        Export Report
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        iconName="Play"
                        iconPosition="left"
                        loading={isAnalyzing}
                        onClick={handleRunFullScan}
                      >
                        {isAnalyzing ? 'Analyzing...' : 'Run Full Scan'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Status Bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-card border border-border rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isAnalyzing ? 'bg-warning animate-pulse' : 'bg-success'}`} />
                    <span className="text-sm font-medium text-text-primary">
                      {isAnalyzing ? 'Analysis in progress...' : 'Analysis complete'}
                    </span>
                  </div>
                  <div className="text-sm text-text-secondary">
                    Last scan: {new Date()?.toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Icon name="AlertTriangle" size={14} className="text-error" />
                    <span className="text-text-secondary">8 issues found</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="CheckCircle" size={14} className="text-success" />
                    <span className="text-text-secondary">12 checks passed</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left Panel - Palette Analysis */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="xl:col-span-4"
              >
                <PaletteAnalysisPanel
                  onColorSelect={handleColorSelect}
                />
              </motion.div>

              {/* Center Panel - Compliance Report */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="xl:col-span-4"
              >
                <ComplianceReportPanel
                  selectedColor={selectedColor}
                  onFixSuggestion={handleFixSuggestion}
                />
              </motion.div>

              {/* Right Panel - Colorblind Simulator */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="xl:col-span-4"
              >
                <ColorblindSimulatorPanel
                  onSimulationChange={handleSimulationChange}
                />
              </motion.div>
            </div>

            {/* Metrics Chart Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6"
            >
              <AccessibilityMetricsChart
                selectedMetric={selectedMetric}
                onMetricChange={handleMetricChange}
              />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <Button
                variant="outline"
                fullWidth
                iconName="Palette"
                iconPosition="left"
                onClick={() => navigate('/collaborative-palette-canvas')}
              >
                Back to Canvas
              </Button>
              <Button
                variant="outline"
                fullWidth
                iconName="Download"
                iconPosition="left"
                onClick={() => navigate('/export-integration-hub')}
              >
                Export Palette
              </Button>
              <Button
                variant="outline"
                fullWidth
                iconName="FolderOpen"
                iconPosition="left"
                onClick={() => navigate('/palette-library-organization')}
              >
                Save to Library
              </Button>
              <Button
                variant="outline"
                fullWidth
                iconName="Users"
                iconPosition="left"
                onClick={() => navigate('/team-workspace-management')}
              >
                Team Settings
              </Button>
            </motion.div>

            {/* Mobile Responsive Message */}
            <div className="lg:hidden mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="Smartphone" size={20} className="text-warning mt-0.5" />
                <div>
                  <h4 className="font-medium text-text-primary">Mobile View</h4>
                  <p className="text-sm text-text-secondary mt-1">
                    For the best accessibility analysis experience, we recommend using a desktop or tablet device. 
                    Some advanced features may be limited on mobile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Screen Reader Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isAnalyzing && "Accessibility analysis in progress"}
        {selectedColor && `Selected color: ${selectedColor?.name} ${selectedColor?.hex}`}
        {simulationData?.deficiency && `Viewing ${simulationData?.deficiency} simulation`}
      </div>
      {/* Focus Management */}
      <div className="sr-only" tabIndex={-1} id="main-content">
        Accessibility Validation Dashboard - Use arrow keys to navigate palette grid, spacebar to select colors, escape to clear selection
      </div>
    </div>
  );
};

export default AccessibilityValidationDashboard;