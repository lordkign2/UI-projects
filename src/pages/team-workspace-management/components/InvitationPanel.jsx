import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const InvitationPanel = ({ onInvite, onGenerateLink }) => {
  const [inviteMode, setInviteMode] = useState('email'); // 'email' or 'link'
  const [emailInput, setEmailInput] = useState('');
  const [selectedRole, setSelectedRole] = useState('editor');
  const [linkExpiration, setLinkExpiration] = useState('7d');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { value: 'admin', label: 'Admin', description: 'Manage members and settings' },
    { value: 'editor', label: 'Editor', description: 'Create and edit palettes' },
    { value: 'viewer', label: 'Viewer', description: 'View palettes only' }
  ];

  const expirationOptions = [
    { value: '1h', label: '1 Hour' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: 'never', label: 'Never Expires' }
  ];

  const handleEmailInvite = async () => {
    if (!emailInput?.trim()) return;

    setIsLoading(true);
    try {
      // Parse multiple emails
      const emails = emailInput?.split(',')?.map(email => email?.trim())?.filter(Boolean);
      await onInvite(emails, selectedRole);
      setEmailInput('');
    } catch (error) {
      console.error('Failed to send invitations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    setIsLoading(true);
    try {
      const link = await onGenerateLink(selectedRole, linkExpiration);
      setGeneratedLink(link);
    } catch (error) {
      console.error('Failed to generate link:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard?.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Invite Team Members</h2>
          <p className="text-sm text-text-secondary">Add new members to your workspace</p>
        </div>
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setInviteMode('email')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              inviteMode === 'email' ?'bg-surface text-text-primary shadow-soft' :'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Icon name="Mail" size={16} className="mr-2" />
            Email
          </button>
          <button
            onClick={() => setInviteMode('link')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              inviteMode === 'link' ?'bg-surface text-text-primary shadow-soft' :'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Icon name="Link" size={16} className="mr-2" />
            Link
          </button>
        </div>
      </div>
      {inviteMode === 'email' ? (
        <div className="space-y-4">
          <Input
            label="Email Addresses"
            type="email"
            placeholder="Enter email addresses (comma-separated)"
            description="You can invite multiple people by separating emails with commas"
            value={emailInput}
            onChange={(e) => setEmailInput(e?.target?.value)}
            className="mb-4"
          />

          <Select
            label="Default Role"
            description="Role assigned to invited members"
            options={roleOptions}
            value={selectedRole}
            onChange={setSelectedRole}
            className="mb-4"
          />

          <Button
            variant="default"
            onClick={handleEmailInvite}
            loading={isLoading}
            disabled={!emailInput?.trim()}
            iconName="Send"
            iconPosition="left"
            fullWidth
          >
            Send Invitations
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Role"
              options={roleOptions}
              value={selectedRole}
              onChange={setSelectedRole}
            />

            <Select
              label="Link Expiration"
              options={expirationOptions}
              value={linkExpiration}
              onChange={setLinkExpiration}
            />
          </div>

          <Button
            variant="default"
            onClick={handleGenerateLink}
            loading={isLoading}
            iconName="Link"
            iconPosition="left"
            fullWidth
          >
            Generate Invitation Link
          </Button>

          {generatedLink && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-text-primary">
                  Invitation Link
                </label>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => copyToClipboard(generatedLink)}
                  iconName="Copy"
                >
                  Copy
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={generatedLink}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm bg-input border border-border rounded-md text-text-secondary"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(generatedLink)}
                  iconName="ExternalLink"
                >
                  Share
                </Button>
              </div>
              <p className="text-xs text-text-secondary mt-2">
                This link will expire in {expirationOptions?.find(opt => opt?.value === linkExpiration)?.label?.toLowerCase()}
              </p>
            </div>
          )}
        </div>
      )}
      {/* Recent Invitations */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-sm font-medium text-text-primary mb-3">Recent Invitations</h3>
        <div className="space-y-2">
          {[
            { email: 'sarah.chen@example.com', status: 'pending', sentAt: '2025-08-05T10:30:00Z' },
            { email: 'mike.rodriguez@example.com', status: 'accepted', sentAt: '2025-08-04T15:45:00Z' },
            { email: 'emma.thompson@example.com', status: 'expired', sentAt: '2025-08-01T09:15:00Z' }
          ]?.map((invitation, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  invitation?.status === 'accepted' ? 'bg-success' :
                  invitation?.status === 'pending' ? 'bg-warning' : 'bg-error'
                }`} />
                <span className="text-sm text-text-primary">{invitation?.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  invitation?.status === 'accepted' ? 'bg-success/10 text-success' :
                  invitation?.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                }`}>
                  {invitation?.status?.charAt(0)?.toUpperCase() + invitation?.status?.slice(1)}
                </span>
                {invitation?.status === 'pending' && (
                  <Button
                    size="xs"
                    variant="ghost"
                    iconName="RotateCcw"
                    className="text-text-secondary hover:text-text-primary"
                  >
                    Resend
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvitationPanel;