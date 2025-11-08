import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const TeamFilters = ({ 
  searchQuery, 
  onSearchChange, 
  roleFilter, 
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  onClearFilters 
}) => {
  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'owner', label: 'Owner' },
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'idle', label: 'Idle' },
    { value: 'away', label: 'Away' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'role', label: 'Role' },
    { value: 'joinedAt', label: 'Join Date' },
    { value: 'lastActive', label: 'Last Active' }
  ];

  const hasActiveFilters = searchQuery || roleFilter !== 'all' || statusFilter !== 'all' || sortBy !== 'name';

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
            />
            <Input
              type="search"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Select
            options={roleOptions}
            value={roleFilter}
            onChange={onRoleFilterChange}
            className="w-full sm:w-32"
          />

          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={onStatusFilterChange}
            className="w-full sm:w-32"
          />

          <Select
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            className="w-full sm:w-32"
          />

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              className="text-text-secondary hover:text-text-primary"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-text-secondary">Active filters:</span>
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <span className="px-2 py-1 bg-accent/10 text-accent rounded-full text-xs">
                  Search: "{searchQuery}"
                </span>
              )}
              {roleFilter !== 'all' && (
                <span className="px-2 py-1 bg-accent/10 text-accent rounded-full text-xs">
                  Role: {roleOptions?.find(opt => opt?.value === roleFilter)?.label}
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="px-2 py-1 bg-accent/10 text-accent rounded-full text-xs">
                  Status: {statusOptions?.find(opt => opt?.value === statusFilter)?.label}
                </span>
              )}
              {sortBy !== 'name' && (
                <span className="px-2 py-1 bg-accent/10 text-accent rounded-full text-xs">
                  Sort: {sortOptions?.find(opt => opt?.value === sortBy)?.label}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamFilters;