import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportHistory = ({ onReExport, onDeleteExport }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const exportHistory = [
    {
      id: 'exp-001',
      filename: 'brand-primary-palette.css',
      format: 'CSS Variables',
      formatIcon: 'Code',
      size: '2.4 KB',
      date: new Date(Date.now() - 7200000), // 2 hours ago
      status: 'completed',
      downloads: 3,
      palette: 'Brand Primary',
      version: 'v2.1',
      config: {
        prefix: 'brand',
        format: 'hex',
        includeComments: true
      }
    },
    {
      id: 'exp-002',
      filename: 'design-system-colors.json',
      format: 'JSON',
      formatIcon: 'Braces',
      size: '1.8 KB',
      date: new Date(Date.now() - 86400000), // 1 day ago
      status: 'completed',
      downloads: 7,
      palette: 'Brand Primary',
      version: 'v2.0',
      config: {
        includeAccessibility: true,
        minify: false
      }
    },
    {
      id: 'exp-003',
      filename: 'tailwind-config.js',
      format: 'Tailwind Config',
      formatIcon: 'Wind',
      size: '3.2 KB',
      date: new Date(Date.now() - 172800000), // 2 days ago
      status: 'completed',
      downloads: 12,
      palette: 'Brand Primary',
      version: 'v1.9',
      config: {
        customNaming: true,
        includeComments: true
      }
    },
    {
      id: 'exp-004',
      filename: 'brand-guidelines.pdf',
      format: 'PDF Style Guide',
      formatIcon: 'FileText',
      size: '4.7 MB',
      date: new Date(Date.now() - 259200000), // 3 days ago
      status: 'completed',
      downloads: 5,
      palette: 'Brand Primary',
      version: 'v1.8',
      config: {
        template: 'modern',
        includeTypography: true,
        includeAccessibility: true
      }
    },
    {
      id: 'exp-005',
      filename: 'scss-variables.scss',
      format: 'Sass Variables',
      formatIcon: 'Hash',
      size: '1.9 KB',
      date: new Date(Date.now() - 432000000), // 5 days ago
      status: 'failed',
      downloads: 0,
      palette: 'Brand Primary',
      version: 'v1.7',
      error: 'Export failed due to validation errors'
    }
  ];

  const formatDate = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return '1 day ago';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success bg-success/10';
      case 'failed': return 'text-error bg-error/10';
      case 'processing': return 'text-warning bg-warning/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const filteredHistory = exportHistory?.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'completed') return item?.status === 'completed';
    if (filter === 'failed') return item?.status === 'failed';
    return true;
  });

  const sortedHistory = [...filteredHistory]?.sort((a, b) => {
    if (sortBy === 'date') return b?.date - a?.date;
    if (sortBy === 'downloads') return b?.downloads - a?.downloads;
    if (sortBy === 'size') return parseFloat(b?.size) - parseFloat(a?.size);
    return 0;
  });

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Export History</h3>
          <p className="text-sm text-text-secondary mt-1">
            Track and manage your exported files
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e?.target?.value)}
            className="px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All exports</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="date">Sort by date</option>
            <option value="downloads">Sort by downloads</option>
            <option value="size">Sort by size</option>
          </select>
        </div>
      </div>
      {/* Export Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Download" size={16} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">Total Exports</span>
          </div>
          <div className="text-xl font-semibold text-text-primary mt-1">
            {exportHistory?.length}
          </div>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm text-text-secondary">Successful</span>
          </div>
          <div className="text-xl font-semibold text-text-primary mt-1">
            {exportHistory?.filter(e => e?.status === 'completed')?.length}
          </div>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Eye" size={16} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">Total Downloads</span>
          </div>
          <div className="text-xl font-semibold text-text-primary mt-1">
            {exportHistory?.reduce((sum, e) => sum + e?.downloads, 0)}
          </div>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="HardDrive" size={16} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">Total Size</span>
          </div>
          <div className="text-xl font-semibold text-text-primary mt-1">
            12.0 MB
          </div>
        </div>
      </div>
      {/* Export List */}
      <div className="space-y-3">
        {sortedHistory?.map((export_) => (
          <div key={export_?.id} className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={export_?.formatIcon} size={18} className="text-primary" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-text-primary truncate">{export_?.filename}</h4>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(export_?.status)}`}>
                      {export_?.status}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-text-secondary">
                    <span>{export_?.format}</span>
                    <span>{export_?.size}</span>
                    <span>{formatDate(export_?.date)}</span>
                    {export_?.status === 'completed' && (
                      <span>{export_?.downloads} downloads</span>
                    )}
                  </div>
                  
                  {export_?.error && (
                    <p className="text-sm text-error mt-1">{export_?.error}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                {export_?.status === 'completed' && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Download"
                      title="Download again"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="RefreshCw"
                      onClick={() => onReExport(export_)}
                      title="Re-export with same settings"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Share2"
                      title="Share export"
                    />
                  </>
                )}
                
                {export_?.status === 'failed' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="RefreshCw"
                    onClick={() => onReExport(export_)}
                    title="Retry export"
                  />
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Trash2"
                  onClick={() => onDeleteExport(export_?.id)}
                  title="Delete export"
                  className="text-error hover:text-error"
                />
              </div>
            </div>

            {/* Export Details (Expandable) */}
            <div className="mt-3 pt-3 border-t border-border">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-text-secondary">
                <div>
                  <span className="font-medium">Palette:</span> {export_?.palette}
                </div>
                <div>
                  <span className="font-medium">Version:</span> {export_?.version}
                </div>
                <div>
                  <span className="font-medium">Format:</span> {export_?.format}
                </div>
                <div>
                  <span className="font-medium">Config:</span> {Object.keys(export_?.config)?.length} options
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {sortedHistory?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="FileX" size={48} className="text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">No exports found matching your filter</p>
        </div>
      )}
      {/* Bulk Actions */}
      {sortedHistory?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              {sortedHistory?.length} exports shown
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" iconName="Archive">
                Archive Old
              </Button>
              <Button variant="outline" size="sm" iconName="Trash2">
                Clear Failed
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportHistory;