import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CanvasToolbar = ({ 
  onUndo, 
  onRedo, 
  onExport, 
  onSave, 
  onVersionHistory,
  canUndo = true,
  canRedo = false,
  hasUnsavedChanges = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeView, setActiveView] = useState('grid'); // grid, list, compact

  const viewModes = [
    { id: 'grid', icon: 'Grid3X3', label: 'Grid View' },
    { id: 'list', icon: 'List', label: 'List View' },
    { id: 'compact', icon: 'MoreHorizontal', label: 'Compact View' }
  ];

  const quickActions = [
    { 
      id: 'undo', 
      icon: 'Undo2', 
      label: 'Undo', 
      action: onUndo, 
      disabled: !canUndo,
      shortcut: 'Ctrl+Z'
    },
    { 
      id: 'redo', 
      icon: 'Redo2', 
      label: 'Redo', 
      action: onRedo, 
      disabled: !canRedo,
      shortcut: 'Ctrl+Y'
    },
    { 
      id: 'save', 
      icon: 'Save', 
      label: 'Save', 
      action: onSave, 
      disabled: !hasUnsavedChanges,
      shortcut: 'Ctrl+S'
    },
    { 
      id: 'export', 
      icon: 'Download', 
      label: 'Export', 
      action: onExport, 
      disabled: false,
      shortcut: 'Ctrl+E'
    }
  ];

  const advancedActions = [
    { id: 'history', icon: 'History', label: 'Version History', action: onVersionHistory },
    { id: 'duplicate', icon: 'Copy', label: 'Duplicate Palette', action: () => {} },
    { id: 'share', icon: 'Share2', label: 'Share Palette', action: () => {} },
    { id: 'settings', icon: 'Settings', label: 'Canvas Settings', action: () => {} }
  ];

  return (
    <>
      {/* Desktop Toolbar */}
      <div className="hidden lg:flex items-center justify-between bg-surface border border-border rounded-lg p-3 shadow-soft">
        {/* Left Section - Quick Actions */}
        <div className="flex items-center space-x-2">
          {quickActions?.map((action) => (
            <Button
              key={action?.id}
              variant={action?.id === 'save' && hasUnsavedChanges ? 'default' : 'ghost'}
              size="sm"
              iconName={action?.icon}
              onClick={action?.action}
              disabled={action?.disabled}
              title={`${action?.label} (${action?.shortcut})`}
              className="relative"
            >
              {action?.label}
              {action?.id === 'save' && hasUnsavedChanges && (
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-warning rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </Button>
          ))}
        </div>

        {/* Center Section - View Modes */}
        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          {viewModes?.map((mode) => (
            <button
              key={mode?.id}
              onClick={() => setActiveView(mode?.id)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium
                transition-all duration-200
                ${activeView === mode?.id
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                }
              `}
              title={mode?.label}
            >
              <Icon name={mode?.icon} size={16} />
              <span className="hidden xl:inline">{mode?.label}</span>
            </button>
          ))}
        </div>

        {/* Right Section - Advanced Actions */}
        <div className="flex items-center space-x-2">
          {advancedActions?.slice(0, 2)?.map((action) => (
            <Button
              key={action?.id}
              variant="ghost"
              size="sm"
              iconName={action?.icon}
              onClick={action?.action}
              title={action?.label}
            >
              <span className="hidden xl:inline">{action?.label}</span>
            </Button>
          ))}
          
          {/* More Actions Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              iconName="MoreVertical"
              onClick={() => setIsExpanded(!isExpanded)}
              title="More actions"
            />
            
            {isExpanded && (
              <motion.div
                className="absolute top-full right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-soft-lg z-50"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
              >
                <div className="p-2">
                  {advancedActions?.slice(2)?.map((action) => (
                    <button
                      key={action?.id}
                      onClick={() => {
                        action?.action();
                        setIsExpanded(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-muted rounded-md transition-colors duration-200"
                    >
                      <Icon name={action?.icon} size={16} />
                      <span>{action?.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Toolbar */}
      <div className="lg:hidden fixed bottom-20 left-4 right-4 z-40">
        <div className="bg-surface border border-border rounded-lg shadow-soft-lg">
          {/* Primary Actions Row */}
          <div className="flex items-center justify-around p-3">
            {quickActions?.map((action) => (
              <button
                key={action?.id}
                onClick={action?.action}
                disabled={action?.disabled}
                className={`
                  flex flex-col items-center space-y-1 p-2 rounded-lg text-xs font-medium
                  transition-all duration-200 min-w-touch min-h-touch
                  ${action?.disabled 
                    ? 'text-text-secondary/50 cursor-not-allowed' :'text-text-secondary hover:text-text-primary hover:bg-muted active:bg-accent active:text-accent-foreground'
                  }
                  ${action?.id === 'save' && hasUnsavedChanges ? 'text-primary' : ''}
                `}
                title={action?.label}
              >
                <div className="relative">
                  <Icon name={action?.icon} size={18} />
                  {action?.id === 'save' && hasUnsavedChanges && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-warning rounded-full" />
                  )}
                </div>
                <span className="truncate max-w-12">{action?.label}</span>
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="border-t border-border p-2">
            <div className="flex items-center justify-center space-x-1">
              {viewModes?.map((mode) => (
                <button
                  key={mode?.id}
                  onClick={() => setActiveView(mode?.id)}
                  className={`
                    p-2 rounded-md transition-colors duration-200
                    ${activeView === mode?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                    }
                  `}
                  title={mode?.label}
                >
                  <Icon name={mode?.icon} size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Floating Action Button for Mobile */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Button
          variant="default"
          size="icon"
          iconName="Plus"
          onClick={() => {}}
          className="w-14 h-14 rounded-full shadow-soft-lg"
          title="Add new color"
        />
      </div>
    </>
  );
};

export default CanvasToolbar;