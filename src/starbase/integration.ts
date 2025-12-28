import {
  JupiterOneStorage,
  StarbaseConfig,
  StarbaseIntegration,
} from './types';
import { executeWithLogging } from './process';
import { StarbaseConfigurationError } from './error';

async function collectIntegrationData(integrationDirectory: string) {
  await executeWithLogging(
    `yarn --cwd ${integrationDirectory} start --disable-schema-validation`,
  );
}

async function writeIntegrationDataToNeo4j(
  integrationInstanceId: string,
  integrationDirectory: string,
  integrationDatabase: string = 'neo4j',
) {
  await executeWithLogging(
    `yarn j1-integration neo4j push -i ${integrationInstanceId} -d ${integrationDirectory}/.j1-integration -db ${integrationDatabase}`,
  );
}

async function writeIntegrationDataToMemgraph(
  integrationInstanceId: string,
  integrationDirectory: string,
  integrationDatabase: string = 'memgraph',
) {
  await executeWithLogging(
    `yarn j1-integration memgraph push -i ${integrationInstanceId} -d ${integrationDirectory}/.j1-integration -db ${integrationDatabase}`,
  );
}

async function writeIntegrationDataToJupiterOne(
  integrationInstanceId: string,
  integrationDirectory: string,
  storageConfig: JupiterOneStorage,
) {
  const optApiUrl = storageConfig.config.apiBaseUrl
    ? `--api-base-url ${storageConfig.config.apiBaseUrl}`
    : '';
  await executeWithLogging(
    `yarn j1-integration sync -i ${integrationInstanceId} -p ${integrationDirectory} ${optApiUrl}`,
  );
}

async function executeIntegration<TConfig>(
  integration: StarbaseIntegration<TConfig>,
  starbaseConfig: StarbaseConfig,
) {
  await collectIntegrationData(integration.directory);

  // TODO: Remove this in favor of custom storage engine handler functions.

  for (const storageConfig of starbaseConfig.storage || []) {
    switch (storageConfig.engine) {
      case 'neo4j':
        await writeIntegrationDataToNeo4j(
          integration.instanceId,
          integration.directory,
          storageConfig.config?.database,
        );
        break;
      case 'memgraph':
        await writeIntegrationDataToMemgraph(
          integration.instanceId,
          integration.directory,
          storageConfig.config?.database,
        );
        break;
      case 'jupiterone':
        await writeIntegrationDataToJupiterOne(
          integration.instanceId,
          integration.directory,
          storageConfig,
        );
        break;
      default:
        throw new StarbaseConfigurationError(
          `Invalid storage engine supplied: '${storageConfig.engine}'.`,
        );
    }
  }
}

export {
  executeIntegration,
  collectIntegrationData,
  writeIntegrationDataToMemgraph,
  writeIntegrationDataToNeo4j,
};
