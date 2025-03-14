
import { BaseService } from './baseService';
import { ApiResponse } from '../types';
import { supabase, withTimeout, errorInterceptor } from '../client';
import { Database } from '@/integrations/supabase/types';

type TemplateRow = Database['public']['Tables']['templates']['Row'];

class TemplatesService extends BaseService<'templates'> {
  constructor() {
    super('templates');
  }

  /**
   * Get all templates
   */
  async getAllTemplates(): Promise<ApiResponse<TemplateRow[]>> {
    try {
      const result = await withTimeout<TemplateRow[]>(
        supabase
          .from(this.tableName)
          .select('*')
          .order('name')
      );

      if (result.error) throw result.error;

      return { data: result.data, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }

  /**
   * Get templates by category
   * @param category Template category
   */
  async getTemplatesByCategory(category: string): Promise<ApiResponse<TemplateRow[]>> {
    try {
      const result = await withTimeout<TemplateRow[]>(
        supabase
          .from(this.tableName)
          .select('*')
          .eq('category', category)
          .order('name')
      );

      if (result.error) throw result.error;

      return { data: result.data, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }
}

export const templatesService = new TemplatesService();
