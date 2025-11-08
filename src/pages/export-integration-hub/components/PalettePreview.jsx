import React from 'react';
import Icon from '../../../components/AppIcon';

const PalettePreview = ({ palette, onColorLock, onColorUnlock }) => {
  const handleColorToggle = (colorId) => {
    const color = palette?.colors?.find(c => c?.id === colorId);
    if (color?.locked) {
      onColorUnlock(colorId);
    } else {
      onColorLock(colorId);
    }
  };

  const getContrastRatio = (color) => {
    // Mock contrast calculation - in production would use actual algorithm
    const ratios = { '#2563EB': 4.5, '#0EA5E9': 3.8, '#059669': 4.2, '#D97706': 3.9, '#DC2626': 4.1 };
    return ratios?.[color] || 4.0;
  };

  const getAccessibilityStatus = (ratio) => {
    if (ratio >= 4.5) return { status: 'AA', color: 'text-success', bg: 'bg-success/10' };
    if (ratio >= 3.0) return { status: 'AA Large', color: 'text-warning', bg: 'bg-warning/10' };
    return { status: 'Fail', color: 'text-error', bg: 'bg-error/10' };
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{palette?.name}</h3>
          <p className="text-sm text-text-secondary mt-1">
            {palette?.colors?.length} colors • Last modified {palette?.lastModified}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-xs text-text-secondary">
            <Icon name="Shield" size={14} />
            <span>WCAG {palette?.wcagLevel}</span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            palette?.accessibilityScore >= 90 
              ? 'bg-success/10 text-success' 
              : palette?.accessibilityScore >= 70 
              ? 'bg-warning/10 text-warning' :'bg-error/10 text-error'
          }`}>
            {palette?.accessibilityScore}% compliant
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {palette?.colors?.map((color) => {
          const contrastRatio = getContrastRatio(color?.value);
          const accessibilityStatus = getAccessibilityStatus(contrastRatio);
          
          return (
            <div key={color?.id} className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-lg border border-border shadow-soft"
                  style={{ backgroundColor: color?.value }}
                />
                <button
                  onClick={() => handleColorToggle(color?.id)}
                  className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-surface flex items-center justify-center transition-all duration-200 ${
                    color?.locked 
                      ? 'bg-warning text-warning-foreground hover:bg-warning/80' 
                      : 'bg-muted text-text-secondary hover:bg-accent hover:text-accent-foreground'
                  }`}
                  title={color?.locked ? 'Unlock color' : 'Lock color'}
                >
                  <Icon name={color?.locked ? 'Lock' : 'Unlock'} size={10} />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text-primary">{color?.name}</p>
                    <p className="text-sm text-text-secondary font-mono">{color?.value}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${accessibilityStatus?.bg} ${accessibilityStatus?.color}`}>
                      {accessibilityStatus?.status}
                    </div>
                    <span className="text-xs text-text-secondary">
                      {contrastRatio?.toFixed(1)}:1
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Export readiness</span>
          <div className="flex items-center space-x-2">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  palette?.accessibilityScore >= 90 
                    ? 'bg-success' 
                    : palette?.accessibilityScore >= 70 
                    ? 'bg-warning' :'bg-error'
                }`}
                style={{ width: `${palette?.accessibilityScore}%` }}
              />
            </div>
            <span className="font-medium text-text-primary">{palette?.accessibilityScore}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PalettePreview;