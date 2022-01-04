import { isDirectoryPresent } from '@jupiterone/integration-sdk-runtime';
import { createCommand } from 'commander';
import { Clone } from 'nodegit';
import { parseConfigYaml } from '../util/parseConfig';
import { exec } from 'child_process';
import { Reference, Repository } from 'nodegit';

export function setup() {
  return createCommand('setup')
    .description('clone repositories listed in config.yaml')
    .action(async (options) => {
      const config = await parseConfigYaml('config.yaml');

      for (const integration of config.integrations) {
        if (integration.gitRemoteUrl) {
          if (await isDirectoryPresent(integration.directory)) {
            //If the folder already exists, update instead of cloning
            let repo = await Repository.open(integration.directory);
            await repo.fetchAll();
            const localMain: Reference = await repo.getCurrentBranch();
            const originMain = await repo.getBranch('origin/main');
            await repo.mergeBranches(localMain, originMain);
          } else {
            //No folder = clone
            await Clone.clone(integration.gitRemoteUrl, integration.directory);
          }
        }
        //Finally, install dependencies
        await exec(`cd ${integration.directory}; yarn install;`);
      }
    });
}
