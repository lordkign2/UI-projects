import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ColorPicker = ({ selectedColor, onColorChange, onAddColor, isVisible = true }) => {
  const [currentColor, setCurrentColor] = useState({
    hex: '#2563EB',
    hsl: { h: 217, s: 91, l: 60 },
    rgb: { r: 37, g: 99, b: 235 }
  });
  const [inputMode, setInputMode] = useState('hex'); // hex, hsl, rgb
  const [harmonySuggestions, setHarmonySuggestions] = useState([]);

  useEffect(() => {
    if (selectedColor) {
      setCurrentColor(selectedColor);
    }
  }, [selectedColor]);

  useEffect(() => {
    generateHarmonySuggestions(currentColor);
  }, [currentColor]);

  const hexToHsl = (hex) => {
    const r = parseInt(hex?.slice(1, 3), 16) / 255;
    const g = parseInt(hex?.slice(3, 5), 16) / 255;
    const b = parseInt(hex?.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)?.toString(16)?.padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const generateHarmonySuggestions = (baseColor) => {
    const { h, s, l } = baseColor?.hsl;
    const suggestions = [
      { name: 'Complementary', h: (h + 180) % 360, s, l },
      { name: 'Triadic 1', h: (h + 120) % 360, s, l },
      { name: 'Triadic 2', h: (h + 240) % 360, s, l },
      { name: 'Analogous 1', h: (h + 30) % 360, s, l },
      { name: 'Analogous 2', h: (h - 30 + 360) % 360, s, l },
      { name: 'Split Comp 1', h: (h + 150) % 360, s, l },
      { name: 'Split Comp 2', h: (h + 210) % 360, s, l }
    ];

    setHarmonySuggestions(suggestions?.map(suggestion => ({
      ...suggestion,
      hex: hslToHex(suggestion?.h, suggestion?.s, suggestion?.l)
    })));
  };

  const handleHexChange = (hex) => {
    if (/^#[0-9A-F]{6}$/i?.test(hex)) {
      const hsl = hexToHsl(hex);
      const newColor = { hex, hsl, rgb: hexToRgb(hex) };
      setCurrentColor(newColor);
      onColorChange?.(newColor);
    }
  };

  const handleHslChange = (property, value) => {
    const newHsl = { ...currentColor?.hsl, [property]: parseInt(value) };
    const hex = hslToHex(newHsl?.h, newHsl?.s, newHsl?.l);
    const newColor = { hex, hsl: newHsl, rgb: hexToRgb(hex) };
    setCurrentColor(newColor);
    onColorChange?.(newColor);
  };

  const hexToRgb = (hex) => {
    const r = parseInt(hex?.slice(1, 3), 16);
    const g = parseInt(hex?.slice(3, 5), 16);
    const b = parseInt(hex?.slice(5, 7), 16);
    return { r, g, b };
  };

  const presetColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];

  if (!isVisible) return null;

  return (
    <motion.div
      className="bg-surface border border-border rounded-lg p-6 space-y-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text-primary">Color Picker</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setInputMode('hex')}
            className={`px-2 py-1 text-xs rounded ${inputMode === 'hex' ? 'bg-primary text-primary-foreground' : 'text-text-secondary hover:text-text-primary'}`}
          >
            HEX
          </button>
          <button
            onClick={() => setInputMode('hsl')}
            className={`px-2 py-1 text-xs rounded ${inputMode === 'hsl' ? 'bg-primary text-primary-foreground' : 'text-text-secondary hover:text-text-primary'}`}
          >
            HSL
          </button>
        </div>
      </div>
      {/* Current Color Display */}
      <div className="space-y-4">
        <div
          className="w-full h-20 rounded-lg border-2 border-border"
          style={{ backgroundColor: currentColor?.hex }}
        />
        
        {/* Color Input */}
        {inputMode === 'hex' ? (
          <Input
            label="Hex Value"
            type="text"
            value={currentColor?.hex}
            onChange={(e) => handleHexChange(e?.target?.value)}
            placeholder="#000000"
            className="font-mono"
          />
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Hue: {currentColor?.hsl?.h}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={currentColor?.hsl?.h}
                onChange={(e) => handleHslChange('h', e?.target?.value)}
                className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Saturation: {currentColor?.hsl?.s}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={currentColor?.hsl?.s}
                onChange={(e) => handleHslChange('s', e?.target?.value)}
                className="w-full h-2 bg-gradient-to-r from-gray-500 to-current rounded-lg appearance-none cursor-pointer"
                style={{ color: hslToHex(currentColor?.hsl?.h, 100, currentColor?.hsl?.l) }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Lightness: {currentColor?.hsl?.l}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={currentColor?.hsl?.l}
                onChange={(e) => handleHslChange('l', e?.target?.value)}
                className="w-full h-2 bg-gradient-to-r from-black via-current to-white rounded-lg appearance-none cursor-pointer"
                style={{ color: hslToHex(currentColor?.hsl?.h, currentColor?.hsl?.s, 50) }}
              />
            </div>
          </div>
        )}
      </div>
      {/* Preset Colors */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-text-primary">Quick Colors</h4>
        <div className="grid grid-cols-5 gap-2">
          {presetColors?.map((color, index) => (
            <button
              key={index}
              className="w-8 h-8 rounded border-2 border-border hover:border-primary transition-colors duration-200"
              style={{ backgroundColor: color }}
              onClick={() => handleHexChange(color)}
              title={color}
            />
          ))}
        </div>
      </div>
      {/* AI Harmony Suggestions */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Icon name="Sparkles" size={16} className="text-accent" />
          <h4 className="text-sm font-medium text-text-primary">AI Harmony</h4>
        </div>
        <div className="space-y-2">
          {harmonySuggestions?.slice(0, 4)?.map((suggestion, index) => (
            <div key={index} className="flex items-center space-x-3">
              <button
                className="w-6 h-6 rounded border border-border hover:border-primary transition-colors duration-200"
                style={{ backgroundColor: suggestion?.hex }}
                onClick={() => handleHexChange(suggestion?.hex)}
              />
              <span className="text-xs text-text-secondary flex-1">{suggestion?.name}</span>
              <button
                onClick={() => onAddColor?.(suggestion)}
                className="p-1 text-text-secondary hover:text-primary transition-colors duration-200"
                title="Add to palette"
              >
                <Icon name="Plus" size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Actions */}
      <div className="flex space-x-2">
        <Button
          variant="default"
          size="sm"
          iconName="Plus"
          iconPosition="left"
          onClick={() => onAddColor?.(currentColor)}
          className="flex-1"
        >
          Add Color
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="Pipette"
          title="Eyedropper tool"
        />
      </div>
    </motion.div>
  );
};

export default ColorPicker;