import { createCommand } from 'commander';
import { execSync  } from 'child_process';
import { promises as fs } from 'fs';
import * as path from 'path';
import { parseConfigYaml } from '../util/parseConfig';

export function run() {
  return createCommand('run')
    .description('collect and upload entities and relationships')
    .action(async (options) => {
      console.log(`RUN`);

      const config = await parseConfigYaml('config.yaml');

      if(config.storage) {
        //set up .env for storage configuration
        await fs.writeFile('.env', `
          NEO4J_URI=${config.storage.uri}
          NEO4J_USER=${config.storage.username}
          NEO4J_PASSWORD=${config.storage.password}
        `);
      }

      for(const integration of config.integrations) {
        // Set up .env file prior to calling `yarn start`
        await fs.writeFile(path.join(integration.directory, '.env'), integration.config);
        execSync(`cd ${integration.directory}; yarn start;`);

        // And finally call command to save if we have a storage endpoint defined.
        if(config.storage) {
          execSync(`yarn j1-integration neo4j push -i ${integration.instanceID} -d ${integration.directory}/.j1-integration`);
        }
      }
  });
}