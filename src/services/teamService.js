import { supabase } from '../lib/supabase';

class TeamService {
  // Get user's teams
  async getUserTeams() {
    try {
      const { data, error } = await supabase?.from('team_members')?.select(`
          *,
          team:teams(
            *,
            owner:user_profiles!teams_owner_id_fkey(id, full_name, email, avatar_url)
          )
        `)?.order('joined_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data?.map(item => ({
        ...item?.team,
        member_role: item?.role,
        joined_at: item?.joined_at
      })) || [];
    } catch (error) {
      console.error('Error fetching user teams:', error);
      throw error;
    }
  }

  // Get team details with members
  async getTeam(teamId) {
    try {
      const { data, error } = await supabase?.from('teams')?.select(`
          *,
          owner:user_profiles!teams_owner_id_fkey(id, full_name, email, avatar_url),
          team_members(
            *,
            user:user_profiles(id, full_name, email, avatar_url)
          )
        `)?.eq('id', teamId)?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching team:', error);
      throw error;
    }
  }

  // Create a new team
  async createTeam(teamData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase?.from('teams')?.insert([{
          ...teamData,
          owner_id: user?.id
        }])?.select()?.single();

      if (error) {
        throw error;
      }

      // Add creator as team member
      await this.addTeamMember(data?.id, user?.id, 'admin');

      return data;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  }

  // Update team
  async updateTeam(teamId, updates) {
    try {
      const { data, error } = await supabase?.from('teams')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', teamId)?.select()?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating team:', error);
      throw error;
    }
  }

  // Delete team
  async deleteTeam(teamId) {
    try {
      const { error } = await supabase?.from('teams')?.delete()?.eq('id', teamId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error deleting team:', error);
      throw error;
    }
  }

  // Add team member
  async addTeamMember(teamId, userId, role = 'member') {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      
      const { data, error } = await supabase?.from('team_members')?.insert([{
          team_id: teamId,
          user_id: userId,
          role,
          invited_by: user?.id
        }])?.select()?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  }

  // Update team member role
  async updateTeamMemberRole(teamId, userId, role) {
    try {
      const { data, error } = await supabase?.from('team_members')?.update({ role })?.eq('team_id', teamId)?.eq('user_id', userId)?.select()?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating team member role:', error);
      throw error;
    }
  }

  // Remove team member
  async removeTeamMember(teamId, userId) {
    try {
      const { error } = await supabase?.from('team_members')?.delete()?.eq('team_id', teamId)?.eq('user_id', userId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error removing team member:', error);
      throw error;
    }
  }

  // Search users for team invitation
  async searchUsers(query) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('id, full_name, email, avatar_url')?.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)?.limit(10);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }
}

export const teamService = new TeamService();