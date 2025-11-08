import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import TeamPresence from '../../components/ui/TeamPresence';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import page components
import PalettePreview from './components/PalettePreview';
import ExportFormatTabs from './components/ExportFormatTabs';
import StyleGuideGenerator from './components/StyleGuideGenerator';
import QualityAssurance from './components/QualityAssurance';
import ExportHistory from './components/ExportHistory';

const ExportIntegrationHub = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('export');
  const [currentPreview, setCurrentPreview] = useState('');
  const [validationResults, setValidationResults] = useState(null);

  // Mock palette data
  const [currentPalette] = useState({
    id: 'palette-001',
    name: 'Brand Primary Palette',
    description: 'Core brand colors for digital products',
    lastModified: '2 hours ago',
    wcagLevel: 'AA',
    accessibilityScore: 87,
    version: 'v2.1',
    colors: [
      {
        id: 'color-1',
        name: 'Primary Blue',
        value: '#2563EB',
        locked: true,
        usage: 'Primary actions, links'
      },
      {
        id: 'color-2',
        name: 'Sky Blue',
        value: '#0EA5E9',
        locked: false,
        usage: 'Secondary actions, highlights'
      },
      {
        id: 'color-3',
        name: 'Emerald Green',
        value: '#059669',
        locked: true,
        usage: 'Success states, confirmations'
      },
      {
        id: 'color-4',
        name: 'Amber Orange',
        value: '#D97706',
        locked: false,
        usage: 'Warnings, attention'
      },
      {
        id: 'color-5',
        name: 'Red',
        value: '#DC2626',
        locked: false,
        usage: 'Errors, destructive actions'
      }
    ]
  });

  const views = [
    { id: 'export', label: 'Export Formats', icon: 'Download' },
    { id: 'styleguide', label: 'Style Guide', icon: 'BookOpen' },
    { id: 'quality', label: 'Quality Check', icon: 'Shield' },
    { id: 'history', label: 'Export History', icon: 'Clock' }
  ];

  const handleColorLock = (colorId) => {
    console.log('Locking color:', colorId);
  };

  const handleColorUnlock = (colorId) => {
    console.log('Unlocking color:', colorId);
  };

  const handleExport = (exportData) => {
    console.log('Exporting:', exportData);
    
    // Create and download file
    const blob = new Blob([exportData.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportData?.filename;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerateStyleGuide = async (config) => {
    console.log('Generating style guide with config:', config);
    // Simulate style guide generation
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleExportPDF = async (config) => {
    console.log('Exporting PDF with config:', config);
    // Simulate PDF export
    await new Promise(resolve => setTimeout(resolve, 3000));
  };

  const handleValidationComplete = (results) => {
    setValidationResults(results);
  };

  const handleReExport = (exportItem) => {
    console.log('Re-exporting:', exportItem);
  };

  const handleDeleteExport = (exportId) => {
    console.log('Deleting export:', exportId);
  };

  const customBreadcrumbs = [
    { label: 'Workspace', path: '/collaborative-palette-canvas', icon: 'Home' },
    { label: 'Export Hub', path: '/export-integration-hub', icon: 'Download' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'pr-16' : 'pr-80'} lg:pr-80`}>
        <div className="p-6 pb-20 lg:pb-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <Breadcrumbs customBreadcrumbs={customBreadcrumbs} />
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-text-primary">Export & Integration Hub</h1>
                  <p className="text-text-secondary mt-2">
                    Convert your validated color palettes into developer-ready formats and design system assets
                  </p>
                </div>
                <div className="hidden lg:flex items-center space-x-4">
                  <TeamPresence />
                  <Button
                    variant="outline"
                    iconName="ArrowLeft"
                    onClick={() => navigate('/collaborative-palette-canvas')}
                  >
                    Back to Canvas
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* View Navigation */}
          <div className="flex items-center space-x-1 mb-6 overflow-x-auto">
            {views?.map((view) => (
              <button
                key={view?.id}
                onClick={() => setActiveView(view?.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeView === view?.id
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                }`}
              >
                <Icon name={view?.icon} size={16} />
                <span>{view?.label}</span>
              </button>
            ))}
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Panel - Palette Preview */}
            <div className="xl:col-span-3">
              <PalettePreview
                palette={currentPalette}
                onColorLock={handleColorLock}
                onColorUnlock={handleColorUnlock}
              />
            </div>

            {/* Center Panel - Main Content */}
            <div className="xl:col-span-6">
              {activeView === 'export' && (
                <ExportFormatTabs
                  palette={currentPalette}
                  onExport={handleExport}
                  onPreviewChange={setCurrentPreview}
                />
              )}

              {activeView === 'styleguide' && (
                <StyleGuideGenerator
                  palette={currentPalette}
                  onGenerateStyleGuide={handleGenerateStyleGuide}
                  onExportPDF={handleExportPDF}
                />
              )}

              {activeView === 'quality' && (
                <QualityAssurance
                  palette={currentPalette}
                  onValidationComplete={handleValidationComplete}
                />
              )}

              {activeView === 'history' && (
                <ExportHistory
                  onReExport={handleReExport}
                  onDeleteExport={handleDeleteExport}
                />
              )}
            </div>

            {/* Right Panel - Additional Info */}
            <div className="xl:col-span-3">
              {activeView === 'export' && (
                <div className="space-y-6">
                  {/* Integration APIs */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Integration APIs</h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Figma Plugin', icon: 'Figma', status: 'connected' },
                        { name: 'Adobe XD', icon: 'Layers', status: 'available' },
                        { name: 'Sketch', icon: 'Square', status: 'available' },
                        { name: 'VS Code Extension', icon: 'Code', status: 'connected' }
                      ]?.map((integration) => (
                        <div key={integration?.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Icon name={integration?.icon} size={16} className="text-text-secondary" />
                            <span className="text-sm font-medium text-text-primary">{integration?.name}</span>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            integration?.status === 'connected' ?'bg-success/10 text-success' :'bg-muted text-text-secondary'
                          }`}>
                            {integration?.status}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4" iconName="Plus">
                      Add Integration
                    </Button>
                  </div>

                  {/* Version Control */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Version Control</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Current Version</span>
                        <span className="font-medium text-text-primary">{currentPalette?.version}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Last Export</span>
                        <span className="font-medium text-text-primary">2 hours ago</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Total Exports</span>
                        <span className="font-medium text-text-primary">27</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" iconName="GitBranch" className="flex-1">
                        Branch
                      </Button>
                      <Button variant="outline" size="sm" iconName="Tag" className="flex-1">
                        Tag
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeView === 'quality' && validationResults && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Validation Summary</h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold mb-2 ${
                        validationResults?.overall?.score >= 90 
                          ? 'text-success' 
                          : validationResults?.overall?.score >= 70 
                          ? 'text-warning' :'text-error'
                      }`}>
                        {validationResults?.overall?.score}%
                      </div>
                      <p className="text-sm text-text-secondary">Overall Quality Score</p>
                    </div>
                    
                    <div className="space-y-2">
                      {validationResults?.categories?.map((category) => (
                        <div key={category?.id} className="flex items-center justify-between text-sm">
                          <span className="text-text-secondary">{category?.name}</span>
                          <span className={`font-medium ${
                            category?.status === 'success' ? 'text-success' :
                            category?.status === 'warning' ? 'text-warning' : 'text-error'
                          }`}>
                            {category?.score}%
                          </span>
                        </div>
                      ))}
                    </div>

                    {validationResults?.overall?.blockers > 0 && (
                      <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
                        <div className="flex items-center space-x-2 text-error">
                          <Icon name="AlertCircle" size={16} />
                          <span className="text-sm font-medium">
                            {validationResults?.overall?.blockers} blocking issues
                          </span>
                        </div>
                        <p className="text-xs text-error/80 mt-1">
                          Resolve these issues before exporting
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExportIntegrationHub;