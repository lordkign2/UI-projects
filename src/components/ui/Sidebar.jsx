import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggle }) => {
  const [activeTools, setActiveTools] = useState([]);
  const [currentPalette, setCurrentPalette] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Contextual tools based on current screen
  const getContextualTools = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/collaborative-palette-canvas':
        return [
          { id: 'color-picker', label: 'Color Picker', icon: 'Pipette', active: true },
          { id: 'accessibility-check', label: 'Quick Check', icon: 'Shield', active: false },
          { id: 'export-preview', label: 'Export Preview', icon: 'Eye', active: false },
          { id: 'team-cursors', label: 'Team Cursors', icon: 'Users', active: true }
        ];
      case '/accessibility-validation-dashboard':
        return [
          { id: 'contrast-analyzer', label: 'Contrast Analyzer', icon: 'Contrast', active: true },
          { id: 'colorblind-sim', label: 'Colorblind Sim', icon: 'Eye', active: false },
          { id: 'wcag-validator', label: 'WCAG Validator', icon: 'CheckCircle', active: true },
          { id: 'compliance-report', label: 'Report Generator', icon: 'FileText', active: false }
        ];
      case '/export-integration-hub':
        return [
          { id: 'css-export', label: 'CSS Variables', icon: 'Code', active: true },
          { id: 'figma-plugin', label: 'Figma Plugin', icon: 'Figma', active: false },
          { id: 'style-guide', label: 'Style Guide', icon: 'Book', active: false },
          { id: 'api-docs', label: 'API Docs', icon: 'Terminal', active: false }
        ];
      case '/palette-library-organization':
        return [
          { id: 'search-filter', label: 'Search & Filter', icon: 'Search', active: true },
          { id: 'tag-manager', label: 'Tag Manager', icon: 'Tag', active: false },
          { id: 'bulk-actions', label: 'Bulk Actions', icon: 'Package', active: false },
          { id: 'import-export', label: 'Import/Export', icon: 'Upload', active: false }
        ];
      default:
        return [];
    }
  };

  const contextualTools = getContextualTools();

  const toggleTool = (toolId) => {
    setActiveTools(prev => 
      prev?.includes(toolId) 
        ? prev?.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  // Mock current palette data
  useEffect(() => {
    if (location.pathname === '/collaborative-palette-canvas') {
      setCurrentPalette({
        name: 'Brand Primary',
        colors: ['#2563EB', '#0EA5E9', '#059669', '#D97706', '#DC2626'],
        lastModified: '2 minutes ago',
        collaborators: 3
      });
    }
  }, [location.pathname]);

  const quickActions = [
    { id: 'new-palette', label: 'New Palette', icon: 'Plus', action: () => navigate('/collaborative-palette-canvas') },
    { id: 'duplicate', label: 'Duplicate', icon: 'Copy', action: () => {} },
    { id: 'share', label: 'Share', icon: 'Share2', action: () => {} },
    { id: 'export', label: 'Quick Export', icon: 'Download', action: () => navigate('/export-integration-hub') }
  ];

  if (contextualTools?.length === 0) {
    return null;
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`
        fixed right-0 top-16 bottom-0 z-40 bg-surface border-l border-border
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-80'}
        hidden lg:flex flex-col
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex flex-col">
              <h3 className="font-semibold text-text-primary">Contextual Tools</h3>
              <p className="text-xs text-text-secondary">Current workspace tools</p>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon name={isCollapsed ? 'ChevronLeft' : 'ChevronRight'} size={16} />
          </button>
        </div>

        {/* Current Palette Info */}
        {!isCollapsed && currentPalette && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-text-primary">{currentPalette?.name}</span>
              <span className="text-xs text-text-secondary">{currentPalette?.lastModified}</span>
            </div>
            <div className="flex space-x-1 mb-3">
              {currentPalette?.colors?.map((color, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded border border-border cursor-pointer hover:scale-105 transition-transform duration-150"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <div className="flex items-center text-xs text-text-secondary">
              <Icon name="Users" size={12} className="mr-1" />
              {currentPalette?.collaborators} collaborators
            </div>
          </div>
        )}

        {/* Contextual Tools */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {!isCollapsed && (
              <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-3">
                Active Tools
              </h4>
            )}
            {contextualTools?.map((tool) => (
              <button
                key={tool?.id}
                onClick={() => toggleTool(tool?.id)}
                className={`
                  w-full flex items-center space-x-3 p-3 rounded-lg text-sm font-medium
                  transition-all duration-200 min-h-touch
                  ${tool?.active || activeTools?.includes(tool?.id)
                    ? 'bg-accent text-accent-foreground shadow-soft'
                    : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? tool?.label : ''}
              >
                <Icon name={tool?.icon} size={18} />
                {!isCollapsed && <span>{tool?.label}</span>}
                {!isCollapsed && (tool?.active || activeTools?.includes(tool?.id)) && (
                  <div className="w-2 h-2 bg-success rounded-full ml-auto" />
                )}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          {!isCollapsed && (
            <div className="p-4 border-t border-border">
              <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-3">
                Quick Actions
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {quickActions?.map((action) => (
                  <Button
                    key={action?.id}
                    variant="outline"
                    size="sm"
                    iconName={action?.icon}
                    onClick={action?.action}
                    className="justify-start"
                  >
                    {action?.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Collaboration Status */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Sync Status</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span>Live</span>
              </div>
            </div>
          </div>
        )}
      </aside>
      {/* Mobile Bottom Sheet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border">
        <div className="flex items-center justify-around p-2">
          {contextualTools?.slice(0, 4)?.map((tool) => (
            <button
              key={tool?.id}
              onClick={() => toggleTool(tool?.id)}
              className={`
                flex flex-col items-center space-y-1 p-3 rounded-lg text-xs font-medium
                transition-all duration-200 min-w-touch min-h-touch
                ${tool?.active || activeTools?.includes(tool?.id)
                  ? 'bg-accent text-accent-foreground'
                  : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                }
              `}
            >
              <Icon name={tool?.icon} size={16} />
              <span className="truncate max-w-16">{tool?.label}</span>
              {(tool?.active || activeTools?.includes(tool?.id)) && (
                <div className="w-1 h-1 bg-success rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;