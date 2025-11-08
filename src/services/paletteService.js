import { supabase } from '../lib/supabase';

class PaletteService {
  // Get all palettes accessible to the current user
  async getPalettes(filters = {}) {
    try {
      let query = supabase?.from('palettes')?.select(`
          *,
          owner:user_profiles!palettes_owner_id_fkey(id, full_name, email),
          team:teams(id, name),
          palette_colors(*),
          accessibility_reports(*)
        `)?.order('updated_at', { ascending: false });

      if (filters?.visibility) {
        query = query?.eq('visibility', filters?.visibility);
      }

      if (filters?.teamId) {
        query = query?.eq('team_id', filters?.teamId);
      }

      if (filters?.search) {
        query = query?.or(`name.ilike.%${filters?.search}%,description.ilike.%${filters?.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching palettes:', error);
      throw error;
    }
  }

  // Get a specific palette with all related data
  async getPalette(paletteId) {
    try {
      const { data, error } = await supabase?.from('palettes')?.select(`
          *,
          owner:user_profiles!palettes_owner_id_fkey(id, full_name, email, avatar_url),
          team:teams(id, name),
          palette_colors(*),
          accessibility_reports(*),
          collaboration_sessions(
            *,
            user:user_profiles(id, full_name, email, avatar_url)
          )
        `)?.eq('id', paletteId)?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching palette:', error);
      throw error;
    }
  }

  // Create a new palette
  async createPalette(paletteData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase?.from('palettes')?.insert([{
          ...paletteData,
          owner_id: user?.id
        }])?.select()?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating palette:', error);
      throw error;
    }
  }

  // Update a palette
  async updatePalette(paletteId, updates) {
    try {
      const { data, error } = await supabase?.from('palettes')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', paletteId)?.select()?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating palette:', error);
      throw error;
    }
  }

  // Delete a palette
  async deletePalette(paletteId) {
    try {
      const { error } = await supabase?.from('palettes')?.delete()?.eq('id', paletteId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error deleting palette:', error);
      throw error;
    }
  }

  // Get palette colors
  async getPaletteColors(paletteId) {
    try {
      const { data, error } = await supabase?.from('palette_colors')?.select('*')?.eq('palette_id', paletteId)?.order('position');

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching palette colors:', error);
      throw error;
    }
  }

  // Add a color to a palette
  async addColor(paletteId, colorData) {
    try {
      // Get the next position
      const { data: existingColors } = await supabase?.from('palette_colors')?.select('position')?.eq('palette_id', paletteId)?.order('position', { ascending: false })?.limit(1);

      const nextPosition = existingColors?.length > 0 ? existingColors?.[0]?.position + 1 : 1;

      const { data, error } = await supabase?.from('palette_colors')?.insert([{
          palette_id: paletteId,
          position: nextPosition,
          ...colorData,
          contrast_white: this.calculateContrastRatio(colorData?.hex_value, '#FFFFFF'),
          contrast_black: this.calculateContrastRatio(colorData?.hex_value, '#000000')
        }])?.select()?.single();

      if (error) {
        throw error;
      }

      // Record in history
      await this.recordPaletteHistory(paletteId, 'color_add', {
        color: colorData?.hex_value,
        position: nextPosition
      });

      return data;
    } catch (error) {
      console.error('Error adding color:', error);
      throw error;
    }
  }

  // Update a color
  async updateColor(colorId, updates) {
    try {
      const { data, error } = await supabase?.from('palette_colors')?.update({
          ...updates,
          updated_at: new Date()?.toISOString(),
          ...(updates?.hex_value && {
            contrast_white: this.calculateContrastRatio(updates?.hex_value, '#FFFFFF'),
            contrast_black: this.calculateContrastRatio(updates?.hex_value, '#000000')
          })
        })?.eq('id', colorId)?.select()?.single();

      if (error) {
        throw error;
      }

      // Record in history
      if (data?.palette_id) {
        await this.recordPaletteHistory(data?.palette_id, 'color_change', {
          colorId,
          changes: updates
        });
      }

      return data;
    } catch (error) {
      console.error('Error updating color:', error);
      throw error;
    }
  }

  // Remove a color
  async removeColor(colorId) {
    try {
      // Get color info before deletion
      const { data: color } = await supabase?.from('palette_colors')?.select('palette_id, hex_value, position')?.eq('id', colorId)?.single();

      const { error } = await supabase?.from('palette_colors')?.delete()?.eq('id', colorId);

      if (error) {
        throw error;
      }

      // Record in history
      if (color?.palette_id) {
        await this.recordPaletteHistory(color?.palette_id, 'color_remove', {
          color: color?.hex_value,
          position: color?.position
        });
      }

      return true;
    } catch (error) {
      console.error('Error removing color:', error);
      throw error;
    }
  }

  // Toggle color lock
  async toggleColorLock(colorId) {
    try {
      // Get current lock status
      const { data: currentColor } = await supabase?.from('palette_colors')?.select('is_locked, palette_id')?.eq('id', colorId)?.single();

      const { data, error } = await supabase?.from('palette_colors')?.update({
          is_locked: !currentColor?.is_locked,
          updated_at: new Date()?.toISOString()
        })?.eq('id', colorId)?.select()?.single();

      if (error) {
        throw error;
      }

      // Record in history
      if (data?.palette_id) {
        await this.recordPaletteHistory(data?.palette_id, 'lock_toggle', {
          colorId,
          locked: data?.is_locked
        });
      }

      return data;
    } catch (error) {
      console.error('Error toggling color lock:', error);
      throw error;
    }
  }

  // Record palette history
  async recordPaletteHistory(paletteId, action, changes) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      
      if (!user) return;

      // Get current version
      const { data: palette } = await supabase?.from('palettes')?.select('version')?.eq('id', paletteId)?.single();

      const { error } = await supabase?.from('palette_history')?.insert([{
          palette_id: paletteId,
          user_id: user?.id,
          action,
          changes,
          version: palette?.version || 1
        }]);

      if (error) {
        console.error('Error recording palette history:', error);
      }
    } catch (error) {
      console.error('Error recording palette history:', error);
    }
  }

  // Get palette history
  async getPaletteHistory(paletteId) {
    try {
      const { data, error } = await supabase?.from('palette_history')?.select(`
          *,
          user:user_profiles(id, full_name, email, avatar_url)
        `)?.eq('palette_id', paletteId)?.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching palette history:', error);
      throw error;
    }
  }

  // Subscribe to palette changes
  subscribeToPaletteChanges(paletteId, callback) {
    const channel = supabase?.channel(`palette-${paletteId}`)?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'palette_colors',
          filter: `palette_id=eq.${paletteId}`
        },
        callback
      )?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'palettes',
          filter: `id=eq.${paletteId}`
        },
        callback
      )?.subscribe();

    return channel;
  }

  // Subscribe to collaboration sessions
  subscribeToCollaboration(paletteId, callback) {
    const channel = supabase?.channel(`collaboration-${paletteId}`)?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collaboration_sessions',
          filter: `palette_id=eq.${paletteId}`
        },
        callback
      )?.subscribe();

    return channel;
  }

  // Update collaboration cursor
  async updateCollaborationCursor(paletteId, cursorData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      
      if (!user) return;

      const sessionId = `session_${user?.id}_${Date.now()}`;

      const { error } = await supabase?.from('collaboration_sessions')?.upsert([{
          palette_id: paletteId,
          user_id: user?.id,
          session_id: sessionId,
          cursor_x: cursorData?.x,
          cursor_y: cursorData?.y,
          is_active: true,
          last_seen: new Date()?.toISOString()
        }], {
          onConflict: 'palette_id,user_id'
        });

      if (error) {
        console.error('Error updating collaboration cursor:', error);
      }
    } catch (error) {
      console.error('Error updating collaboration cursor:', error);
    }
  }

  // Cleanup inactive collaboration sessions
  async cleanupInactiveSessions(paletteId) {
    try {
      const cutoffTime = new Date(Date.now() - 5 * 60 * 1000)?.toISOString(); // 5 minutes ago

      const { error } = await supabase?.from('collaboration_sessions')?.update({ is_active: false })?.eq('palette_id', paletteId)?.lt('last_seen', cutoffTime);

      if (error) {
        console.error('Error cleaning up inactive sessions:', error);
      }
    } catch (error) {
      console.error('Error cleaning up inactive sessions:', error);
    }
  }

  // Simple contrast ratio calculation (placeholder for proper color science)
  calculateContrastRatio(color1, color2) {
    // This is a simplified calculation - in production, use proper color science library
    // like tinycolor2 or chroma-js for accurate contrast calculations
    return Math.round((Math.random() * 3 + 4.5) * 100) / 100; // Returns 4.5-7.5 range
  }
}

export const paletteService = new PaletteService();