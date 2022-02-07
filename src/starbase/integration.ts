import { StarbaseConfig, StarbaseIntegration } from './types';
import { executeWithLogging } from './process';

async function collectIntegrationData(integrationDirectory: string) {
  await executeWithLogging(`yarn --cwd ${integrationDirectory} start;`);
}

async function writeIntegrationDataToNeo4j(
  integrationInstanceId: string,
  integrationDirectory: string,
) {
  await executeWithLogging(
    `yarn j1-integration neo4j push -i ${integrationInstanceId} -d ${integrationDirectory}/.j1-integration`,
  );
}

async function executeIntegration<TConfig>(
  integration: StarbaseIntegration<TConfig>,
  starbaseConfig: StarbaseConfig,
) {
  await collectIntegrationData(integration.directory);

  // TODO: Remove this in favor of custom storage engine handler functions.
  if (starbaseConfig.storage?.engine === 'neo4j') {
    await writeIntegrationDataToNeo4j(
      integration.instanceId,
      integration.directory,
    );
  }
}

export {
  executeIntegration,
  collectIntegrationData,
  writeIntegrationDataToNeo4j,
};
