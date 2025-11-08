import React, { useState } from 'react';

import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const TeamMemberCard = ({ 
  member, 
  onRoleChange, 
  onRemove, 
  isSelected, 
  onSelect, 
  canEdit = true 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState(member?.role);

  const roleOptions = [
    { value: 'owner', label: 'Owner', description: 'Full workspace control' },
    { value: 'admin', label: 'Admin', description: 'Manage members and settings' },
    { value: 'editor', label: 'Editor', description: 'Create and edit palettes' },
    { value: 'viewer', label: 'Viewer', description: 'View palettes only' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'idle': return 'bg-warning';
      case 'away': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const getStatusLabel = (status, lastActive) => {
    switch (status) {
      case 'active': return 'Active now';
      case 'idle': return 'Idle';
      case 'away': {
        const hoursAgo = Math.floor((Date.now() - new Date(lastActive)?.getTime()) / (1000 * 60 * 60));
        return `Away ${hoursAgo}h ago`;
      }
      default: return 'Offline';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'owner': return 'bg-primary text-primary-foreground';
      case 'admin': return 'bg-accent text-accent-foreground';
      case 'editor': return 'bg-success/10 text-success';
      case 'viewer': return 'bg-muted text-text-secondary';
      default: return 'bg-muted text-text-secondary';
    }
  };

  const handleRoleSubmit = () => {
    onRoleChange(member?.id, selectedRole);
    setIsEditing(false);
  };

  const handleRoleCancel = () => {
    setSelectedRole(member?.role);
    setIsEditing(false);
  };

  return (
    <div className={`
      p-4 bg-card border border-border rounded-lg transition-all duration-200
      ${isSelected ? 'ring-2 ring-primary shadow-soft' : 'hover:shadow-soft'}
    `}>
      <div className="flex items-center space-x-4">
        {/* Selection Checkbox */}
        {canEdit && (
          <div className="flex-shrink-0">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(member?.id, e?.target?.checked)}
              className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
            />
          </div>
        )}

        {/* Avatar and Status */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
            {member?.avatar ? (
              <Image
                src={member?.avatar}
                alt={member?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: member?.color }}
              >
                {member?.initials}
              </div>
            )}
          </div>
          <div 
            className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card ${getStatusColor(member?.status)}`}
            title={getStatusLabel(member?.status, member?.lastActive)}
          />
        </div>

        {/* Member Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-sm font-medium text-text-primary truncate">
              {member?.name}
            </h3>
            {member?.isCurrentUser && (
              <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-full">
                You
              </span>
            )}
          </div>
          
          <p className="text-xs text-text-secondary truncate mb-2">
            {member?.email}
          </p>

          <div className="flex items-center space-x-3 text-xs text-text-secondary">
            <span>Joined {new Date(member.joinedAt)?.toLocaleDateString()}</span>
            <span>•</span>
            <span>{getStatusLabel(member?.status, member?.lastActive)}</span>
          </div>
        </div>

        {/* Role Management */}
        <div className="flex-shrink-0">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Select
                options={roleOptions}
                value={selectedRole}
                onChange={setSelectedRole}
                className="w-32"
              />
              <Button
                size="xs"
                variant="default"
                onClick={handleRoleSubmit}
                iconName="Check"
              />
              <Button
                size="xs"
                variant="ghost"
                onClick={handleRoleCancel}
                iconName="X"
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleBadgeColor(member?.role)}`}>
                {member?.role?.charAt(0)?.toUpperCase() + member?.role?.slice(1)}
              </span>
              {canEdit && member?.role !== 'owner' && !member?.isCurrentUser && (
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  iconName="Edit2"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {canEdit && member?.role !== 'owner' && !member?.isCurrentUser && (
          <div className="flex-shrink-0">
            <Button
              size="xs"
              variant="ghost"
              onClick={() => onRemove(member?.id)}
              iconName="Trash2"
              className="text-error hover:text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        )}
      </div>
      {/* Activity Stats */}
      <div className="mt-3 pt-3 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="text-center">
            <div className="font-medium text-text-primary">{member?.stats?.palettesCreated}</div>
            <div className="text-text-secondary">Palettes</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-text-primary">{member?.stats?.collaborations}</div>
            <div className="text-text-secondary">Collaborations</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-text-primary">{member?.stats?.commentsAdded}</div>
            <div className="text-text-secondary">Comments</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;