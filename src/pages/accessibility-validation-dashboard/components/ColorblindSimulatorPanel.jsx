import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ColorblindSimulatorPanel = ({ currentPalette, onSimulationChange }) => {
  const [selectedDeficiency, setSelectedDeficiency] = useState('protanopia');
  const [isComparing, setIsComparing] = useState(true);
  const [simulatedColors, setSimulatedColors] = useState({});

  // Color vision deficiency types
  const deficiencyTypes = [
    {
      id: 'protanopia',
      name: 'Protanopia',
      description: 'Red-blind (1% of males)',
      severity: 'severe',
      icon: 'Eye'
    },
    {
      id: 'deuteranopia',
      name: 'Deuteranopia',
      description: 'Green-blind (1% of males)',
      severity: 'severe',
      icon: 'Eye'
    },
    {
      id: 'tritanopia',
      name: 'Tritanopia',
      description: 'Blue-blind (0.003% of population)',
      severity: 'severe',
      icon: 'Eye'
    },
    {
      id: 'protanomaly',
      name: 'Protanomaly',
      description: 'Red-weak (1% of males)',
      severity: 'moderate',
      icon: 'EyeOff'
    },
    {
      id: 'deuteranomaly',
      name: 'Deuteranomaly',
      description: 'Green-weak (5% of males)',
      severity: 'moderate',
      icon: 'EyeOff'
    },
    {
      id: 'tritanomaly',
      name: 'Tritanomaly',
      description: 'Blue-weak (0.01% of population)',
      severity: 'moderate',
      icon: 'EyeOff'
    },
    {
      id: 'achromatopsia',
      name: 'Achromatopsia',
      description: 'Complete color blindness',
      severity: 'severe',
      icon: 'Minus'
    },
    {
      id: 'achromatomaly',
      name: 'Achromatomaly',
      description: 'Partial color blindness',
      severity: 'moderate',
      icon: 'MinusCircle'
    }
  ];

  // Mock palette data
  const mockPalette = currentPalette || {
    colors: [
      { id: 'primary', hex: '#2563EB', name: 'Primary Blue' },
      { id: 'secondary', hex: '#0EA5E9', name: 'Sky Blue' },
      { id: 'success', hex: '#059669', name: 'Success Green' },
      { id: 'warning', hex: '#D97706', name: 'Warning Orange' },
      { id: 'error', hex: '#DC2626', name: 'Error Red' },
      { id: 'neutral', hex: '#64748B', name: 'Neutral Gray' }
    ]
  };

  // Simulate color vision deficiency
  const simulateColorDeficiency = (hex, deficiency) => {
    // Simplified simulation - in production, use proper color vision algorithms
    const simulationMap = {
      protanopia: (hex) => {
        // Red-blind simulation
        if (hex?.includes('DC2626') || hex?.includes('EF4444')) return '#8B5A2B';
        if (hex?.includes('D97706')) return '#B8860B';
        return hex;
      },
      deuteranopia: (hex) => {
        // Green-blind simulation
        if (hex?.includes('059669') || hex?.includes('10B981')) return '#4A5568';
        if (hex?.includes('D97706')) return '#CD853F';
        return hex;
      },
      tritanopia: (hex) => {
        // Blue-blind simulation
        if (hex?.includes('2563EB') || hex?.includes('0EA5E9')) return '#6B7280';
        return hex;
      },
      protanomaly: (hex) => {
        // Red-weak simulation (less severe)
        if (hex?.includes('DC2626')) return '#B91C1C';
        return hex;
      },
      deuteranomaly: (hex) => {
        // Green-weak simulation (less severe)
        if (hex?.includes('059669')) return '#047857';
        return hex;
      },
      tritanomaly: (hex) => {
        // Blue-weak simulation (less severe)
        if (hex?.includes('2563EB')) return '#1E40AF';
        return hex;
      },
      achromatopsia: (hex) => {
        // Convert to grayscale
        const rgb = parseInt(hex?.slice(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        return `#${gray?.toString(16)?.padStart(2, '0')?.repeat(3)}`;
      },
      achromatomaly: (hex) => {
        // Partial grayscale
        const rgb = parseInt(hex?.slice(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        const blended = {
          r: Math.round(r * 0.7 + gray * 0.3),
          g: Math.round(g * 0.7 + gray * 0.3),
          b: Math.round(b * 0.7 + gray * 0.3)
        };
        return `#${blended?.r?.toString(16)?.padStart(2, '0')}${blended?.g?.toString(16)?.padStart(2, '0')}${blended?.b?.toString(16)?.padStart(2, '0')}`;
      }
    };

    return simulationMap?.[deficiency] ? simulationMap?.[deficiency](hex) : hex;
  };

  // Update simulated colors when deficiency changes
  useEffect(() => {
    const simulated = {};
    mockPalette?.colors?.forEach(color => {
      simulated[color.id] = simulateColorDeficiency(color?.hex, selectedDeficiency);
    });
    setSimulatedColors(simulated);

    if (onSimulationChange) {
      onSimulationChange(selectedDeficiency, simulated);
    }
  }, [selectedDeficiency, mockPalette]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'severe': return 'text-error';
      case 'moderate': return 'text-warning';
      default: return 'text-text-secondary';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'severe': return 'bg-error/10 border-error/20';
      case 'moderate': return 'bg-warning/10 border-warning/20';
      default: return 'bg-muted border-border';
    }
  };

  const selectedDeficiencyData = deficiencyTypes?.find(d => d?.id === selectedDeficiency);

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Colorblind Simulator</h3>
          <p className="text-sm text-text-secondary">Test palette accessibility</p>
        </div>
        <Button
          variant={isComparing ? "default" : "outline"}
          size="sm"
          iconName="Eye"
          iconPosition="left"
          onClick={() => setIsComparing(!isComparing)}
        >
          {isComparing ? 'Comparing' : 'Single View'}
        </Button>
      </div>
      {/* Deficiency Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-primary mb-3">
          Color Vision Deficiency Type
        </label>
        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
          {deficiencyTypes?.map((deficiency) => (
            <button
              key={deficiency?.id}
              onClick={() => setSelectedDeficiency(deficiency?.id)}
              className={`p-3 text-left rounded-lg border transition-all duration-200 ${
                selectedDeficiency === deficiency?.id
                  ? 'border-accent bg-accent/10 text-accent' :'border-border hover:border-accent/50 hover:bg-muted'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name={deficiency?.icon} size={16} />
                  <div>
                    <div className="font-medium text-sm">{deficiency?.name}</div>
                    <div className="text-xs text-text-secondary">{deficiency?.description}</div>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  deficiency?.severity === 'severe' ?'bg-error/10 text-error' :'bg-warning/10 text-warning'
                }`}>
                  {deficiency?.severity}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Color Comparison */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {mockPalette?.colors?.map((color, index) => (
            <motion.div
              key={color?.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-background rounded-lg border border-border"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-text-primary">{color?.name}</h4>
                  <p className="text-sm text-text-secondary">{color?.hex}</p>
                </div>
                {simulatedColors?.[color?.id] !== color?.hex && (
                  <div className="flex items-center space-x-1 text-xs text-warning">
                    <Icon name="AlertTriangle" size={12} />
                    <span>Affected</span>
                  </div>
                )}
              </div>

              {isComparing ? (
                <div className="grid grid-cols-2 gap-4">
                  {/* Original */}
                  <div>
                    <div className="text-xs text-text-secondary mb-2">Original</div>
                    <div
                      className="w-full h-16 rounded-lg border border-border shadow-soft"
                      style={{ backgroundColor: color?.hex }}
                    />
                    <div className="text-xs text-text-secondary mt-1 text-center">
                      {color?.hex}
                    </div>
                  </div>

                  {/* Simulated */}
                  <div>
                    <div className="text-xs text-text-secondary mb-2">
                      {selectedDeficiencyData?.name}
                    </div>
                    <motion.div
                      key={`${color?.id}-${selectedDeficiency}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-16 rounded-lg border border-border shadow-soft"
                      style={{ backgroundColor: simulatedColors?.[color?.id] || color?.hex }}
                    />
                    <div className="text-xs text-text-secondary mt-1 text-center">
                      {simulatedColors?.[color?.id] || color?.hex}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-xs text-text-secondary mb-2">
                    {selectedDeficiencyData?.name} View
                  </div>
                  <motion.div
                    key={`${color?.id}-${selectedDeficiency}-single`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-20 rounded-lg border border-border shadow-soft"
                    style={{ backgroundColor: simulatedColors?.[color?.id] || color?.hex }}
                  />
                  <div className="text-xs text-text-secondary mt-2 text-center">
                    {simulatedColors?.[color?.id] || color?.hex}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      {/* Impact Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Colors Affected:</span>
          <span className="font-medium text-text-primary">
            {Object.values(simulatedColors)?.filter((simColor, index) => 
              simColor !== mockPalette?.colors?.[index]?.hex
            )?.length} of {mockPalette?.colors?.length}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-text-secondary">Population Impact:</span>
          <span className={`font-medium ${getSeverityColor(selectedDeficiencyData?.severity)}`}>
            {selectedDeficiencyData?.description?.match(/\((.*?)\)/)?.[1] || 'Varies'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ColorblindSimulatorPanel;