
import { BaseService } from './baseService';
import { ApiResponse } from '../types';
import { supabase, withTimeout, errorInterceptor } from '../client';
import { Database } from '@/integrations/supabase/types';

// Explicitly use the Row type from Database for clarity
type SiteRow = Database['public']['Tables']['sites']['Row'];

class SitesService extends BaseService<'sites'> {
  constructor() {
    super('sites');
  }

  /**
   * Get sites for the current user
   */
  async getUserSites(): Promise<ApiResponse<SiteRow[]>> {
    try {
      const result = await withTimeout<SiteRow[]>(
        supabase
          .from(this.tableName)
          .select('*')
          .order('created_at', { ascending: false })
      );

      if (result.error) throw result.error;

      return { data: result.data, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }

  /**
   * Check if a subdomain is available
   * @param subdomain Subdomain to check
   */
  async checkSubdomainAvailability(subdomain: string): Promise<ApiResponse<boolean>> {
    try {
      const result = await withTimeout<any>(
        supabase
          .from(this.tableName)
          .select('id')
          .eq('subdomain', subdomain)
          .maybeSingle()
      );

      if (result.error) throw result.error;

      return { data: !result.data, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }
}

export const sitesService = new SitesService();
