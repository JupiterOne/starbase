import { createCommand } from 'commander';
import { Clone } from 'nodegit';
import { parseConfigYaml } from '../util/parseConfig';

export function setup() {
  return createCommand('setup')
    .description('clone repositories listed in config.yaml')
    .action(async (options) => {
      console.log(`SETUP`);

      const config = await parseConfigYaml('config.yaml');

      for(const integration of config.integrations) {
        if(integration.git) {
          Clone.clone(integration.git, integration.directory);
        }
      }

  });
}