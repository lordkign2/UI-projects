import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaletteCard = ({ palette, isSelected, onSelect, onQuickAction }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const navigate = useNavigate();

  const getAccessibilityBadge = (score) => {
    if (score >= 90) return { label: 'AAA', color: 'bg-success', textColor: 'text-success-foreground' };
    if (score >= 70) return { label: 'AA', color: 'bg-warning', textColor: 'text-warning-foreground' };
    return { label: 'Needs Work', color: 'bg-error', textColor: 'text-error-foreground' };
  };

  const getHealthMeterColor = (score) => {
    if (score >= 90) return '#059669';
    if (score >= 70) return '#D97706';
    return '#DC2626';
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date?.toLocaleDateString();
  };

  const handleCardClick = (e) => {
    if (e?.target?.closest('.action-button') || e?.target?.closest('.checkbox-container')) {
      return;
    }
    navigate('/collaborative-palette-canvas', { state: { paletteId: palette?.id } });
  };

  const handleQuickAction = (action, e) => {
    e?.stopPropagation();
    onQuickAction(action, palette);
  };

  const badge = getAccessibilityBadge(palette?.accessibilityScore);

  return (
    <div
      className={`
        relative bg-card border border-border rounded-lg overflow-hidden cursor-pointer
        transition-all duration-200 hover:shadow-soft-lg hover:-translate-y-1
        ${isSelected ? 'ring-2 ring-primary shadow-soft-lg' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Selection Checkbox */}
      <div className="checkbox-container absolute top-3 left-3 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(palette?.id, e?.target?.checked)}
          className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
        />
      </div>
      {/* Favorite Button */}
      <button
        className="action-button absolute top-3 right-3 z-10 p-1.5 rounded-full bg-surface/80 backdrop-blur-sm hover:bg-surface transition-colors duration-200"
        onClick={(e) => handleQuickAction('favorite', e)}
      >
        <Icon 
          name={palette?.isFavorite ? 'Heart' : 'Heart'} 
          size={14} 
          color={palette?.isFavorite ? '#DC2626' : 'var(--color-text-secondary)'} 
        />
      </button>
      {/* Color Swatches */}
      <div className="h-24 flex">
        {palette?.colors?.map((color, index) => (
          <div
            key={index}
            className="flex-1 relative group"
            style={{ backgroundColor: color }}
          >
            {/* Color Value Tooltip */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20">
              <span className="text-xs font-mono text-white bg-black/60 px-2 py-1 rounded">
                {color}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Accessibility Health Meter */}
      <div className="px-3 py-2 bg-muted/50">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-text-secondary">Accessibility</span>
          <span className="text-xs font-medium text-text-primary">{palette?.accessibilityScore}%</span>
        </div>
        <div className="w-full bg-border rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: `${palette?.accessibilityScore}%`,
              backgroundColor: getHealthMeterColor(palette?.accessibilityScore)
            }}
          />
        </div>
      </div>
      {/* Card Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-text-primary truncate pr-2">{palette?.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge?.color} ${badge?.textColor}`}>
            {badge?.label}
          </span>
        </div>

        {/* Tags */}
        {palette?.tags && palette?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {palette?.tags?.slice(0, 3)?.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-muted text-text-secondary text-xs rounded">
                {tag}
              </span>
            ))}
            {palette?.tags?.length > 3 && (
              <span className="px-2 py-1 bg-muted text-text-secondary text-xs rounded">
                +{palette?.tags?.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
          <span>{formatDate(palette?.lastModified)}</span>
          <div className="flex items-center space-x-3">
            {palette?.collaborators > 0 && (
              <div className="flex items-center space-x-1">
                <Icon name="Users" size={12} />
                <span>{palette?.collaborators}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Icon name="Palette" size={12} />
              <span>{palette?.colors?.length}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`
          flex items-center justify-between transition-all duration-200
          ${isHovered || showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}>
          <div className="flex items-center space-x-1">
            <button
              className="action-button p-1.5 rounded hover:bg-muted transition-colors duration-200"
              onClick={(e) => handleQuickAction('duplicate', e)}
              title="Duplicate palette"
            >
              <Icon name="Copy" size={14} />
            </button>
            <button
              className="action-button p-1.5 rounded hover:bg-muted transition-colors duration-200"
              onClick={(e) => handleQuickAction('share', e)}
              title="Share palette"
            >
              <Icon name="Share2" size={14} />
            </button>
            <button
              className="action-button p-1.5 rounded hover:bg-muted transition-colors duration-200"
              onClick={(e) => handleQuickAction('export', e)}
              title="Export palette"
            >
              <Icon name="Download" size={14} />
            </button>
          </div>

          <button
            className="action-button p-1.5 rounded hover:bg-error hover:text-error-foreground transition-colors duration-200"
            onClick={(e) => handleQuickAction('delete', e)}
            title="Delete palette"
          >
            <Icon name="Trash2" size={14} />
          </button>
        </div>
      </div>
      {/* Mobile Actions Toggle */}
      <button
        className="lg:hidden absolute bottom-3 right-3 p-2 rounded-full bg-primary text-primary-foreground shadow-soft"
        onClick={(e) => {
          e?.stopPropagation();
          setShowActions(!showActions);
        }}
      >
        <Icon name="MoreHorizontal" size={16} />
      </button>
    </div>
  );
};

export default PaletteCard;