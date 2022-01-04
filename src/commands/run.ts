import { isDirectoryPresent } from '@jupiterone/integration-sdk-runtime';
import { exec } from 'child_process';
import { createCommand } from 'commander';
import { promises as fs } from 'fs';
import * as path from 'path';
import { parseConfigYaml } from '../util/parseConfig';
import * as util from 'util';

const exec_promise = util.promisify(exec);

export function run() {
  return createCommand('run')
    .description('collect and upload entities and relationships')
    .action(async (options) => {
      const config = await parseConfigYaml('config.yaml');

      if (config.storage) {
        //set up .env for storage configuration
        await fs.writeFile(
          '.env',
          `
          NEO4J_URI=${config.storage.config.uri}
          NEO4J_USER=${config.storage.config.username}
          NEO4J_PASSWORD=${config.storage.config.password}
        `,
        );
      }

      for (const integration of config.integrations) {
        if (await isDirectoryPresent(integration.directory)) {
          // Set up .env file prior to calling `yarn start`
          let configArray = Object.keys(integration.config).map(function (
            configEntryName,
          ) {
            let configArr = `${configEntryName}=${integration.config[configEntryName]}\n`;
            return configArr;
          });
          await fs.writeFile(
            path.join(integration.directory, '.env'),
            configArray,
          );
          let startExec =  await exec_promise(`yarn --cwd ${integration.directory} start;`);
          if(startExec && startExec.stdout) {
            console.log(startExec.stdout);
          }

          // And finally call command to save if we have a storage endpoint defined.
          if (config.storage) {
            if (config.storage.engine == 'neo4j') {
              let pushNeo4jExec =  await exec_promise(
                `yarn j1-integration neo4j push -i ${integration.instanceId} -d ${integration.directory}/.j1-integration`,
              );
              if(pushNeo4jExec && pushNeo4jExec.stdout) {
                console.log(pushNeo4jExec.stdout)
              }
            } else {
              console.log(
                'SKIPPING.  Neo4j is the only storage engine supported at this time.',
                integration.directory,
              );
            }
          }
        } else {
          console.log(
            'SKIPPING due to missing directory ',
            integration.directory,
          );
        }
      }
    });
}
