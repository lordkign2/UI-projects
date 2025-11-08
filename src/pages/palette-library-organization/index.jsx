import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import SearchFilters from './components/SearchFilters';
import PaletteCard from './components/PaletteCard';
import BulkActions from './components/BulkActions';
import ViewToggle from './components/ViewToggle';
import CreatePaletteModal from './components/CreatePaletteModal';
import { useAuth } from '../../contexts/AuthContext';
import { paletteService } from '../../services/paletteService';
import { teamService } from '../../services/teamService';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const PaletteLibraryOrganization = () => {
  const { user, loading: authLoading } = useAuth();
  
  // State management
  const [palettes, setPalettes] = useState([]);
  const [filteredPalettes, setFilteredPalettes] = useState([]);
  const [selectedPalettes, setSelectedPalettes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterOptions, setFilterOptions] = useState({
    visibility: 'all',
    tags: [],
    teamId: null,
    sortBy: 'updated_at',
    sortOrder: 'desc'
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);

  // Load palettes and teams
  useEffect(() => {
    if (!user || authLoading) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [palettesData, teamsData] = await Promise.all([
          paletteService?.getPalettes({
            visibility: filterOptions?.visibility !== 'all' ? filterOptions?.visibility : undefined,
            teamId: filterOptions?.teamId,
            search: searchQuery
          }),
          teamService?.getUserTeams()
        ]);

        setPalettes(palettesData);
        setFilteredPalettes(palettesData);
        setTeams(teamsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load palettes');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, authLoading, filterOptions, searchQuery]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...palettes];

    // Apply search
    if (searchQuery) {
      filtered = filtered?.filter(palette =>
        palette?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        palette?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        palette?.tags?.some(tag => tag?.toLowerCase()?.includes(searchQuery?.toLowerCase()))
      );
    }

    // Apply visibility filter
    if (filterOptions?.visibility !== 'all') {
      filtered = filtered?.filter(palette => palette?.visibility === filterOptions?.visibility);
    }

    // Apply team filter
    if (filterOptions?.teamId) {
      filtered = filtered?.filter(palette => palette?.team_id === filterOptions?.teamId);
    }

    // Apply tags filter
    if (filterOptions?.tags?.length > 0) {
      filtered = filtered?.filter(palette =>
        filterOptions?.tags?.some(tag => palette?.tags?.includes(tag))
      );
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      const order = filterOptions?.sortOrder === 'asc' ? 1 : -1;
      
      switch (filterOptions?.sortBy) {
        case 'name':
          return (a?.name?.localeCompare(b?.name) || 0) * order;
        case 'created_at':
          return (new Date(a.created_at) - new Date(b.created_at)) * order;
        case 'updated_at':
        default:
          return (new Date(a.updated_at) - new Date(b.updated_at)) * order;
      }
    });

    setFilteredPalettes(filtered);
  }, [palettes, searchQuery, filterOptions]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilterOptions(prev => ({ ...prev, ...newFilters }));
  };

  const handlePaletteSelect = (paletteId, isSelected) => {
    if (isSelected) {
      setSelectedPalettes(prev => [...prev, paletteId]);
    } else {
      setSelectedPalettes(prev => prev?.filter(id => id !== paletteId));
    }
  };

  const handleSelectAll = () => {
    if (selectedPalettes?.length === filteredPalettes?.length) {
      setSelectedPalettes([]);
    } else {
      setSelectedPalettes(filteredPalettes?.map(palette => palette?.id));
    }
  };

  const handleBulkAction = async (action, data) => {
    try {
      setError(null);

      switch (action) {
        case 'delete':
          await Promise.all(
            selectedPalettes?.map(paletteId => 
              paletteService?.deletePalette(paletteId)
            )
          );
          setPalettes(prev => prev?.filter(palette => !selectedPalettes?.includes(palette?.id)));
          break;

        case 'change_visibility':
          await Promise.all(
            selectedPalettes?.map(paletteId => 
              paletteService?.updatePalette(paletteId, { visibility: data?.visibility })
            )
          );
          // Reload palettes
          const updatedPalettes = await paletteService?.getPalettes({});
          setPalettes(updatedPalettes);
          break;

        case 'add_tags':
          await Promise.all(
            selectedPalettes?.map(paletteId => {
              const palette = palettes?.find(p => p?.id === paletteId);
              const newTags = [...(palette?.tags || []), ...data?.tags];
              return paletteService?.updatePalette(paletteId, { tags: newTags });
            })
          );
          // Reload palettes
          const updatedPalettesWithTags = await paletteService?.getPalettes({});
          setPalettes(updatedPalettesWithTags);
          break;

        default:
          console.warn('Unknown bulk action:', action);
      }

      setSelectedPalettes([]);
    } catch (err) {
      console.error('Error performing bulk action:', err);
      setError(`Failed to ${action} palettes`);
    }
  };

  const handlePaletteCreate = async (paletteData) => {
    try {
      const newPalette = await paletteService?.createPalette(paletteData);
      setPalettes(prev => [newPalette, ...prev]);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating palette:', err);
      setError('Failed to create palette');
    }
  };

  const handlePaletteUpdate = async (paletteId, updates) => {
    try {
      const updatedPalette = await paletteService?.updatePalette(paletteId, updates);
      setPalettes(prev => prev?.map(palette => 
        palette?.id === paletteId ? { ...palette, ...updatedPalette } : palette
      ));
    } catch (err) {
      console.error('Error updating palette:', err);
      setError('Failed to update palette');
    }
  };

  const handlePaletteDelete = async (paletteId) => {
    try {
      await paletteService?.deletePalette(paletteId);
      setPalettes(prev => prev?.filter(palette => palette?.id !== paletteId));
    } catch (err) {
      console.error('Error deleting palette:', err);
      setError('Failed to delete palette');
    }
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading your palettes...</p>
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
                This is a preview of the palette library. Sign in to create and manage your own palettes.
              </p>
            </div>
            <Icon name="FolderOpen" size={48} className="mx-auto text-text-secondary mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">Authentication Required</h3>
            <p className="text-text-secondary mb-6">Please sign in to access your palette library</p>
            <Button
              variant="default"
              onClick={() => window.location.href = '/authentication-login-register'}
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
        <div className="flex-1 p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Palette Library</h1>
              <p className="text-text-secondary mt-1">
                {filteredPalettes?.length || 0} palettes • {selectedPalettes?.length || 0} selected
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <ViewToggle
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setShowCreateModal(true)}
              >
                Create Palette
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <SearchFilters
              searchQuery={searchQuery}
              onSearchChange={handleSearch}
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
              teams={teams}
            />
          </div>

          {/* Bulk Actions */}
          {selectedPalettes?.length > 0 && (
            <div className="mb-6">
              <BulkActions
                selectedCount={selectedPalettes?.length}
                onSelectAll={handleSelectAll}
                onClearSelection={() => setSelectedPalettes([])}
                onBulkAction={handleBulkAction}
                allSelected={selectedPalettes?.length === filteredPalettes?.length}
              />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-error/10 border border-error text-error px-4 py-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm">{error}</span>
                <button onClick={() => setError(null)}>
                  <Icon name="X" size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Palettes Grid/List */}
          {filteredPalettes?.length > 0 ? (
            <motion.div
              className={`grid gap-6 ${
                viewMode === 'grid' ?'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :'grid-cols-1'
              }`}
              layout
            >
              {filteredPalettes?.map((palette, index) => (
                <motion.div
                  key={palette?.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <PaletteCard
                    palette={palette}
                    viewMode={viewMode}
                    isSelected={selectedPalettes?.includes(palette?.id)}
                    onSelect={(isSelected) => handlePaletteSelect(palette?.id, isSelected)}
                    onUpdate={(updates) => handlePaletteUpdate(palette?.id, updates)}
                    onDelete={() => handlePaletteDelete(palette?.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <Icon name="FolderOpen" size={48} className="mx-auto text-text-secondary mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">
                {searchQuery || filterOptions?.visibility !== 'all' || filterOptions?.teamId ?'No palettes found' :'No palettes yet'
                }
              </h3>
              <p className="text-text-secondary mb-6">
                {searchQuery || filterOptions?.visibility !== 'all' || filterOptions?.teamId ?'Try adjusting your search or filters' :'Create your first palette to get started'
                }
              </p>
              {(!searchQuery && filterOptions?.visibility === 'all' && !filterOptions?.teamId) && (
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create Your First Palette
                </Button>
              )}
            </div>
          )}
        </div>

        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </div>
      {/* Create Palette Modal */}
      {showCreateModal && (
        <CreatePaletteModal
          teams={teams}
          onClose={() => setShowCreateModal(false)}
          onCreate={handlePaletteCreate}
        />
      )}
    </div>
  );
};

export default PaletteLibraryOrganization;