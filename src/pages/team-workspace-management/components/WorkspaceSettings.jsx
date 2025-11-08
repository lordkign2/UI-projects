import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const WorkspaceSettings = ({ workspace, onUpdate }) => {
  const [settings, setSettings] = useState({
    name: workspace?.name || 'Design Team Workspace',
    description: workspace?.description || 'Collaborative color palette workspace for design team',
    defaultRole: workspace?.defaultRole || 'editor',
    allowGuestAccess: workspace?.allowGuestAccess || false,
    requireApproval: workspace?.requireApproval || true,
    enableNotifications: workspace?.enableNotifications || true,
    autoSaveInterval: workspace?.autoSaveInterval || '30s',
    maxPalettes: workspace?.maxPalettes || 100,
    retentionPeriod: workspace?.retentionPeriod || '1y'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const roleOptions = [
    { value: 'admin', label: 'Admin', description: 'Manage members and settings' },
    { value: 'editor', label: 'Editor', description: 'Create and edit palettes' },
    { value: 'viewer', label: 'Viewer', description: 'View palettes only' }
  ];

  const autoSaveOptions = [
    { value: '10s', label: '10 seconds' },
    { value: '30s', label: '30 seconds' },
    { value: '1m', label: '1 minute' },
    { value: '5m', label: '5 minutes' },
    { value: 'manual', label: 'Manual only' }
  ];

  const retentionOptions = [
    { value: '30d', label: '30 days' },
    { value: '90d', label: '90 days' },
    { value: '6m', label: '6 months' },
    { value: '1y', label: '1 year' },
    { value: 'never', label: 'Never delete' }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(settings);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update workspace settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSettings({
      name: workspace?.name || 'Design Team Workspace',
      description: workspace?.description || 'Collaborative color palette workspace for design team',
      defaultRole: workspace?.defaultRole || 'editor',
      allowGuestAccess: workspace?.allowGuestAccess || false,
      requireApproval: workspace?.requireApproval || true,
      enableNotifications: workspace?.enableNotifications || true,
      autoSaveInterval: workspace?.autoSaveInterval || '30s',
      maxPalettes: workspace?.maxPalettes || 100,
      retentionPeriod: workspace?.retentionPeriod || '1y'
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Workspace Info */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Workspace Settings</h2>
            <p className="text-sm text-text-secondary">Configure your workspace preferences</p>
          </div>
          {!isEditing ? (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              iconName="Settings"
              iconPosition="left"
            >
              Edit Settings
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                variant="default"
                onClick={handleSave}
                loading={isSaving}
                iconName="Check"
                iconPosition="left"
              >
                Save Changes
              </Button>
              <Button
                variant="ghost"
                onClick={handleCancel}
                disabled={isSaving}
                iconName="X"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Input
            label="Workspace Name"
            type="text"
            value={settings?.name}
            onChange={(e) => setSettings(prev => ({ ...prev, name: e?.target?.value }))}
            disabled={!isEditing}
            className="mb-4"
          />

          <Input
            label="Description"
            type="text"
            value={settings?.description}
            onChange={(e) => setSettings(prev => ({ ...prev, description: e?.target?.value }))}
            disabled={!isEditing}
            description="Brief description of your workspace purpose"
            className="mb-4"
          />

          <Select
            label="Default Role for New Members"
            description="Role automatically assigned to new team members"
            options={roleOptions}
            value={settings?.defaultRole}
            onChange={(value) => setSettings(prev => ({ ...prev, defaultRole: value }))}
            disabled={!isEditing}
            className="mb-4"
          />
        </div>
      </div>
      {/* Access & Security */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Access & Security</h3>
        
        <div className="space-y-4">
          <Checkbox
            label="Allow guest access"
            description="Enable temporary access for external collaborators"
            checked={settings?.allowGuestAccess}
            onChange={(e) => setSettings(prev => ({ ...prev, allowGuestAccess: e?.target?.checked }))}
            disabled={!isEditing}
          />

          <Checkbox
            label="Require approval for new members"
            description="New members need admin approval before joining"
            checked={settings?.requireApproval}
            onChange={(e) => setSettings(prev => ({ ...prev, requireApproval: e?.target?.checked }))}
            disabled={!isEditing}
          />

          <Checkbox
            label="Enable email notifications"
            description="Send notifications for workspace activities"
            checked={settings?.enableNotifications}
            onChange={(e) => setSettings(prev => ({ ...prev, enableNotifications: e?.target?.checked }))}
            disabled={!isEditing}
          />
        </div>
      </div>
      {/* Collaboration Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Collaboration Settings</h3>
        
        <div className="space-y-4">
          <Select
            label="Auto-save Interval"
            description="How frequently to save palette changes"
            options={autoSaveOptions}
            value={settings?.autoSaveInterval}
            onChange={(value) => setSettings(prev => ({ ...prev, autoSaveInterval: value }))}
            disabled={!isEditing}
            className="mb-4"
          />

          <Input
            label="Maximum Palettes per Workspace"
            type="number"
            value={settings?.maxPalettes}
            onChange={(e) => setSettings(prev => ({ ...prev, maxPalettes: parseInt(e?.target?.value) }))}
            disabled={!isEditing}
            description="Limit the number of palettes that can be created"
            min="1"
            max="1000"
            className="mb-4"
          />

          <Select
            label="Data Retention Period"
            description="How long to keep deleted palettes in trash"
            options={retentionOptions}
            value={settings?.retentionPeriod}
            onChange={(value) => setSettings(prev => ({ ...prev, retentionPeriod: value }))}
            disabled={!isEditing}
            className="mb-4"
          />
        </div>
      </div>
      {/* Workspace Analytics */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Workspace Analytics</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-text-primary">24</div>
            <div className="text-sm text-text-secondary">Total Palettes</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-text-primary">156</div>
            <div className="text-sm text-text-secondary">Colors Created</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-text-primary">89</div>
            <div className="text-sm text-text-secondary">Collaborations</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-text-primary">12</div>
            <div className="text-sm text-text-secondary">Active Members</div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-text-primary">Recent Activity</h4>
              <p className="text-sm text-text-secondary">Last 7 days</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="BarChart3"
              iconPosition="left"
            >
              View Full Report
            </Button>
          </div>
        </div>
      </div>
      {/* Danger Zone */}
      <div className="bg-card border border-error/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-error mb-4">Danger Zone</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-error/5 rounded-lg">
            <div>
              <h4 className="font-medium text-text-primary">Transfer Ownership</h4>
              <p className="text-sm text-text-secondary">Transfer workspace ownership to another admin</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-error text-error hover:bg-error hover:text-error-foreground"
            >
              Transfer
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-error/5 rounded-lg">
            <div>
              <h4 className="font-medium text-text-primary">Delete Workspace</h4>
              <p className="text-sm text-text-secondary">Permanently delete this workspace and all its data</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
            >
              Delete Workspace
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettings;