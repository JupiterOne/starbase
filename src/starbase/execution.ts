import {
  writeIntegrationConfig,
  writeMemgraphRootConfig,
  writeNeo4jRootConfig,
  writeJ1RootConfig,
} from './config';
import { executeIntegration } from './integration';
import { isDirectoryPresent } from '@jupiterone/integration-sdk-runtime';
import { StarbaseConfigurationError } from './error';
import { StarbaseConfig, StarbaseIntegration } from './types';

async function setupStarbaseStorageEngine(starbaseConfig: StarbaseConfig) {
  if (!starbaseConfig.storage) return;

  // TODO: determine if we need to validate array here

  for (const storageConfig of starbaseConfig.storage || []) {
    switch (storageConfig.engine) {
      case 'neo4j':
        await writeNeo4jRootConfig(storageConfig);
        break;
      case 'memgraph':
        await writeMemgraphRootConfig(storageConfig);
        break;
      case 'jupiterone':
        await writeJ1RootConfig(storageConfig);
        break;
      default:
        throw new StarbaseConfigurationError(
          `Invalid storage engine supplied: '${storageConfig.engine}'.`,
        );
    }
  }
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

  const engines = (starbaseConfig.storage || []).map((s) => s.engine);

  if (engines.includes('neo4j')) {
    console.log(
      `open ${
        process.env.NEO4J_BROWSER_URI ?? 'http://localhost:7474/browser/'
      } to browse your Neo4J graph.`,
    );
  }
  else if (engines.includes('memgraph')) {
    console.log(
      `open ${
        process.env.MEMGRAPH_BROWSER_URI ?? 'http://localhost:3000/browser/'
      } to browse your graph in Memgraph.`,
    );
  }
}

export { executeStarbase, OnSkipIntegrationExecutionFunctionParams };
