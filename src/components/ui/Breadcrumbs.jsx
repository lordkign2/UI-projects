import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumbs = ({ customBreadcrumbs = null }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeLabels = {
    '/': 'Home',
    '/collaborative-palette-canvas': 'Canvas',
    '/accessibility-validation-dashboard': 'Accessibility',
    '/team-workspace-management': 'Team Settings',
    '/palette-library-organization': 'Library',
    '/export-integration-hub': 'Export',
    '/authentication-login-register': 'Authentication'
  };

  const routeIcons = {
    '/': 'Home',
    '/collaborative-palette-canvas': 'Palette',
    '/accessibility-validation-dashboard': 'Shield',
    '/team-workspace-management': 'Users',
    '/palette-library-organization': 'FolderOpen',
    '/export-integration-hub': 'Download',
    '/authentication-login-register': 'LogIn'
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [{ label: 'Workspace', path: '/', icon: 'Home' }];

    let currentPath = '';
    pathSegments?.forEach((segment) => {
      currentPath += `/${segment}`;
      const label = routeLabels?.[currentPath] || segment?.replace(/-/g, ' ')?.replace(/\b\w/g, l => l?.toUpperCase());
      const icon = routeIcons?.[currentPath] || 'ChevronRight';
      
      breadcrumbs?.push({
        label,
        path: currentPath,
        icon
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  const handleNavigation = (path, index) => {
    if (index < breadcrumbs?.length - 1) {
      navigate(path);
    }
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((crumb, index) => {
          const isLast = index === breadcrumbs?.length - 1;
          const isClickable = !isLast && crumb?.path;

          return (
            <li key={crumb?.path || index} className="flex items-center space-x-2">
              {index > 0 && (
                <Icon 
                  name="ChevronRight" 
                  size={14} 
                  className="text-border" 
                />
              )}
              <div className="flex items-center space-x-1.5">
                <Icon 
                  name={crumb?.icon} 
                  size={14} 
                  className={isLast ? 'text-text-primary' : 'text-text-secondary'} 
                />
                
                {isClickable ? (
                  <button
                    onClick={() => handleNavigation(crumb?.path, index)}
                    className="hover:text-text-primary transition-colors duration-200 font-medium"
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {crumb?.label}
                  </button>
                ) : (
                  <span 
                    className={`font-medium ${isLast ? 'text-text-primary' : 'text-text-secondary'}`}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {crumb?.label}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;