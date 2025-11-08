import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CreatePaletteModal = ({ isOpen, onClose }) => {
  const [paletteName, setPaletteName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  const templateOptions = [
    { value: '', label: 'Start from scratch' },
    { value: 'brand', label: 'Brand Template' },
    { value: 'ui', label: 'UI Components' },
    { value: 'accessibility', label: 'High Contrast' },
    { value: 'material', label: 'Material Design' },
    { value: 'monochrome', label: 'Monochrome' }
  ];

  const categoryOptions = [
    { value: 'brand', label: 'Brand Colors' },
    { value: 'ui', label: 'UI Components' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'accessibility', label: 'Accessibility' },
    { value: 'experimental', label: 'Experimental' }
  ];

  const quickStartColors = [
    { name: 'Blue Harmony', colors: ['#0EA5E9', '#2563EB', '#1E40AF', '#1E3A8A'] },
    { name: 'Green Nature', colors: ['#10B981', '#059669', '#047857', '#065F46'] },
    { name: 'Warm Sunset', colors: ['#F59E0B', '#D97706', '#B45309', '#92400E'] },
    { name: 'Purple Dreams', colors: ['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6'] }
  ];

  const handleCreate = () => {
    if (!paletteName?.trim()) return;
    
    // Navigate to canvas with new palette data
    navigate('/collaborative-palette-canvas', {
      state: {
        newPalette: {
          name: paletteName,
          template: selectedTemplate,
          category: selectedCategory
        }
      }
    });
    
    onClose();
    resetForm();
  };

  const handleQuickStart = (colors) => {
    navigate('/collaborative-palette-canvas', {
      state: {
        newPalette: {
          name: paletteName || 'Untitled Palette',
          colors: colors,
          category: selectedCategory
        }
      }
    });
    
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setPaletteName('');
    setSelectedTemplate('');
    setSelectedCategory('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-soft-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Create New Palette</h2>
            <p className="text-sm text-text-secondary mt-1">
              Start building your color palette with templates or from scratch
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Palette Name"
              type="text"
              placeholder="Enter palette name"
              value={paletteName}
              onChange={(e) => setPaletteName(e?.target?.value)}
              required
            />
            
            <Select
              label="Category"
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Select category"
            />
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Choose Template
            </label>
            <Select
              options={templateOptions}
              value={selectedTemplate}
              onChange={setSelectedTemplate}
              placeholder="Select a template"
            />
          </div>

          {/* Quick Start Options */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Quick Start Colors
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickStartColors?.map((option) => (
                <button
                  key={option?.name}
                  onClick={() => handleQuickStart(option?.colors)}
                  className="p-3 border border-border rounded-lg hover:border-primary transition-colors duration-200 text-left"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex -space-x-1">
                      {option?.colors?.map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full border-2 border-surface"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-text-primary">
                      {option?.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="Sparkles" size={16} className="text-accent" />
              <span className="text-sm font-medium text-text-primary">AI Color Suggestions</span>
            </div>
            <p className="text-sm text-text-secondary mb-3">
              Get AI-powered color palette suggestions based on your preferences
            </p>
            <Button
              variant="outline"
              size="sm"
              iconName="Wand2"
              iconPosition="left"
              disabled
            >
              Generate AI Palette (Coming Soon)
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              iconName="Upload"
              iconPosition="left"
              disabled
            >
              Import Colors
            </Button>
            
            <Button
              variant="default"
              onClick={handleCreate}
              disabled={!paletteName?.trim()}
              iconName="Plus"
              iconPosition="left"
            >
              Create Palette
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePaletteModal;