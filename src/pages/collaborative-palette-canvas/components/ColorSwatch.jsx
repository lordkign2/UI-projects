import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const ColorSwatch = ({ 
  color, 
  index, 
  isLocked = false, 
  onColorChange, 
  onLockToggle, 
  onDragStart, 
  onDragEnd,
  collaboratorCursor = null,
  accessibilityScore = 85
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const swatchRef = useRef(null);

  const getAccessibilityColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getAccessibilityBg = (score) => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    onDragStart?.(index, color);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd?.();
  };

  const handleColorClick = () => {
    if (!isLocked) {
      onColorChange?.(index, color);
    }
  };

  return (
    <motion.div
      ref={swatchRef}
      className="relative group"
      initial={{ scale: 1, y: 0 }}
      animate={{ 
        scale: isDragging ? 1.05 : isHovered ? 1.02 : 1,
        y: isDragging ? -8 : 0
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable={!isLocked}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Collaborator Cursor */}
      {collaboratorCursor && (
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div 
            className="px-2 py-1 rounded text-xs font-medium text-white shadow-soft"
            style={{ backgroundColor: collaboratorCursor?.color }}
          >
            {collaboratorCursor?.name}
          </div>
          <div 
            className="w-2 h-2 mx-auto transform rotate-45 -mt-1"
            style={{ backgroundColor: collaboratorCursor?.color }}
          />
        </motion.div>
      )}
      {/* Main Color Swatch */}
      <motion.div
        className={`
          relative w-full aspect-square rounded-lg border-2 cursor-pointer
          ${isDragging ? 'border-primary shadow-soft-lg' : 'border-border hover:border-primary/50'}
          ${isLocked ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}
        `}
        style={{ backgroundColor: color?.hex }}
        onClick={handleColorClick}
        whileTap={!isLocked ? { scale: 0.98 } : {}}
      >
        {/* Lock Overlay */}
        {isLocked && (
          <motion.div
            className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.6 }}
            >
              <Icon name="Lock" size={24} color="white" />
            </motion.div>
          </motion.div>
        )}

        {/* Accessibility Score Gauge */}
        <motion.div
          className={`
            absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
            ${getAccessibilityBg(accessibilityScore)} ${getAccessibilityColor(accessibilityScore)}
            border-2 border-white shadow-soft
          `}
          initial={{ scale: 0 }}
          animate={{ scale: isHovered || isDragging ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
        >
          {accessibilityScore}
        </motion.div>

        {/* Drag Handle */}
        {!isLocked && (isHovered || isDragging) && (
          <motion.div
            className="absolute top-2 left-2 p-1 bg-white/90 rounded shadow-soft"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Icon name="GripVertical" size={12} className="text-text-secondary" />
          </motion.div>
        )}
      </motion.div>
      {/* Color Information */}
      <div className="mt-3 space-y-2">
        {/* Hex Value */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-mono font-medium text-text-primary">
            {color?.hex?.toUpperCase()}
          </span>
          <button
            onClick={() => onLockToggle?.(index)}
            className={`
              p-1 rounded transition-colors duration-200
              ${isLocked 
                ? 'text-warning hover:text-warning/80' :'text-text-secondary hover:text-text-primary'
              }
            `}
            title={isLocked ? 'Unlock color' : 'Lock color'}
          >
            <Icon name={isLocked ? 'Lock' : 'Unlock'} size={14} />
          </button>
        </div>

        {/* Color Name */}
        {color?.name && (
          <p className="text-xs text-text-secondary truncate" title={color?.name}>
            {color?.name}
          </p>
        )}

        {/* Contrast Ratios */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">vs White:</span>
            <span className={`font-medium ${color?.contrastWhite >= 4.5 ? 'text-success' : 'text-error'}`}>
              {color?.contrastWhite?.toFixed(1)}:1
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">vs Black:</span>
            <span className={`font-medium ${color?.contrastBlack >= 4.5 ? 'text-success' : 'text-error'}`}>
              {color?.contrastBlack?.toFixed(1)}:1
            </span>
          </div>
        </div>

        {/* Accessibility Status */}
        <motion.div
          className={`
            flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
            ${getAccessibilityBg(accessibilityScore)} ${getAccessibilityColor(accessibilityScore)}
          `}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 'auto', opacity: isHovered ? 1 : 0.7 }}
          transition={{ duration: 0.3 }}
        >
          <Icon 
            name={accessibilityScore >= 80 ? 'CheckCircle' : accessibilityScore >= 60 ? 'AlertTriangle' : 'XCircle'} 
            size={12} 
          />
          <span>
            {accessibilityScore >= 80 ? 'WCAG AA' : accessibilityScore >= 60 ? 'Partial' : 'Fails'}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ColorSwatch;