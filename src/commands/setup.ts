import { createCommand } from 'commander';
import { Clone } from 'nodegit';
import { parseConfigYaml } from '../util/parseConfig';

export function setup() {
  return createCommand('setup')
    .description('clone repositories listed in config.yaml')
    .action(async (options) => {
      const config = await parseConfigYaml('config.yaml');

      for(const integration of config.integrations) {
        if(integration.gitRemoteUrl) {
          Clone.clone(integration.gitRemoteUrl, integration.directory);
        }
      }

  });
}