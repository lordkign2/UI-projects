import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import TeamPresence from '../../components/ui/TeamPresence';
import ColorSwatch from './components/ColorSwatch';
import ColorPicker from './components/ColorPicker';
import AccessibilityPanel from './components/AccessibilityPanel';
import CollaborativeCursors from './components/CollaborativeCursors';
import CanvasToolbar from './components/CanvasToolbar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { paletteService } from '../../services/paletteService';

const CollaborativePaletteCanvas = () => {
  const { id: paletteId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  // State management
  const [palette, setPalette] = useState(null);
  const [paletteColors, setPaletteColors] = useState([]);
  const [selectedColorIndex, setSelectedColorIndex] = useState(null);
  const [lockedColors, setLockedColors] = useState(new Set());
  const [draggedColor, setDraggedColor] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [rightPanelVisible, setRightPanelVisible] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [realtimeChannel, setRealtimeChannel] = useState(null);
  
  const canvasRef = useRef(null);

  // Load palette data
  useEffect(() => {
    if (!paletteId || authLoading) return;

    const loadPalette = async () => {
      try {
        setLoading(true);
        setError(null);

        const paletteData = await paletteService?.getPalette(paletteId);
        if (!paletteData) {
          setError('Palette not found');
          return;
        }

        setPalette(paletteData);
        setPaletteColors(paletteData?.palette_colors || []);
        
        // Set locked colors
        const locked = new Set(
          paletteData.palette_colors
            ?.filter(color => color.is_locked)
            ?.map((_, index) => index) || []
        );
        setLockedColors(locked);

        // Set active collaborators
        setCollaborators(
          paletteData?.collaboration_sessions
            ?.filter(session => session?.is_active)
            ?.map(session => ({
              name: session?.user?.full_name || 'Anonymous',
              color: '#2563EB',
              x: session?.cursor_x || 0,
              y: session?.cursor_y || 0,
              userId: session?.user_id
            })) || []
        );

      } catch (err) {
        console.error('Error loading palette:', err);
        setError(err?.message || 'Failed to load palette');
      } finally {
        setLoading(false);
      }
    };

    loadPalette();
  }, [paletteId, authLoading]);

  // Setup real-time subscriptions
  useEffect(() => {
    if (!paletteId || !user) return;

    const channel = paletteService?.subscribeToPaletteChanges(paletteId, (payload) => {
      if (payload?.table === 'palette_colors') {
        // Reload palette colors when they change
        loadPaletteColors();
      } else if (payload?.table === 'palettes') {
        // Reload palette data when palette changes
        loadPalette();
      }
    });

    const collaborationChannel = paletteService?.subscribeToCollaboration(paletteId, (payload) => {
      if (payload?.eventType === 'INSERT' || payload?.eventType === 'UPDATE') {
        // Update collaborator cursors
        loadCollaborators();
      }
    });

    setRealtimeChannel(channel);

    // Cleanup inactive sessions periodically
    const cleanupInterval = setInterval(() => {
      paletteService?.cleanupInactiveSessions(paletteId);
    }, 60000); // Every minute

    return () => {
      if (channel) {
        paletteService?.supabase?.removeChannel(channel);
      }
      if (collaborationChannel) {
        paletteService?.supabase?.removeChannel(collaborationChannel);
      }
      clearInterval(cleanupInterval);
    };
  }, [paletteId, user]);

  const loadPaletteColors = async () => {
    try {
      const colors = await paletteService?.getPaletteColors(paletteId);
      setPaletteColors(colors);
      
      const locked = new Set(
        colors?.filter(color => color.is_locked)?.map((_, index) => index) || []
      );
      setLockedColors(locked);
    } catch (err) {
      console.error('Error loading palette colors:', err);
    }
  };

  const loadPalette = async () => {
    try {
      const paletteData = await paletteService?.getPalette(paletteId);
      if (paletteData) {
        setPalette(paletteData);
      }
    } catch (err) {
      console.error('Error loading palette:', err);
    }
  };

  const loadCollaborators = async () => {
    try {
      const paletteData = await paletteService?.getPalette(paletteId);
      setCollaborators(
        paletteData?.collaboration_sessions
          ?.filter(session => session?.is_active && session?.user_id !== user?.id)
          ?.map(session => ({
            name: session?.user?.full_name || 'Anonymous',
            color: '#2563EB',
            x: session?.cursor_x || 0,
            y: session?.cursor_y || 0,
            userId: session?.user_id
          })) || []
      );
    } catch (err) {
      console.error('Error loading collaborators:', err);
    }
  };

  const calculateAccessibilityScore = (color) => {
    const avgContrast = (color?.contrast_white + color?.contrast_black) / 2;
    return Math.min(Math.round((avgContrast / 7) * 100), 100);
  };

  const handleColorChange = async (index, newColor) => {
    if (lockedColors?.has(index)) return;
    
    const colorToUpdate = paletteColors?.[index];
    if (!colorToUpdate) return;

    try {
      // Save current state for undo
      setUndoStack(prev => [...prev, [...paletteColors]]);
      setRedoStack([]);
      
      await paletteService?.updateColor(colorToUpdate?.id, {
        hex_value: newColor?.hex,
        name: newColor?.name || colorToUpdate?.name
      });
      
      setHasUnsavedChanges(true);
    } catch (err) {
      console.error('Error updating color:', err);
      setError('Failed to update color');
    }
  };

  const handleLockToggle = async (index) => {
    const colorToToggle = paletteColors?.[index];
    if (!colorToToggle) return;

    try {
      await paletteService?.toggleColorLock(colorToToggle?.id);
      setHasUnsavedChanges(true);
    } catch (err) {
      console.error('Error toggling color lock:', err);
      setError('Failed to toggle color lock');
    }
  };

  const handleAddColor = async (newColor) => {
    try {
      setUndoStack(prev => [...prev, [...paletteColors]]);
      setRedoStack([]);
      
      await paletteService?.addColor(paletteId, {
        hex_value: newColor?.hex,
        name: newColor?.name || `Color ${paletteColors?.length + 1}`
      });
      
      setHasUnsavedChanges(true);
    } catch (err) {
      console.error('Error adding color:', err);
      setError('Failed to add color');
    }
  };

  const handleRemoveColor = async (index) => {
    const colorToRemove = paletteColors?.[index];
    if (!colorToRemove) return;

    try {
      setUndoStack(prev => [...prev, [...paletteColors]]);
      setRedoStack([]);
      
      await paletteService?.removeColor(colorToRemove?.id);
      setHasUnsavedChanges(true);
    } catch (err) {
      console.error('Error removing color:', err);
      setError('Failed to remove color');
    }
  };

  const handleDragStart = (index, color) => {
    if (lockedColors?.has(index)) return;
    setDraggedColor({ index, color });
  };

  const handleDragEnd = () => {
    setDraggedColor(null);
  };

  const handleUndo = () => {
    if (undoStack?.length > 0) {
      const previousState = undoStack?.[undoStack?.length - 1];
      setRedoStack(prev => [paletteColors, ...prev]);
      setUndoStack(prev => prev?.slice(0, -1));
      setPaletteColors(previousState);
    }
  };

  const handleRedo = () => {
    if (redoStack?.length > 0) {
      const nextState = redoStack?.[0];
      setUndoStack(prev => [...prev, paletteColors]);
      setRedoStack(prev => prev?.slice(1));
      setPaletteColors(nextState);
    }
  };

  const handleSave = async () => {
    try {
      await paletteService?.updatePalette(paletteId, {
        updated_at: new Date()?.toISOString()
      });
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Error saving palette:', err);
      setError('Failed to save palette');
    }
  };

  const handleExport = () => {
    navigate('/export-integration-hub', { state: { paletteId } });
  };

  const getCollaboratorCursor = (index) => {
    // Return collaborator cursor if they're working on this color
    return collaborators?.find(collab => collab?.activeColorIndex === index) || null;
  };

  // Handle mouse movement for collaboration cursor
  const handleMouseMove = async (event) => {
    if (!user || !canvasRef?.current) return;

    const rect = canvasRef?.current?.getBoundingClientRect();
    const x = event.clientX - rect?.left;
    const y = event.clientY - rect?.top;

    await paletteService?.updateCollaborationCursor(paletteId, { x, y });
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading palette...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="mx-auto text-error mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">Error Loading Palette</h3>
            <p className="text-text-secondary mb-6">{error}</p>
            <Button
              variant="default"
              onClick={() => window.location?.reload()}
            >
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Auth required state (for development preview)
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="bg-warning/10 border border-warning rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-warning mb-2">Preview Mode</h3>
              <p className="text-sm text-text-secondary">
                This is a preview of the collaborative palette canvas. Sign in to access real collaboration features.
              </p>
            </div>
            <Icon name="Palette" size={48} className="mx-auto text-text-secondary mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">Authentication Required</h3>
            <p className="text-text-secondary mb-6">Please sign in to access collaborative palette features</p>
            <Button
              variant="default"
              onClick={() => navigate('/authentication-login-register')}
            >
              Sign In
            </Button>
          </div>
        </div>
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex pt-16">
        {/* Left Sidebar - Color Picker */}
        <AnimatePresence>
          {leftPanelVisible && (
            <motion.div
              className="fixed left-0 top-16 bottom-0 w-80 z-30 lg:relative lg:w-80"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-full bg-surface border-r border-border overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-text-primary">Color Tools</h2>
                    <button
                      onClick={() => setLeftPanelVisible(false)}
                      className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                    >
                      <Icon name="X" size={16} />
                    </button>
                  </div>
                  
                  <ColorPicker
                    selectedColor={selectedColorIndex !== null ? paletteColors?.[selectedColorIndex] : null}
                    onColorChange={(color) => {
                      if (selectedColorIndex !== null) {
                        handleColorChange(selectedColorIndex, color);
                      }
                    }}
                    onAddColor={handleAddColor}
                    isVisible={true}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          <div className="flex-1 p-6">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Breadcrumbs />
                {!leftPanelVisible && (
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="PanelLeft"
                    onClick={() => setLeftPanelVisible(true)}
                    title="Show color picker"
                  />
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <TeamPresence collaborators={collaborators} />
                {!rightPanelVisible && (
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="PanelRight"
                    onClick={() => setRightPanelVisible(true)}
                    title="Show accessibility panel"
                  />
                )}
              </div>
            </div>

            {/* Palette Info */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-text-primary">{palette?.name || 'Untitled Palette'}</h1>
                  <p className="text-text-secondary mt-1">
                    Last modified {palette?.updated_at ? new Date(palette.updated_at)?.toLocaleString() : 'Unknown'} • {paletteColors?.length || 0} colors • {collaborators?.length + 1} collaborators
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                    Live
                  </div>
                  <div className="px-3 py-1 bg-muted text-text-secondary rounded-full text-sm">
                    Auto-save enabled
                  </div>
                </div>
              </div>
            </div>

            {/* Canvas Toolbar */}
            <div className="mb-6">
              <CanvasToolbar
                onUndo={handleUndo}
                onRedo={handleRedo}
                onExport={handleExport}
                onSave={handleSave}
                onVersionHistory={() => {}}
                canUndo={undoStack?.length > 0}
                canRedo={redoStack?.length > 0}
                hasUnsavedChanges={hasUnsavedChanges}
              />
            </div>

            {/* Color Palette Grid */}
            <div 
              ref={canvasRef}
              className="relative bg-surface border border-border rounded-lg p-6 min-h-96"
              onMouseMove={handleMouseMove}
            >
              <CollaborativeCursors collaborators={collaborators} canvasRef={canvasRef} />
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {paletteColors?.map((color, index) => (
                  <motion.div
                    key={color?.id || index}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ColorSwatch
                      color={{
                        hex: color?.hex_value,
                        name: color?.name,
                        contrastWhite: color?.contrast_white,
                        contrastBlack: color?.contrast_black,
                        locked: color?.is_locked
                      }}
                      index={index}
                      isLocked={lockedColors?.has(index)}
                      onColorChange={handleColorChange}
                      onLockToggle={handleLockToggle}
                      onRemove={() => handleRemoveColor(index)}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      collaboratorCursor={getCollaboratorCursor(index)}
                      accessibilityScore={calculateAccessibilityScore(color)}
                      onClick={() => setSelectedColorIndex(index)}
                      isSelected={selectedColorIndex === index}
                    />
                  </motion.div>
                ))}
                
                {/* Add Color Button */}
                <motion.button
                  className="aspect-square border-2 border-dashed border-border hover:border-primary rounded-lg flex items-center justify-center text-text-secondary hover:text-primary transition-all duration-200 group"
                  onClick={() => handleAddColor({ hex: '#' + Math.floor(Math.random()*16777215)?.toString(16)?.padStart(6, '0') })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <Icon name="Plus" size={24} className="mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-sm font-medium">Add Color</span>
                  </div>
                </motion.button>
              </div>

              {/* Empty State */}
              {paletteColors?.length === 0 && (
                <div className="text-center py-12">
                  <Icon name="Palette" size={48} className="mx-auto text-text-secondary mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">Start Creating Your Palette</h3>
                  <p className="text-text-secondary mb-6">Add colors using the color picker or click the add button above</p>
                  <Button
                    variant="default"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => handleAddColor({ hex: '#2563EB' })}
                  >
                    Add First Color
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Accessibility Panel */}
        <AnimatePresence>
          {rightPanelVisible && (
            <motion.div
              className="fixed right-0 top-16 bottom-0 w-80 z-30 lg:relative lg:w-80"
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-full bg-surface border-l border-border overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-text-primary">Accessibility</h2>
                    <button
                      onClick={() => setRightPanelVisible(false)}
                      className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                    >
                      <Icon name="X" size={16} />
                    </button>
                  </div>
                  
                  <AccessibilityPanel
                    palette={paletteColors?.map(color => ({
                      hex: color?.hex_value,
                      name: color?.name,
                      contrastWhite: color?.contrast_white,
                      contrastBlack: color?.contrast_black,
                      locked: color?.is_locked
                    }))}
                    isVisible={true}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </div>
      {/* Error Alert */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-error/10 border border-error text-error px-4 py-3 rounded-lg max-w-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <button onClick={() => setError(null)} className="ml-2">
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>
      )}
      {/* Mobile Panel Toggles */}
      <div className="lg:hidden fixed bottom-4 left-4 z-50 flex space-x-2">
        {!leftPanelVisible && (
          <Button
            variant="default"
            size="icon"
            iconName="Palette"
            onClick={() => setLeftPanelVisible(true)}
            className="shadow-soft-lg"
            title="Show color picker"
          />
        )}
        {!rightPanelVisible && (
          <Button
            variant="default"
            size="icon"
            iconName="Shield"
            onClick={() => setRightPanelVisible(true)}
            className="shadow-soft-lg"
            title="Show accessibility panel"
          />
        )}
      </div>
      {/* Overlay for mobile panels */}
      {(leftPanelVisible || rightPanelVisible) && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-20 z-20"
          onClick={() => {
            setLeftPanelVisible(false);
            setRightPanelVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default CollaborativePaletteCanvas;