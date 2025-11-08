import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import TeamPresence from '../../components/ui/TeamPresence';
import TeamMemberCard from './components/TeamMemberCard';
import InvitationPanel from './components/InvitationPanel';
import WorkspaceSettings from './components/WorkspaceSettings';
import BulkActionsBar from './components/BulkActionsBar';
import TeamFilters from './components/TeamFilters';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const TeamWorkspaceManagement = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('members'); // 'members', 'settings', 'invitations'
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Mock team members data
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 'user-1',
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      initials: 'SC',
      avatar: null,
      role: 'owner',
      status: 'active',
      lastActive: '2025-08-05T12:45:00Z',
      joinedAt: '2025-01-15T09:00:00Z',
      color: '#059669',
      isCurrentUser: true,
      stats: {
        palettesCreated: 12,
        collaborations: 45,
        commentsAdded: 23
      }
    },
    {
      id: 'user-2',
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@example.com',
      initials: 'MR',
      avatar: null,
      role: 'admin',
      status: 'active',
      lastActive: '2025-08-05T12:30:00Z',
      joinedAt: '2025-02-01T10:30:00Z',
      color: '#2563EB',
      isCurrentUser: false,
      stats: {
        palettesCreated: 8,
        collaborations: 32,
        commentsAdded: 18
      }
    },
    {
      id: 'user-3',
      name: 'Emma Thompson',
      email: 'emma.thompson@example.com',
      initials: 'ET',
      avatar: null,
      role: 'editor',
      status: 'idle',
      lastActive: '2025-08-05T11:15:00Z',
      joinedAt: '2025-02-15T14:20:00Z',
      color: '#D97706',
      isCurrentUser: false,
      stats: {
        palettesCreated: 15,
        collaborations: 28,
        commentsAdded: 31
      }
    },
    {
      id: 'user-4',
      name: 'Alex Kim',
      email: 'alex.kim@example.com',
      initials: 'AK',
      avatar: null,
      role: 'editor',
      status: 'active',
      lastActive: '2025-08-05T12:50:00Z',
      joinedAt: '2025-03-01T11:45:00Z',
      color: '#DC2626',
      isCurrentUser: false,
      stats: {
        palettesCreated: 6,
        collaborations: 19,
        commentsAdded: 12
      }
    },
    {
      id: 'user-5',
      name: 'Jordan Smith',
      email: 'jordan.smith@example.com',
      initials: 'JS',
      avatar: null,
      role: 'viewer',
      status: 'away',
      lastActive: '2025-08-05T09:30:00Z',
      joinedAt: '2025-03-15T16:10:00Z',
      color: '#0EA5E9',
      isCurrentUser: false,
      stats: {
        palettesCreated: 2,
        collaborations: 8,
        commentsAdded: 5
      }
    },
    {
      id: 'user-6',
      name: 'Lisa Wang',
      email: 'lisa.wang@example.com',
      initials: 'LW',
      avatar: null,
      role: 'editor',
      status: 'active',
      lastActive: '2025-08-05T12:20:00Z',
      joinedAt: '2025-04-01T13:25:00Z',
      color: '#7C3AED',
      isCurrentUser: false,
      stats: {
        palettesCreated: 9,
        collaborations: 24,
        commentsAdded: 16
      }
    }
  ]);

  const [workspace, setWorkspace] = useState({
    name: 'Design Team Workspace',
    description: 'Collaborative color palette workspace for design team',
    defaultRole: 'editor',
    allowGuestAccess: false,
    requireApproval: true,
    enableNotifications: true,
    autoSaveInterval: '30s',
    maxPalettes: 100,
    retentionPeriod: '1y'
  });

  // Filter and sort team members
  const filteredMembers = teamMembers?.filter(member => {
      const matchesSearch = member?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                           member?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase());
      const matchesRole = roleFilter === 'all' || member?.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || member?.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    })?.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a?.name?.localeCompare(b?.name);
        case 'role':
          const roleOrder = { owner: 0, admin: 1, editor: 2, viewer: 3 };
          return roleOrder?.[a?.role] - roleOrder?.[b?.role];
        case 'joinedAt':
          return new Date(b.joinedAt) - new Date(a.joinedAt);
        case 'lastActive':
          return new Date(b.lastActive) - new Date(a.lastActive);
        default:
          return 0;
      }
    });

  const handleMemberSelect = (memberId, isSelected) => {
    setSelectedMembers(prev => 
      isSelected 
        ? [...prev, memberId]
        : prev?.filter(id => id !== memberId)
    );
  };

  const handleSelectAll = (isSelected) => {
    setSelectedMembers(isSelected ? filteredMembers?.map(m => m?.id) : []);
  };

  const handleBulkRoleChange = (newRole) => {
    setTeamMembers(prev => prev?.map(member => 
      selectedMembers?.includes(member?.id) && member?.role !== 'owner' && !member?.isCurrentUser
        ? { ...member, role: newRole }
        : member
    ));
    setSelectedMembers([]);
  };

  const handleBulkRemove = () => {
    if (window.confirm(`Are you sure you want to remove ${selectedMembers?.length} member(s)?`)) {
      setTeamMembers(prev => prev?.filter(member => 
        !selectedMembers?.includes(member?.id) || member?.role === 'owner' || member?.isCurrentUser
      ));
      setSelectedMembers([]);
    }
  };

  const handleRoleChange = (memberId, newRole) => {
    setTeamMembers(prev => prev?.map(member => 
      member?.id === memberId ? { ...member, role: newRole } : member
    ));
  };

  const handleRemoveMember = (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      setTeamMembers(prev => prev?.filter(member => member?.id !== memberId));
    }
  };

  const handleInvite = async (emails, role) => {
    // Mock invitation logic
    console.log('Inviting emails:', emails, 'with role:', role);
    // In real app, this would send invitations via API
  };

  const handleGenerateLink = async (role, expiration) => {
    // Mock link generation
    const mockLink = `https://palettepigeon.com/invite/${Math.random()?.toString(36)?.substr(2, 9)}`;
    return mockLink;
  };

  const handleWorkspaceUpdate = async (newSettings) => {
    setWorkspace(newSettings);
    // In real app, this would update via API
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
    setSortBy('name');
  };

  const tabs = [
    { id: 'members', label: 'Team Members', icon: 'Users', count: teamMembers?.length },
    { id: 'invitations', label: 'Invitations', icon: 'UserPlus', count: 3 },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className={`
        pt-16 transition-all duration-300
        ${sidebarCollapsed ? 'lg:pr-16' : 'lg:pr-80'}
      `}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <Breadcrumbs />
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  Team Workspace Management
                </h1>
                <p className="text-text-secondary">
                  Manage team members, permissions, and workspace settings
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <TeamPresence workspaceId="main-workspace" maxVisible={4} />
                <Button
                  variant="default"
                  onClick={() => setActiveTab('invitations')}
                  iconName="UserPlus"
                  iconPosition="left"
                >
                  Invite Members
                </Button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-border mb-8">
            <nav className="flex space-x-8">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                    transition-colors duration-200
                    ${activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                    }
                  `}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                  {tab?.count !== undefined && (
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-medium
                      ${activeTab === tab?.id
                        ? 'bg-primary/10 text-primary' :'bg-muted text-text-secondary'
                      }
                    `}>
                      {tab?.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'members' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Team Members List */}
              <div className="xl:col-span-2 space-y-6">
                <TeamFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  roleFilter={roleFilter}
                  onRoleFilterChange={setRoleFilter}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  onClearFilters={clearFilters}
                />

                {/* Select All */}
                <div className="flex items-center justify-between bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedMembers?.length === filteredMembers?.length && filteredMembers?.length > 0}
                      onChange={(e) => handleSelectAll(e?.target?.checked)}
                      className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm font-medium text-text-primary">
                      Select All ({filteredMembers?.length} members)
                    </span>
                  </div>
                  
                  {selectedMembers?.length > 0 && (
                    <span className="text-sm text-text-secondary">
                      {selectedMembers?.length} selected
                    </span>
                  )}
                </div>

                {/* Members Grid */}
                <div className="space-y-4">
                  {filteredMembers?.map((member) => (
                    <TeamMemberCard
                      key={member?.id}
                      member={member}
                      onRoleChange={handleRoleChange}
                      onRemove={handleRemoveMember}
                      isSelected={selectedMembers?.includes(member?.id)}
                      onSelect={handleMemberSelect}
                      canEdit={true}
                    />
                  ))}
                </div>

                {filteredMembers?.length === 0 && (
                  <div className="text-center py-12 bg-card border border-border rounded-lg">
                    <Icon name="Users" size={48} className="mx-auto text-text-secondary mb-4" />
                    <h3 className="text-lg font-medium text-text-primary mb-2">No members found</h3>
                    <p className="text-text-secondary mb-4">
                      Try adjusting your search or filter criteria
                    </p>
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      iconName="RotateCcw"
                      iconPosition="left"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>

              {/* Quick Actions Sidebar */}
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      fullWidth
                      iconName="UserPlus"
                      iconPosition="left"
                      onClick={() => setActiveTab('invitations')}
                    >
                      Invite Members
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      iconName="Settings"
                      iconPosition="left"
                      onClick={() => setActiveTab('settings')}
                    >
                      Workspace Settings
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      iconName="Download"
                      iconPosition="left"
                    >
                      Export Member List
                    </Button>
                  </div>
                </div>

                {/* Team Statistics */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Team Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Total Members</span>
                      <span className="font-medium text-text-primary">{teamMembers?.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Active Now</span>
                      <span className="font-medium text-success">
                        {teamMembers?.filter(m => m?.status === 'active')?.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Admins</span>
                      <span className="font-medium text-text-primary">
                        {teamMembers?.filter(m => m?.role === 'admin' || m?.role === 'owner')?.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Editors</span>
                      <span className="font-medium text-text-primary">
                        {teamMembers?.filter(m => m?.role === 'editor')?.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'invitations' && (
            <div className="max-w-2xl mx-auto">
              <InvitationPanel
                onInvite={handleInvite}
                onGenerateLink={handleGenerateLink}
              />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto">
              <WorkspaceSettings
                workspace={workspace}
                onUpdate={handleWorkspaceUpdate}
              />
            </div>
          )}
        </div>
      </main>
      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedMembers?.length}
        onRoleChange={handleBulkRoleChange}
        onRemove={handleBulkRemove}
        onClearSelection={() => setSelectedMembers([])}
        isVisible={activeTab === 'members'}
      />
      {/* Mobile Bottom Padding */}
      <div className="h-20 lg:hidden" />
    </div>
  );
};

export default TeamWorkspaceManagement;