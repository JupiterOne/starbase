import { createCommand } from 'commander';
import { Repository, Reference } from 'nodegit';
import { parseConfigYaml } from '../util/parseConfig';
import { execSync  } from 'child_process';

// Git pull each integration + install dependencies in children

export function updateIntegrations() {
  return createCommand('update-integrations')
    .description('update repositories listed in config.yaml and install dependencies')
    .action(async (options) => {
      const config = await parseConfigYaml('config.yaml');

      for(const integration of config.integrations) {
        let repo = await Repository.open(integration.directory);
        await repo.fetchAll();
        const localMain: Reference = await repo.getCurrentBranch();
        const originMain = await repo.getBranch('origin/main');
        await repo.mergeBranches(localMain, originMain);
        //Finally, install dependencies
        execSync(`cd ${integration.directory}; yarn install;`);
      }

  });
}