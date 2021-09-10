import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const azurePipelinesPlugin = createPlugin({
  id: 'azure-pipelines',
  routes: {
    root: rootRouteRef,
  },
});

export const AzurePipelinesPage = azurePipelinesPlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
