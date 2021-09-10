import { azurePipelinesPlugin } from './plugin';

describe('azure-pipelines', () => {
  it('should export plugin', () => {
    expect(azurePipelinesPlugin).toBeDefined();
  });
});
