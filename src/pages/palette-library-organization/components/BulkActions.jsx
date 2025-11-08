import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActions = ({ selectedPalettes, onBulkAction, onClearSelection }) => {
  const [showActions, setShowActions] = useState(false);
  const [bulkCategory, setBulkCategory] = useState('');

  const categoryOptions = [
    { value: 'brand', label: 'Brand Colors' },
    { value: 'ui', label: 'UI Components' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'accessibility', label: 'Accessibility' },
    { value: 'experimental', label: 'Experimental' },
    { value: 'archived', label: 'Archived' }
  ];

  const handleBulkAction = (action) => {
    onBulkAction(action, selectedPalettes, { category: bulkCategory });
    setShowActions(false);
  };

  const handleCategoryChange = (value) => {
    setBulkCategory(value);
    if (value) {
      handleBulkAction('categorize');
    }
  };

  if (selectedPalettes?.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-surface border border-border rounded-lg shadow-soft-lg p-4 min-w-80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">
                {selectedPalettes?.length}
              </span>
            </div>
            <span className="text-sm font-medium text-text-primary">
              {selectedPalettes?.length} palette{selectedPalettes?.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          <button
            onClick={onClearSelection}
            className="p-1 rounded hover:bg-muted transition-colors duration-200"
            title="Clear selection"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            iconName="Copy"
            iconPosition="left"
            onClick={() => handleBulkAction('duplicate')}
          >
            Duplicate
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Share2"
            iconPosition="left"
            onClick={() => handleBulkAction('share')}
          >
            Share
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={() => handleBulkAction('export')}
          >
            Export
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="MoreHorizontal"
            onClick={() => setShowActions(!showActions)}
          >
            More
          </Button>
        </div>

        {/* Extended Actions */}
        {showActions && (
          <div className="border-t border-border pt-4 space-y-3">
            {/* Category Assignment */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Assign Category
              </label>
              <Select
                options={categoryOptions}
                value={bulkCategory}
                onChange={handleCategoryChange}
                placeholder="Select category"
              />
            </div>

            {/* Additional Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Heart"
                iconPosition="left"
                onClick={() => handleBulkAction('favorite')}
              >
                Add to Favorites
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                iconName="Archive"
                iconPosition="left"
                onClick={() => handleBulkAction('archive')}
              >
                Archive
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                iconName="Trash2"
                iconPosition="left"
                onClick={() => handleBulkAction('delete')}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkActions;