# Project Structure Reorganization Plan

## Why Reorganize?

1. **Current Structure Issues**

   - Limited separation of concerns (all UI components in one folder)
   - No clear organization for feature-specific code
   - Missing dedicated spaces for assets, services, and types
   - No clear distinction between shared and feature-specific components
   - Utility functions mixed with components

2. **Benefits of Reorganization**
   - Better code organization and maintainability
   - Clearer separation of concerns
   - Easier to find and manage related code
   - Better scalability for future features
   - Improved developer experience
   - Type safety with global types
   - Shorter import paths with aliases

## Implementation Steps

### 1. Directory Structure Setup

```bash
src/
  ├── assets/          # Static assets like images, fonts, etc.
  │   ├── images/
  │   └── fonts/
  │
  ├── components/      # Shared/reusable components
  │   ├── common/      # Basic UI elements
  │   └── ui/          # Current shadcn components
  │
  ├── features/        # Feature-specific components and logic
  │   ├── auth/        # Authentication related
  │   └── dashboard/   # Dashboard specific
  │
  ├── layouts/         # Layout components
  │   ├── MainLayout/
  │   └── AuthLayout/
  │
  ├── lib/            # Utility functions and helpers
  │   ├── utils/
  │   └── constants/
  │
  ├── services/       # API and external service integrations
  │   ├── api/
  │   └── http/
  │
  ├── hooks/          # Custom React hooks
  │
  ├── store/          # Zustand store configurations
  │   ├── slices/
  │   └── index.ts
  │
  └── types/          # TypeScript type definitions
      ├── common.ts
      ├── api.ts
      └── env.ts
```

### 2. Path Aliases Setup

1. Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@features/*": ["src/features/*"],
      "@layouts/*": ["src/layouts/*"],
      "@lib/*": ["src/lib/*"],
      "@services/*": ["src/services/*"],
      "@hooks/*": ["src/hooks/*"],
      "@store/*": ["src/store/*"],
      "@types/*": ["src/types/*"],
      "@assets/*": ["src/assets/*"]
    }
  }
}
```

2. Update `vite.config.ts`:

```typescript
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@types': path.resolve(__dirname, './src/types'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
});
```

### 3. Global Types Setup

1. Create base types (`src/types/common.ts`):

```typescript
// Common types used across the application
export type ID = string | number;

export interface BaseEntity {
  id: ID;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
```

2. Create API types (`src/types/api.ts`):

```typescript
import { BaseEntity } from './common';

export interface User extends BaseEntity {
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  token: string;
  user: User;
}
```

### 4. Environment Variable Types

1. Create environment type definitions (`src/types/env.ts`):

```typescript
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_API_KEY: string;
    readonly VITE_ENV: 'development' | 'staging' | 'production';
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
```

2. Create `.env` template:

```env
VITE_API_URL=http://localhost:3000
VITE_API_KEY=your-api-key
VITE_ENV=development
```

## Implementation Strategy

1. **Phase 1: Directory Structure**

   - Create new directories
   - Move existing files to appropriate locations
   - Update imports in moved files

2. **Phase 2: Path Aliases**

   - Configure path aliases
   - Update all import statements
   - Verify build process

3. **Phase 3: Types**

   - Implement global types
   - Add environment type definitions
   - Update existing code to use new types

4. **Phase 4: Testing**
   - Verify all imports work
   - Test build process
   - Check for type errors

## Migration Guidelines

1. Move files one directory at a time
2. Update imports as you move files
3. Run type checks frequently
4. Test the application after each major change
5. Commit changes in logical groups
6. Document any issues or special cases
