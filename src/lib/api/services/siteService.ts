
import { BaseService } from './baseService';
import { SiteService, ApiResponse } from '../types';
import { supabase, withTimeout, errorInterceptor } from '../client';

class SitesService extends BaseService<SiteService> {
  constructor() {
    super('sites');
  }

  /**
   * Get sites for the current user
   */
  async getUserSites(): Promise<ApiResponse<SiteService[]>> {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from(this.tableName)
          .select('*')
          .order('created_at', { ascending: false })
      );

      if (error) throw error;

      return { data, error: null };
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
      const { data, error } = await withTimeout(
        supabase
          .from(this.tableName)
          .select('id')
          .eq('subdomain', subdomain)
          .maybeSingle()
      );

      if (error) throw error;

      return { data: !data, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }
}

export const sitesService = new SitesService();
