import { writeIntegrationConfig, writeNeo4jRootConfig } from './config';
import { executeIntegration } from './integration';
import { isDirectoryPresent } from '@jupiterone/integration-sdk-runtime';
import { StarbaseConfigurationError } from './error';
import { StarbaseConfig, StarbaseIntegration } from './types';

async function setupStarbaseStorageEngine(starbaseConfig: StarbaseConfig) {
  if (!starbaseConfig.storage) return;

  if (starbaseConfig.storage.engine !== 'neo4j') {
    throw new StarbaseConfigurationError(
      'Invalid storage engine supplied. Neo4j is the only storage engine supported at this time.',
    );
  }

  await writeNeo4jRootConfig(starbaseConfig.storage);
}

type OnSkipIntegrationExecutionFunctionParams = {
  integration: StarbaseIntegration;
  reason: string;
};

type OnExecuteStarbaseOptions = {
  onSkipIntegrationExecution?: (
    params: OnSkipIntegrationExecutionFunctionParams,
  ) => void;
};

async function executeStarbase(
  starbaseConfig: StarbaseConfig,
  { onSkipIntegrationExecution }: OnExecuteStarbaseOptions = {},
) {
  await setupStarbaseStorageEngine(starbaseConfig);

  for (const integration of starbaseConfig.integrations) {
    if (!(await isDirectoryPresent(integration.directory))) {
      if (onSkipIntegrationExecution) {
        onSkipIntegrationExecution({
          integration,
          reason: `Integration directory is not present. Please ensure that you've run "yarn starbase setup".`,
        });
      }

      continue;
    }

    await writeIntegrationConfig(integration);
    await executeIntegration(integration, starbaseConfig);
  }
  console.log(
    `open ${
      process.env.NEO4J_BROWSER_URI ?? 'http://localhost:7474/browser/'
    } to browse your Neo4J graph.`,
  );
}

export { executeStarbase, OnSkipIntegrationExecutionFunctionParams };
