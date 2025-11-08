import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const TeamPresence = ({ workspaceId = 'default', maxVisible = 4 }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock real-time team data - in production, this would connect to WebSocket
  useEffect(() => {
    const mockMembers = [
      {
        id: 'user-1',
        name: 'Sarah Chen',
        initials: 'SC',
        avatar: null,
        status: 'active',
        lastSeen: new Date(),
        cursor: { x: 245, y: 120 },
        currentTool: 'color-picker',
        color: '#059669'
      },
      {
        id: 'user-2',
        name: 'Mike Rodriguez',
        initials: 'MR',
        avatar: null,
        status: 'active',
        lastSeen: new Date(),
        cursor: { x: 450, y: 280 },
        currentTool: 'accessibility-check',
        color: '#2563EB'
      },
      {
        id: 'user-3',
        name: 'Emma Thompson',
        initials: 'ET',
        avatar: null,
        status: 'idle',
        lastSeen: new Date(Date.now() - 300000), // 5 minutes ago
        cursor: null,
        currentTool: null,
        color: '#D97706'
      },
      {
        id: 'user-4',
        name: 'Alex Kim',
        initials: 'AK',
        avatar: null,
        status: 'active',
        lastSeen: new Date(),
        cursor: { x: 320, y: 180 },
        currentTool: 'export-preview',
        color: '#DC2626'
      },
      {
        id: 'user-5',
        name: 'Jordan Smith',
        initials: 'JS',
        avatar: null,
        status: 'away',
        lastSeen: new Date(Date.now() - 900000), // 15 minutes ago
        cursor: null,
        currentTool: null,
        color: '#0EA5E9'
      }
    ];

    setTeamMembers(mockMembers);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setTeamMembers(prev => prev?.map(member => ({
        ...member,
        cursor: member?.status === 'active' ? {
          x: Math.random() * 800,
          y: Math.random() * 600
        } : null,
        lastSeen: member?.status === 'active' ? new Date() : member?.lastSeen
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [workspaceId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'idle': return 'bg-warning';
      case 'away': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const getStatusLabel = (status, lastSeen) => {
    switch (status) {
      case 'active': return 'Active now';
      case 'idle': return 'Idle';
      case 'away': {
        const minutesAgo = Math.floor((Date.now() - lastSeen?.getTime()) / 60000);
        return `Away ${minutesAgo}m ago`;
      }
      default: return 'Offline';
    }
  };

  const visibleMembers = teamMembers?.slice(0, maxVisible);
  const hiddenCount = Math.max(0, teamMembers?.length - maxVisible);

  return (
    <div className="relative">
      {/* Compact View */}
      <div className="flex items-center space-x-2">
        {/* Member Avatars */}
        <div className="flex -space-x-2">
          {visibleMembers?.map((member) => (
            <div
              key={member?.id}
              className="relative group"
              onMouseEnter={() => setIsExpanded(true)}
              onMouseLeave={() => setIsExpanded(false)}
            >
              <div
                className="w-8 h-8 rounded-full border-2 border-surface flex items-center justify-center text-xs font-medium text-white shadow-soft cursor-pointer transition-transform duration-200 hover:scale-110 hover:z-10"
                style={{ backgroundColor: member?.color }}
                title={`${member?.name} - ${getStatusLabel(member?.status, member?.lastSeen)}`}
              >
                {member?.initials}
              </div>
              
              {/* Status Indicator */}
              <div 
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface ${getStatusColor(member?.status)}`}
              />

              {/* Activity Pulse for Active Users */}
              {member?.status === 'active' && (
                <div className="absolute inset-0 rounded-full border-2 border-accent animate-ping opacity-30" />
              )}
            </div>
          ))}
        </div>

        {/* Overflow Indicator */}
        {hiddenCount > 0 && (
          <div 
            className="w-8 h-8 rounded-full bg-muted border-2 border-surface flex items-center justify-center text-xs font-medium text-text-secondary cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            onClick={() => setIsExpanded(!isExpanded)}
            title={`${hiddenCount} more team members`}
          >
            +{hiddenCount}
          </div>
        )}

        {/* Team Status Summary */}
        <div className="hidden sm:flex items-center space-x-1 text-xs text-text-secondary">
          <Icon name="Users" size={12} />
          <span>{teamMembers?.filter(m => m?.status === 'active')?.length} active</span>
        </div>
      </div>
      {/* Expanded View */}
      {isExpanded && (
        <div 
          className="absolute top-full right-0 mt-2 w-72 bg-popover border border-border rounded-lg shadow-soft-lg z-50 animate-scale-in"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Team Members</h3>
              <span className="text-xs text-text-secondary">
                {teamMembers?.length} total
              </span>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {teamMembers?.map((member) => (
                <div key={member?.id} className="flex items-center space-x-3">
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-white shadow-soft"
                      style={{ backgroundColor: member?.color }}
                    >
                      {member?.initials}
                    </div>
                    <div 
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-popover ${getStatusColor(member?.status)}`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {member?.name}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        member?.status === 'active' ?'bg-success/10 text-success' 
                          : member?.status === 'idle' ?'bg-warning/10 text-warning' :'bg-muted text-text-secondary'
                      }`}>
                        {getStatusLabel(member?.status, member?.lastSeen)}
                      </span>
                    </div>
                    
                    {member?.currentTool && (
                      <p className="text-xs text-text-secondary mt-1">
                        Using {member?.currentTool?.replace('-', ' ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Workspace Actions */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg transition-colors duration-200">
                  <Icon name="UserPlus" size={14} />
                  <span>Invite</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg transition-colors duration-200">
                  <Icon name="Settings" size={14} />
                  <span>Manage</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPresence;