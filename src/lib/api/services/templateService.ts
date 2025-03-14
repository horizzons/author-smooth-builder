
import { BaseService } from './baseService';
import { TemplateService as TemplateServiceType, ApiResponse } from '../types';
import { supabase, withTimeout, errorInterceptor } from '../client';

class TemplatesService extends BaseService<TemplateServiceType> {
  constructor() {
    super('templates');
  }

  /**
   * Get all templates
   */
  async getAllTemplates(): Promise<ApiResponse<TemplateServiceType[]>> {
    try {
      const result = await withTimeout<TemplateServiceType[]>(
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
  async getTemplatesByCategory(category: string): Promise<ApiResponse<TemplateServiceType[]>> {
    try {
      const result = await withTimeout<TemplateServiceType[]>(
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

  /**
   * Get template categories
   */
  async getTemplateCategories(): Promise<ApiResponse<string[]>> {
    try {
      const result = await withTimeout<any[]>(
        supabase
          .from(this.tableName)
          .select('category')
          .order('category')
      );

      if (result.error) throw result.error;

      // Extract unique categories
      const categories = [...new Set(result.data.map(item => item.category))];
      
      return { data: categories, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }
}

export const templatesService = new TemplatesService();
