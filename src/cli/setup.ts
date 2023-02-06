import { createCommand } from 'commander';
import { parseConfigYaml, setupStarbase } from '../starbase';

export function setup() {
  return createCommand('setup')
    .description('bootstraps or updates graph integration projects')
    .option(
      '-c, --config <path>',
      'optional path to config file',
      'config.yaml',
    )
    .action(async (options) => {
      await setupStarbase(await parseConfigYaml(options.config));
    });
}
