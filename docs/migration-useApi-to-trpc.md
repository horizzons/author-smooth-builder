
# Migrating from useApi to tRPC

This guide explains how to migrate from the useApi hook to the new tRPC integration.

## Why Migrate?

tRPC provides:
- Type-safe API calls
- Simplified data fetching
- Integrated caching and revalidation
- Better error handling

## Migration Steps

### 1. Query Example (Fetching Data)

**Before (with useApi):**
```tsx
import { useApi } from '@/hooks/useApi';
import { siteService } from '@/lib/api/services';

function SitesList() {
  const { execute, data: sites, isLoading, error } = useApi();
  
  useEffect(() => {
    execute(async () => await siteService.getAll());
  }, [execute]);
  
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <ul>
      {sites?.map(site => (
        <li key={site.id}>{site.name}</li>
      ))}
    </ul>
  );
}
```

**After (with tRPC):**
```tsx
import { trpc } from '@/utils/trpc';
import { useTrpcQueryState } from '@/hooks/useTrpc';

function SitesList() {
  const sitesQuery = trpc.sites.getAll.useQuery();
  const { isLoading, error, errorMessage } = useTrpcQueryState(sitesQuery);
  
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {errorMessage}</p>;
  
  return (
    <ul>
      {sitesQuery.data?.map(site => (
        <li key={site.id}>{site.name}</li>
      ))}
    </ul>
  );
}
```

### 2. Mutation Example (Creating/Updating Data)

**Before (with useApi):**
```tsx
import { useApi } from '@/hooks/useApi';
import { siteService } from '@/lib/api/services';

function CreateSite() {
  const [name, setName] = useState('');
  const { execute, isLoading, error } = useApi({
    showSuccessToast: true,
    successMessage: 'Site created successfully!'
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await execute(async () => await siteService.create({ name }));
    setName('');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Site'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
```

**After (with tRPC):**
```tsx
import { trpc } from '@/utils/trpc';
import { useTrpcMutation } from '@/hooks/useTrpc';

function CreateSite() {
  const [name, setName] = useState('');
  const utils = trpc.useContext();
  
  const createSiteMutation = useTrpcMutation(
    (input) => trpc.sites.create.mutate(input),
    {
      showSuccessToast: true,
      successMessage: 'Site created successfully!'
    }
  );
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await createSiteMutation.execute({ name });
    if (!error) {
      setName('');
      // Refresh the sites list
      utils.sites.getAll.invalidate();
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button disabled={createSiteMutation.isLoading}>
        {createSiteMutation.isLoading ? 'Creating...' : 'Create Site'}
      </button>
      {createSiteMutation.error && <p>Error: {createSiteMutation.error.message}</p>}
    </form>
  );
}
```

### 3. Advanced Usage with Dependent Queries

**Before (with useApi):**
```tsx
const { execute: fetchSite, data: site } = useApi();
const { execute: fetchTemplates, data: templates } = useApi();

useEffect(() => {
  fetchSite(async () => await siteService.getById(siteId));
}, [fetchSite, siteId]);

useEffect(() => {
  if (site?.templateId) {
    fetchTemplates(async () => await templateService.getRelated(site.templateId));
  }
}, [fetchTemplates, site]);
```

**After (with tRPC):**
```tsx
const { data: site } = trpc.sites.getById.useQuery(siteId);
const { data: templates } = trpc.templates.getRelated.useQuery(
  { templateId: site?.templateId },
  { enabled: !!site?.templateId }
);
```

## Error Handling

The `useTrpcQueryState` hook provides consistent error handling and formatting for all tRPC queries:

```tsx
const query = trpc.sites.getAll.useQuery();
const { isLoading, error, errorMessage } = useTrpcQueryState(query);

// Automatically displays error toast notifications
// Provides formatted error messages
```

## Best Practices

1. Use `useQuery` for data fetching
2. Use `useMutation` for data modifications
3. Use `useContext` and `invalidate` to refresh data after mutations
4. Implement proper loading and error states for all components
5. Use the `useTrpcQueryState` hook for consistent error handling

By following these steps, you'll successfully migrate from useApi to tRPC while maintaining the same user experience.
