import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const SearchFilters = ({ onFiltersChange, totalPalettes, filteredCount }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [accessibilityFilter, setAccessibilityFilter] = useState([]);
  const [dateRange, setDateRange] = useState('');
  const [sortBy, setSortBy] = useState('modified');
  const [isExpanded, setIsExpanded] = useState(true);

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'brand', label: 'Brand Colors' },
    { value: 'ui', label: 'UI Components' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'accessibility', label: 'Accessibility' },
    { value: 'experimental', label: 'Experimental' },
    { value: 'archived', label: 'Archived' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const sortOptions = [
    { value: 'modified', label: 'Last Modified' },
    { value: 'created', label: 'Date Created' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'accessibility', label: 'Accessibility Score' },
    { value: 'usage', label: 'Usage Frequency' }
  ];

  const accessibilityOptions = [
    { id: 'wcag-aa', label: 'WCAG AA Compliant', count: 24 },
    { id: 'wcag-aaa', label: 'WCAG AAA Compliant', count: 12 },
    { id: 'colorblind-safe', label: 'Colorblind Safe', count: 18 },
    { id: 'high-contrast', label: 'High Contrast', count: 15 }
  ];

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    applyFilters({ searchQuery: value });
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    applyFilters({ category: value });
  };

  const handleAccessibilityChange = (optionId, checked) => {
    const newFilters = checked 
      ? [...accessibilityFilter, optionId]
      : accessibilityFilter?.filter(id => id !== optionId);
    
    setAccessibilityFilter(newFilters);
    applyFilters({ accessibility: newFilters });
  };

  const handleDateRangeChange = (value) => {
    setDateRange(value);
    applyFilters({ dateRange: value });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    applyFilters({ sortBy: value });
  };

  const applyFilters = (newFilters) => {
    const filters = {
      searchQuery,
      category: selectedCategory,
      accessibility: accessibilityFilter,
      dateRange,
      sortBy,
      ...newFilters
    };
    onFiltersChange(filters);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setAccessibilityFilter([]);
    setDateRange('');
    setSortBy('modified');
    onFiltersChange({
      searchQuery: '',
      category: '',
      accessibility: [],
      dateRange: '',
      sortBy: 'modified'
    });
  };

  const hasActiveFilters = searchQuery || selectedCategory || accessibilityFilter?.length > 0 || dateRange;

  return (
    <div className="bg-surface border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Filters</h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-200"
          >
            <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
          </button>
        </div>

        {/* Results Summary */}
        <div className="text-sm text-text-secondary">
          {filteredCount === totalPalettes ? (
            `${totalPalettes} palettes`
          ) : (
            `${filteredCount} of ${totalPalettes} palettes`
          )}
        </div>
      </div>
      {/* Filter Content */}
      <div className={`flex-1 overflow-y-auto ${!isExpanded ? 'hidden lg:block' : ''}`}>
        <div className="p-4 space-y-6">
          {/* Search */}
          <div>
            <Input
              type="search"
              placeholder="Search palettes, colors, tags..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>

          {/* Quick Sort */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Sort By
            </label>
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={handleSortChange}
              placeholder="Select sorting"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Category
            </label>
            <Select
              options={categoryOptions}
              value={selectedCategory}
              onChange={handleCategoryChange}
              placeholder="All categories"
            />
          </div>

          {/* Accessibility Compliance */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Accessibility
            </label>
            <div className="space-y-3">
              {accessibilityOptions?.map((option) => (
                <div key={option?.id} className="flex items-center justify-between">
                  <Checkbox
                    label={option?.label}
                    checked={accessibilityFilter?.includes(option?.id)}
                    onChange={(e) => handleAccessibilityChange(option?.id, e?.target?.checked)}
                  />
                  <span className="text-xs text-text-secondary bg-muted px-2 py-1 rounded-full">
                    {option?.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Created
            </label>
            <Select
              options={dateRangeOptions}
              value={dateRange}
              onChange={handleDateRangeChange}
              placeholder="All time"
            />
          </div>

          {/* Color Search */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Contains Colors
            </label>
            <div className="grid grid-cols-6 gap-2">
              {['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']?.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border-2 border-border hover:border-primary transition-colors duration-200"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <Input
              type="text"
              placeholder="#hex or color name"
              className="mt-2"
            />
          </div>
        </div>
      </div>
      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            iconName="X"
            iconPosition="left"
            fullWidth
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;