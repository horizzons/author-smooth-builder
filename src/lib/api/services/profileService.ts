
import { BaseService } from './baseService';
import { ProfileService, ApiResponse } from '../types';
import { supabase, withTimeout, errorInterceptor } from '../client';

class ProfilesService extends BaseService<ProfileService> {
  constructor() {
    super('profiles');
  }

  /**
   * Get the current user's profile
   */
  async getCurrentProfile(): Promise<ApiResponse<ProfileService>> {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session?.user.id) {
        throw new Error('User not authenticated');
      }
      
      const userId = session.session.user.id;
      
      const { data, error } = await withTimeout(
        supabase
          .from(this.tableName as 'profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()
      );

      if (error) throw error;

      // Transform to match ProfileService type
      const profile: ProfileService = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        avatarUrl: data.avatar_url,
        user: session.session.user ? {
          id: session.session.user.id,
          email: session.session.user.email || '',
          firstName: data.first_name || undefined,
          lastName: data.last_name || undefined,
          avatarUrl: data.avatar_url || undefined,
        } : null
      };

      return { data: profile, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }

  /**
   * Update the current user's profile
   * @param profile Profile data to update
   */
  async updateProfile(profile: Partial<ProfileService>): Promise<ApiResponse<ProfileService>> {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session?.user.id) {
        throw new Error('User not authenticated');
      }
      
      // Transform to match database column names
      const dbProfile = {
        first_name: profile.firstName,
        last_name: profile.lastName,
        avatar_url: profile.avatarUrl,
      };
      
      const { data, error } = await withTimeout(
        supabase
          .from(this.tableName as 'profiles')
          .update(dbProfile)
          .eq('id', session.session.user.id)
          .select()
          .maybeSingle()
      );

      if (error) throw error;

      // Transform to match ProfileService type
      const updatedProfile: ProfileService = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        avatarUrl: data.avatar_url,
        user: session.session.user ? {
          id: session.session.user.id,
          email: session.session.user.email || '',
          firstName: data.first_name || undefined,
          lastName: data.last_name || undefined,
          avatarUrl: data.avatar_url || undefined,
        } : null
      };

      return { data: updatedProfile, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }

  /**
   * Upload a profile avatar
   * @param file File to upload
   */
  async uploadAvatar(file: File): Promise<ApiResponse<string>> {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session?.user.id) {
        throw new Error('User not authenticated');
      }
      
      const userId = session.session.user.id;
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/avatar.${fileExt}`;
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('site_assets')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('site_assets')
        .getPublicUrl(filePath);
      
      const avatarUrl = urlData.publicUrl;
      
      // Update the profile with the new avatar URL
      await this.updateProfile({ avatarUrl });
      
      return { data: avatarUrl, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }
}

export const profilesService = new ProfilesService();
