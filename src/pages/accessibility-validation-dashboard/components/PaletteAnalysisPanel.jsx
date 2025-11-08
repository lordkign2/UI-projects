import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const PaletteAnalysisPanel = ({ currentPalette, onColorSelect }) => {
  const [contrastScores, setContrastScores] = useState({});
  const [animatingScores, setAnimatingScores] = useState(new Set());

  // Mock current palette data
  const mockPalette = currentPalette || {
    id: 'brand-primary',
    name: 'Brand Primary Palette',
    colors: [
      { id: 'primary', hex: '#2563EB', name: 'Primary Blue', role: 'primary' },
      { id: 'secondary', hex: '#0EA5E9', name: 'Sky Blue', role: 'secondary' },
      { id: 'success', hex: '#059669', name: 'Success Green', role: 'success' },
      { id: 'warning', hex: '#D97706', name: 'Warning Orange', role: 'warning' },
      { id: 'error', hex: '#DC2626', name: 'Error Red', role: 'error' },
      { id: 'neutral', hex: '#64748B', name: 'Neutral Gray', role: 'neutral' }
    ],
    background: '#FFFFFF',
    lastModified: new Date(Date.now() - 120000) // 2 minutes ago
  };

  // Calculate contrast ratios
  const calculateContrast = (color1, color2) => {
    // Simplified contrast calculation - in production, use proper color science
    const getLuminance = (hex) => {
      const rgb = parseInt(hex?.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  };

  // Generate contrast scores for all color combinations
  useEffect(() => {
    const scores = {};
    mockPalette?.colors?.forEach(color => {
      const bgContrast = calculateContrast(color?.hex, mockPalette?.background);
      scores[color.id] = {
        background: bgContrast,
        level: bgContrast >= 7 ? 'AAA' : bgContrast >= 4.5 ? 'AA' : 'FAIL',
        score: Math.round(bgContrast * 10) / 10
      };
    });
    setContrastScores(scores);

    // Animate score updates
    const animateIds = new Set(mockPalette.colors.map(c => c.id));
    setAnimatingScores(animateIds);
    setTimeout(() => setAnimatingScores(new Set()), 1000);
  }, [mockPalette]);

  const getScoreColor = (level) => {
    switch (level) {
      case 'AAA': return 'text-success';
      case 'AA': return 'text-warning';
      case 'FAIL': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const getHealthMeterWidth = (score) => {
    return Math.min((score / 7) * 100, 100);
  };

  const getHealthMeterColor = (level) => {
    switch (level) {
      case 'AAA': return 'bg-success';
      case 'AA': return 'bg-warning';
      case 'FAIL': return 'bg-error';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{mockPalette?.name}</h3>
          <p className="text-sm text-text-secondary">
            Last modified {Math.floor((Date.now() - mockPalette?.lastModified?.getTime()) / 60000)} minutes ago
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Palette" size={16} className="text-text-secondary" />
          <span className="text-sm text-text-secondary">{mockPalette?.colors?.length} colors</span>
        </div>
      </div>
      {/* Color Grid with Contrast Analysis */}
      <div className="space-y-4">
        {mockPalette?.colors?.map((color, index) => {
          const contrast = contrastScores?.[color?.id];
          const isAnimating = animatingScores?.has(color?.id);

          return (
            <motion.div
              key={color?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => onColorSelect && onColorSelect(color)}
            >
              <div className="flex items-center space-x-4 p-4 rounded-lg border border-border hover:border-accent transition-colors duration-200">
                {/* Color Swatch */}
                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-lg border border-border shadow-soft"
                    style={{ backgroundColor: color?.hex }}
                  />
                  <div className="absolute -top-1 -right-1">
                    {contrast?.level === 'AAA' && (
                      <div className="w-4 h-4 bg-success rounded-full flex items-center justify-center">
                        <Icon name="Check" size={10} color="white" />
                      </div>
                    )}
                    {contrast?.level === 'FAIL' && (
                      <div className="w-4 h-4 bg-error rounded-full flex items-center justify-center">
                        <Icon name="X" size={10} color="white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Color Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-text-primary">{color?.name}</h4>
                      <p className="text-sm text-text-secondary">{color?.hex}</p>
                    </div>
                    <div className="text-right">
                      <motion.div
                        animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.5 }}
                        className={`text-lg font-bold ${contrast ? getScoreColor(contrast?.level) : 'text-text-secondary'}`}
                      >
                        {contrast ? `${contrast?.score}:1` : '—'}
                      </motion.div>
                      <p className="text-xs text-text-secondary">
                        {contrast?.level || 'Calculating...'}
                      </p>
                    </div>
                  </div>

                  {/* Health Meter */}
                  <div className="relative">
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${contrast ? getHealthMeterWidth(contrast?.score) : 0}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className={`h-full rounded-full ${contrast ? getHealthMeterColor(contrast?.level) : 'bg-muted'}`}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-text-secondary mt-1">
                      <span>0:1</span>
                      <span>4.5:1 (AA)</span>
                      <span>7:1 (AAA)</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors duration-200">
                    <Icon name="ChevronRight" size={16} className="text-text-secondary" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {Object.values(contrastScores)?.filter(s => s?.level === 'AAA')?.length}
            </div>
            <div className="text-xs text-text-secondary">AAA Compliant</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">
              {Object.values(contrastScores)?.filter(s => s?.level === 'AA')?.length}
            </div>
            <div className="text-xs text-text-secondary">AA Compliant</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-error">
              {Object.values(contrastScores)?.filter(s => s?.level === 'FAIL')?.length}
            </div>
            <div className="text-xs text-text-secondary">Violations</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaletteAnalysisPanel;