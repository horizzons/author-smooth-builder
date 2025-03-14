
import { supabase, errorInterceptor, withTimeout } from '../client';
import { ApiError, ApiErrorType, ApiResponse } from '../types';
import { Database } from '@/integrations/supabase/types';

// Type for table names in our database
type TableName = keyof Database['public']['Tables'];

// Simplified helpers for getting table types
type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row'];
type TableInsert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
type TableUpdate<T extends TableName> = Database['public']['Tables'][T]['Update'];

export class BaseService<T extends TableName> {
  protected tableName: T;

  constructor(tableName: T) {
    this.tableName = tableName;
  }

  /**
   * Get all records from a table
   */
  async getAll(): Promise<ApiResponse<TableRow<T>[]>> {
    try {
      const result = await withTimeout<TableRow<T>[]>(
        supabase.from(this.tableName).select('*')
      );

      if (result.error) throw result.error;

      return { data: result.data, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }

  /**
   * Get a record by ID
   * @param id Record ID
   */
  async getById(id: string): Promise<ApiResponse<TableRow<T>>> {
    try {
      // Use type assertion for the column name
      const result = await withTimeout<TableRow<T>>(
        supabase
          .from(this.tableName)
          .select('*')
          .eq('id' as any, id)
          .maybeSingle()
      );

      if (result.error) throw result.error;

      return { data: result.data, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }

  /**
   * Create a new record
   * @param record Record data
   */
  async create(record: TableInsert<T>): Promise<ApiResponse<TableRow<T>>> {
    try {
      const result = await withTimeout<TableRow<T>>(
        supabase
          .from(this.tableName)
          .insert(record as any)
          .select()
          .maybeSingle()
      );

      if (result.error) throw result.error;

      return { data: result.data, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }

  /**
   * Update a record
   * @param id Record ID
   * @param record Record data
   */
  async update(id: string, record: TableUpdate<T>): Promise<ApiResponse<TableRow<T>>> {
    try {
      const result = await withTimeout<TableRow<T>>(
        supabase
          .from(this.tableName)
          .update(record as any)
          .eq('id' as any, id)
          .select()
          .maybeSingle()
      );

      if (result.error) throw result.error;

      return { data: result.data, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }

  /**
   * Delete a record
   * @param id Record ID
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    try {
      const result = await withTimeout<null>(
        supabase
          .from(this.tableName)
          .delete()
          .eq('id' as any, id)
      );

      if (result.error) throw result.error;

      return { data: null, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }

  /**
   * Query records with filters
   * @param filters Object containing filter criteria
   */
  async query(filters: Record<string, any>): Promise<ApiResponse<TableRow<T>[]>> {
    try {
      let query = supabase.from(this.tableName).select('*');
      
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key as any, value);
        }
      });
      
      const result = await withTimeout<TableRow<T>[]>(query);

      if (result.error) throw result.error;

      return { data: result.data, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }

  /**
   * Handle API errors
   * @param error Error object
   */
  protected handleError(error: any): ApiError {
    if (error.code === 'PGRST116') {
      return new ApiError('Resource not found', ApiErrorType.VALIDATION, 404);
    }
    
    if (error.code?.startsWith('PGRST')) {
      return new ApiError(error.message, ApiErrorType.VALIDATION, 400);
    }
    
    if (error.code?.startsWith('23')) {
      return new ApiError('Database constraint violation', ApiErrorType.VALIDATION, 400, error);
    }
    
    if (error.status === 401 || error.statusCode === 401) {
      return new ApiError('Authentication required', ApiErrorType.AUTH, 401);
    }
    
    if (error.status === 403 || error.statusCode === 403) {
      return new ApiError('Permission denied', ApiErrorType.AUTH, 403);
    }
    
    if (error.code === 'ECONNABORTED') {
      return new ApiError('Request timeout', ApiErrorType.TIMEOUT, 408);
    }
    
    if (!navigator.onLine) {
      return new ApiError('Network connection lost', ApiErrorType.NETWORK, 0);
    }
    
    return new ApiError(
      error.message || 'An unexpected error occurred',
      ApiErrorType.UNKNOWN,
      error.status || 500,
      error
    );
  }
}
