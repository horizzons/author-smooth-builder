
import { router } from '../trpc';
import { sitesRouter } from './sites';
import { profilesRouter } from './profiles';
import { templatesRouter } from './templates';

export const appRouter = router({
  sites: sitesRouter,
  profiles: profilesRouter,
  templates: templatesRouter,
});

export type AppRouter = typeof appRouter;
