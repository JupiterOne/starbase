import { createCommand } from 'commander';
import { Clone } from 'nodegit';
import { parseConfigYaml } from '../util/parseConfig';
import { isDirectoryPresent } from '@jupiterone/integration-sdk-runtime';

export function setup() {
  return createCommand('setup')
    .description('clone repositories listed in config.yaml')
    .action(async (options) => {
      const config = await parseConfigYaml('config.yaml');

      for(const integration of config.integrations) {
        if(integration.gitRemoteUrl) {
          if (await isDirectoryPresent(integration.directory)) {
            console.log(`Skipping the following integration that has already been set up:  `, integration.name);
          }
          else {
            await Clone.clone(integration.gitRemoteUrl, integration.directory);
          }
        }
      }

  });
}