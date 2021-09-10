import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { azurePipelinesPlugin, AzurePipelinesPage } from '../src/plugin';

createDevApp()
  .registerPlugin(azurePipelinesPlugin)
  .addPage({
    element: <AzurePipelinesPage />,
    title: 'Root Page',
    path: '/azure-pipelines'
  })
  .render();
