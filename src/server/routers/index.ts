
import { router } from '../trpc';
import { sitesRouter } from './sites';
import { profilesRouter } from './profiles';
import { templatesRouter } from './templates';
import { assetsRouter } from './assets';

export const appRouter = router({
  sites: sitesRouter,
  profiles: profilesRouter,
  templates: templatesRouter,
  assets: assetsRouter,
});

export type AppRouter = typeof appRouter;
