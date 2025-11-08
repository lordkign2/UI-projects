import React from 'react';
import Icon from '../../../components/AppIcon';

const ViewToggle = ({ currentView, onViewChange }) => {
  const viewOptions = [
    { id: 'grid', icon: 'Grid3X3', label: 'Grid View' },
    { id: 'list', icon: 'List', label: 'List View' },
    { id: 'compact', icon: 'LayoutGrid', label: 'Compact View' }
  ];

  return (
    <div className="flex items-center bg-muted rounded-lg p-1">
      {viewOptions?.map((option) => (
        <button
          key={option?.id}
          onClick={() => onViewChange(option?.id)}
          className={`
            flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
            ${currentView === option?.id
              ? 'bg-surface text-text-primary shadow-soft'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
            }
          `}
          title={option?.label}
        >
          <Icon name={option?.icon} size={16} />
          <span className="hidden sm:inline">{option?.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewToggle;