import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AccessibilityPanel = ({ palette = [], isVisible = true }) => {
  const [activeTab, setActiveTab] = useState('compliance');
  const [colorblindType, setColorblindType] = useState('none');
  const [complianceData, setComplianceData] = useState({});
  const [simulatedPalette, setSimulatedPalette] = useState([]);

  const colorblindTypes = [
    { value: 'none', label: 'Normal Vision' },
    { value: 'protanopia', label: 'Protanopia (Red-blind)' },
    { value: 'deuteranopia', label: 'Deuteranopia (Green-blind)' },
    { value: 'tritanopia', label: 'Tritanopia (Blue-blind)' },
    { value: 'protanomaly', label: 'Protanomaly (Red-weak)' },
    { value: 'deuteranomaly', label: 'Deuteranomaly (Green-weak)' },
    { value: 'tritanomaly', label: 'Tritanomaly (Blue-weak)' },
    { value: 'achromatopsia', label: 'Achromatopsia (Monochrome)' }
  ];

  const tabs = [
    { id: 'compliance', label: 'WCAG Compliance', icon: 'Shield' },
    { id: 'colorblind', label: 'Colorblind Sim', icon: 'Eye' },
    { id: 'contrast', label: 'Contrast Matrix', icon: 'Grid' }
  ];

  useEffect(() => {
    calculateCompliance();
    simulateColorblindness();
  }, [palette, colorblindType]);

  const calculateCompliance = () => {
    const compliance = {
      overallScore: 0,
      aaCompliant: 0,
      aaaCompliant: 0,
      violations: [],
      recommendations: []
    };

    let totalScore = 0;
    let colorCount = 0;

    palette?.forEach((color, index) => {
      if (color?.contrastWhite >= 4.5) compliance.aaCompliant++;
      if (color?.contrastWhite >= 7) compliance.aaaCompliant++;
      
      totalScore += Math.min(color?.contrastWhite / 4.5, 1) * 100;
      colorCount++;

      if (color?.contrastWhite < 4.5) {
        compliance?.violations?.push({
          colorIndex: index,
          issue: 'Low contrast ratio',
          current: color?.contrastWhite?.toFixed(1),
          required: '4.5',
          severity: 'high'
        });
      }

      if (color?.contrastBlack < 4.5 && color?.contrastWhite < 4.5) {
        compliance?.recommendations?.push({
          colorIndex: index,
          suggestion: 'Adjust lightness for better contrast',
          type: 'contrast'
        });
      }
    });

    compliance.overallScore = colorCount > 0 ? Math.round(totalScore / colorCount) : 0;
    setComplianceData(compliance);
  };

  const simulateColorblindness = () => {
    if (colorblindType === 'none') {
      setSimulatedPalette(palette);
      return;
    }

    const simulated = palette?.map(color => {
      const rgb = hexToRgb(color?.hex);
      const simulatedRgb = applyColorblindFilter(rgb, colorblindType);
      return {
        ...color,
        hex: rgbToHex(simulatedRgb),
        original: color?.hex
      };
    });

    setSimulatedPalette(simulated);
  };

  const hexToRgb = (hex) => {
    const r = parseInt(hex?.slice(1, 3), 16);
    const g = parseInt(hex?.slice(3, 5), 16);
    const b = parseInt(hex?.slice(5, 7), 16);
    return { r, g, b };
  };

  const rgbToHex = (rgb) => {
    const toHex = (n) => Math.round(n)?.toString(16)?.padStart(2, '0');
    return `#${toHex(rgb?.r)}${toHex(rgb?.g)}${toHex(rgb?.b)}`;
  };

  const applyColorblindFilter = (rgb, type) => {
    // Simplified colorblind simulation matrices
    const matrices = {
      protanopia: [
        [0.567, 0.433, 0],
        [0.558, 0.442, 0],
        [0, 0.242, 0.758]
      ],
      deuteranopia: [
        [0.625, 0.375, 0],
        [0.7, 0.3, 0],
        [0, 0.3, 0.7]
      ],
      tritanopia: [
        [0.95, 0.05, 0],
        [0, 0.433, 0.567],
        [0, 0.475, 0.525]
      ],
      achromatopsia: [
        [0.299, 0.587, 0.114],
        [0.299, 0.587, 0.114],
        [0.299, 0.587, 0.114]
      ]
    };

    const matrix = matrices?.[type] || matrices?.protanopia;
    
    return {
      r: matrix?.[0]?.[0] * rgb?.r + matrix?.[0]?.[1] * rgb?.g + matrix?.[0]?.[2] * rgb?.b,
      g: matrix?.[1]?.[0] * rgb?.r + matrix?.[1]?.[1] * rgb?.g + matrix?.[1]?.[2] * rgb?.b,
      b: matrix?.[2]?.[0] * rgb?.r + matrix?.[2]?.[1] * rgb?.g + matrix?.[2]?.[2] * rgb?.b
    };
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-warning';
    return 'bg-error';
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="bg-surface border border-border rounded-lg overflow-hidden"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with Tabs */}
      <div className="border-b border-border">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-semibold text-text-primary">Accessibility</h3>
          <div className={`text-2xl font-bold ${getScoreColor(complianceData?.overallScore)}`}>
            {complianceData?.overallScore}%
          </div>
        </div>
        
        <div className="flex border-t border-border">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`
                flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium
                transition-colors duration-200
                ${activeTab === tab?.id
                  ? 'bg-primary text-primary-foreground border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                }
              `}
            >
              <Icon name={tab?.icon} size={16} />
              <span className="hidden sm:inline">{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'compliance' && (
            <motion.div
              key="compliance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Overall Score */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">Overall Score</span>
                  <motion.div
                    className={`px-3 py-1 rounded-full text-sm font-bold text-white ${getScoreBg(complianceData?.overallScore)}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
                  >
                    {complianceData?.overallScore}%
                  </motion.div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${getScoreBg(complianceData?.overallScore)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${complianceData?.overallScore}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Compliance Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-lg font-bold text-success">{complianceData?.aaCompliant}</div>
                  <div className="text-xs text-text-secondary">WCAG AA</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-lg font-bold text-accent">{complianceData?.aaaCompliant}</div>
                  <div className="text-xs text-text-secondary">WCAG AAA</div>
                </div>
              </div>

              {/* Violations */}
              {complianceData?.violations?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-text-primary flex items-center space-x-2">
                    <Icon name="AlertTriangle" size={14} className="text-error" />
                    <span>Issues Found</span>
                  </h4>
                  {complianceData?.violations?.map((violation, index) => (
                    <div key={index} className="p-3 bg-error/10 border border-error/20 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-error">{violation?.issue}</p>
                          <p className="text-xs text-text-secondary mt-1">
                            Current: {violation?.current}:1 | Required: {violation?.required}:1
                          </p>
                        </div>
                        <Button variant="outline" size="xs">Fix</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'colorblind' && (
            <motion.div
              key="colorblind"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Colorblind Type Selector */}
              <Select
                label="Vision Type"
                options={colorblindTypes}
                value={colorblindType}
                onChange={setColorblindType}
              />

              {/* Comparison View */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-text-primary">Color Comparison</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-secondary mb-2">Original</p>
                    <div className="grid grid-cols-3 gap-1">
                      {palette?.slice(0, 6)?.map((color, index) => (
                        <div
                          key={`original-${index}`}
                          className="aspect-square rounded border border-border"
                          style={{ backgroundColor: color?.hex }}
                          title={color?.hex}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-2">
                      {colorblindTypes?.find(t => t?.value === colorblindType)?.label}
                    </p>
                    <div className="grid grid-cols-3 gap-1">
                      {simulatedPalette?.slice(0, 6)?.map((color, index) => (
                        <div
                          key={`simulated-${index}`}
                          className="aspect-square rounded border border-border"
                          style={{ backgroundColor: color?.hex }}
                          title={`${color?.original} → ${color?.hex}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Accessibility Impact */}
              {colorblindType !== 'none' && (
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon name="Info" size={16} className="text-warning mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-warning">Impact Assessment</p>
                      <p className="text-xs text-text-secondary mt-1">
                        {colorblindType?.includes('anomaly') 
                          ? 'Mild color perception differences may affect some users.' :'Significant color perception changes detected. Consider additional visual cues.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'contrast' && (
            <motion.div
              key="contrast"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h4 className="text-sm font-medium text-text-primary">Contrast Matrix</h4>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {palette?.slice(0, 4)?.map((color1, i) => (
                  palette?.slice(0, 4)?.map((color2, j) => {
                    if (i === j) {
                      return (
                        <div
                          key={`${i}-${j}`}
                          className="aspect-square rounded border border-border"
                          style={{ backgroundColor: color1?.hex }}
                        />
                      );
                    }
                    
                    const contrast = calculateContrast(color1?.hex, color2?.hex);
                    const isGood = contrast >= 4.5;
                    
                    return (
                      <div
                        key={`${i}-${j}`}
                        className={`aspect-square rounded border flex items-center justify-center text-xs font-bold ${
                          isGood ? 'bg-success text-white' : 'bg-error text-white'
                        }`}
                        title={`${color1?.hex} vs ${color2?.hex}: ${contrast?.toFixed(1)}:1`}
                      >
                        {contrast?.toFixed(1)}
                      </div>
                    );
                  })
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Helper function to calculate contrast ratio
const calculateContrast = (color1, color2) => {
  const getLuminance = (hex) => {
    const rgb = [
      parseInt(hex?.slice(1, 3), 16),
      parseInt(hex?.slice(3, 5), 16),
      parseInt(hex?.slice(5, 7), 16)
    ]?.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb?.[0] + 0.7152 * rgb?.[1] + 0.0722 * rgb?.[2];
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

export default AccessibilityPanel;