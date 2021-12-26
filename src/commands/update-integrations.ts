import { isDirectoryPresent } from '@jupiterone/integration-sdk-runtime';
import { exec } from 'child_process';
import { createCommand } from 'commander';
import { Reference, Repository } from 'nodegit';
import { parseConfigYaml } from '../util/parseConfig';

// Git pull each integration + install dependencies in children

export function updateIntegrations() {
  return createCommand('update-integrations')
    .description(
      'update repositories listed in config.yaml and install dependencies',
    )
    .action(async (options) => {
      const config = await parseConfigYaml('config.yaml');

      for (const integration of config.integrations) {
        if (await isDirectoryPresent(integration.directory)) {
          let repo = await Repository.open(integration.directory);
          await repo.fetchAll();
          const localMain: Reference = await repo.getCurrentBranch();
          const originMain = await repo.getBranch('origin/main');
          await repo.mergeBranches(localMain, originMain);
          //Finally, install dependencies
          await exec(`cd ${integration.directory}; yarn install;`);
        } else {
          console.log(
            'WARNING.  Integration has not been set up.  Skipping directory ',
            integration.directory,
          );
        }
      }
    });
}
