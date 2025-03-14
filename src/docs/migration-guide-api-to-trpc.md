
# Migration Guide: From useApi to tRPC

This document provides a step-by-step guide for migrating from our custom `useApi` hook to tRPC for API calls.

## Why Migrate?

tRPC offers several advantages:

- **Type Safety**: End-to-end typesafe APIs without schemas or code generation
- **Simplified Data Fetching**: Reduce boilerplate with integrated React Query
- **Better Error Handling**: Standardized error handling across the application
- **Developer Experience**: Auto-completion and type inference in your IDE

## Migration Process

### 1. For Read Operations (GET)

**Before (with useApi):**
```tsx
const { execute, data, isLoading, error } = useApi();

useEffect(() => {
  execute(async () => await siteService.getUserSites());
}, [execute]);
```

**After (with tRPC):**
```tsx
const sitesQuery = trpc.sites.getUserSites.useQuery();
const { isLoading, error, errorMessage } = useTrpcQueryState(sitesQuery);

// Use sitesQuery.data directly in your component
```

### 2. For Write Operations (POST, PUT, DELETE)

**Before (with useApi):**
```tsx
const { execute, isLoading, error } = useApi({
  showSuccessToast: true,
  successMessage: 'Site created successfully!'
});

const handleSubmit = async () => {
  await execute(async () => await siteService.create({ name, subdomain }));
  
  // Manual cache invalidation or data refetch
  refetchData();
};
```

**After (with tRPC):**
```tsx
const utils = trpc.useContext();

const createSiteMutation = useTrpcMutation(
  (input) => {
    const mutation = trpc.sites.createSite.useMutation();
    return mutation.mutateAsync(input);
  },
  {
    showSuccessToast: true,
    successMessage: 'Site created successfully!'
  }
);

const handleSubmit = async () => {
  const { error } = await createSiteMutation.execute({ name, subdomain });
  
  if (!error) {
    // Automatic cache invalidation
    utils.sites.getUserSites.invalidate();
  }
};
```

## Handling Protected Routes

For endpoints that require authentication:

**Before:**
```tsx
// Manual auth token handling or client-side auth checks
const { execute } = useApi({
  requireAuth: true
});
```

**After:**
```tsx
// tRPC handles auth automatically via middleware
const protectedQuery = trpc.sites.getUserSites.useQuery();
// If not authenticated, this will automatically trigger an error
```

## Error Handling

**Before:**
```tsx
if (error) {
  return <div>Error: {error.message}</div>;
}
```

**After:**
```tsx
const { errorMessage } = useTrpcQueryState(query);

if (error) {
  return <div>Error: {errorMessage}</div>;
}
```

## Migration Checklist

1. ✅ Identify all `useApi` usages in your component
2. ✅ Map each API call to the corresponding tRPC procedure
3. ✅ Replace `useApi` with appropriate tRPC hooks
4. ✅ Update error handling to use `useTrpcQueryState`
5. ✅ Ensure all cached data is properly invalidated after mutations
6. ✅ Test thoroughly to ensure feature parity

## Gradual Migration Strategy

You can migrate your application gradually:

1. Start with non-critical components
2. Migrate one component at a time
3. Run both systems in parallel during transition
4. Validate each migration with thorough testing
5. Remove deprecated code once migration is complete

## Need Help?

Refer to:
- Our custom tRPC hooks documentation in `src/lib/trpc/hooks.ts`
- The official tRPC documentation: https://trpc.io/docs
- The React Query documentation: https://tanstack.com/query/latest/docs/react/overview
