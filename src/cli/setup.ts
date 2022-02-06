import { createCommand } from 'commander';
import { parseConfigYaml, setupStarbase } from '../starbase';

export function setup() {
  return createCommand('setup')
    .description('bootstraps or updates graph integration projects')
    .action(async (options) => {
      await setupStarbase(await parseConfigYaml('config.yaml'));
    });
}
