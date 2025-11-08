import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsBar = ({ 
  selectedCount, 
  onRoleChange, 
  onRemove, 
  onClearSelection,
  isVisible 
}) => {
  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' }
  ];

  if (!isVisible || selectedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-scale-in">
      <div className="bg-card border border-border rounded-lg shadow-soft-lg p-4 min-w-96">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} className="text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">
                {selectedCount} member{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="h-4 w-px bg-border" />

            <div className="flex items-center space-x-2">
              <Select
                options={roleOptions}
                placeholder="Change role..."
                onChange={(role) => onRoleChange(role)}
                className="w-32"
              />
              
              <Button
                size="sm"
                variant="outline"
                onClick={onRemove}
                iconName="Trash2"
                className="text-error hover:text-error hover:bg-error/10"
              >
                Remove
              </Button>
            </div>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={onClearSelection}
            iconName="X"
            className="text-text-secondary hover:text-text-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;