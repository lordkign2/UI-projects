import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const primaryNavItems = [
    {
      label: 'Canvas',
      path: '/collaborative-palette-canvas',
      icon: 'Palette',
      description: 'Collaborative workspace'
    },
    {
      label: 'Library',
      path: '/palette-library-organization',
      icon: 'FolderOpen',
      description: 'Palette organization'
    },
    {
      label: 'Accessibility',
      path: '/accessibility-validation-dashboard',
      icon: 'Shield',
      description: 'WCAG validation'
    },
    {
      label: 'Export',
      path: '/export-integration-hub',
      icon: 'Download',
      description: 'Integration hub'
    }
  ];

  const secondaryNavItems = [
    {
      label: 'Team Settings',
      path: '/team-workspace-management',
      icon: 'Users',
      description: 'Workspace management'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMoreMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const teamMembers = [
    { id: 1, name: 'Sarah Chen', initials: 'SC', status: 'active', color: '#059669' },
    { id: 2, name: 'Mike Rodriguez', initials: 'MR', status: 'active', color: '#2563EB' },
    { id: 3, name: 'Emma Thompson', initials: 'ET', status: 'idle', color: '#D97706' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-8">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/collaborative-palette-canvas')}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Palette" size={20} color="white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-text-primary">Palette Pigeon</span>
              <span className="text-xs text-text-secondary -mt-1">Design Workspace</span>
            </div>
          </div>

          {/* Primary Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {primaryNavItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200 min-h-touch hover:bg-muted
                  ${isActivePath(item?.path) 
                    ? 'bg-primary text-primary-foreground shadow-soft' 
                    : 'text-text-secondary hover:text-text-primary'
                  }
                `}
                title={item?.description}
              >
                <Icon 
                  name={item?.icon} 
                  size={16} 
                  color={isActivePath(item?.path) ? 'currentColor' : 'var(--color-text-secondary)'} 
                />
                <span>{item?.label}</span>
              </button>
            ))}

            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-muted transition-all duration-200 min-h-touch"
                title="More options"
              >
                <Icon name="MoreHorizontal" size={16} />
                <span>More</span>
              </button>

              {isMoreMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-soft-lg z-50 animate-scale-in">
                  <div className="p-2">
                    {secondaryNavItems?.map((item) => (
                      <button
                        key={item?.path}
                        onClick={() => handleNavigation(item?.path)}
                        className={`
                          w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm
                          transition-all duration-200 min-h-touch
                          ${isActivePath(item?.path)
                            ? 'bg-primary text-primary-foreground'
                            : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                          }
                        `}
                      >
                        <Icon name={item?.icon} size={16} />
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{item?.label}</span>
                          <span className="text-xs opacity-75">{item?.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Side - Team Presence and Actions */}
        <div className="flex items-center space-x-4">
          {/* Team Presence Indicators */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex -space-x-2">
              {teamMembers?.slice(0, 3)?.map((member) => (
                <div
                  key={member?.id}
                  className="relative w-8 h-8 rounded-full border-2 border-surface flex items-center justify-center text-xs font-medium text-white shadow-soft"
                  style={{ backgroundColor: member?.color }}
                  title={`${member?.name} - ${member?.status}`}
                >
                  {member?.initials}
                  <div 
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface ${
                      member?.status === 'active' ? 'bg-success' : 'bg-warning'
                    }`}
                  />
                </div>
              ))}
            </div>
            {teamMembers?.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-muted border-2 border-surface flex items-center justify-center text-xs font-medium text-text-secondary">
                +{teamMembers?.length - 3}
              </div>
            )}
          </div>

          {/* Share Button */}
          <Button
            variant="outline"
            size="sm"
            iconName="Share2"
            iconPosition="left"
            className="hidden sm:flex"
          >
            Share
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-200"
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            title="Menu"
          >
            <Icon name="Menu" size={20} />
          </button>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMoreMenuOpen && (
        <div className="lg:hidden bg-surface border-t border-border animate-fade-in">
          <div className="p-4 space-y-2">
            {[...primaryNavItems, ...secondaryNavItems]?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium
                  transition-all duration-200 min-h-touch
                  ${isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                  }
                `}
              >
                <Icon name={item?.icon} size={18} />
                <div className="flex flex-col items-start">
                  <span>{item?.label}</span>
                  <span className="text-xs opacity-75">{item?.description}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Mobile Team Presence */}
          <div className="px-4 pb-4 border-t border-border">
            <div className="flex items-center justify-between pt-4">
              <span className="text-sm font-medium text-text-secondary">Team Members</span>
              <div className="flex -space-x-1">
                {teamMembers?.map((member) => (
                  <div
                    key={member?.id}
                    className="w-6 h-6 rounded-full border border-surface flex items-center justify-center text-xs font-medium text-white"
                    style={{ backgroundColor: member?.color }}
                    title={member?.name}
                  >
                    {member?.initials}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Overlay for mobile menu */}
      {isMoreMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden"
          onClick={() => setIsMoreMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;