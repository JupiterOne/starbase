import { Clone, Reference, Repository } from 'nodegit';
import { StarbaseConfig, StarbaseIntegration } from './types';
import { isDirectoryPresent } from '@jupiterone/integration-sdk-runtime';
import { executeWithLogging } from './process';

async function setupStarbase(config: StarbaseConfig) {
  for (const integration of config.integrations) {
    await setupIntegration(integration);
    await installIntegrationDependencies(integration.directory);
  }
}

async function installIntegrationDependencies(directory: string) {
  return executeWithLogging(`yarn --cwd ${directory} install`);
}

/**
 * Clones or updates an integration based on whether the integration
 * directory already exists or not
 */
async function setupIntegration(integration: StarbaseIntegration) {
  if (!integration.gitRemoteUrl) return;

  if (await isDirectoryPresent(integration.directory)) {
    await updateIntegrationDirectory(integration.directory);
  } else {
    await Clone.clone(integration.gitRemoteUrl, integration.directory);
  }
}

/**
 * Updates an integration directory by fetching the latest from the
 * `main` branch
 */
async function updateIntegrationDirectory(directory: string) {
  let repo = await Repository.open(directory);
  await repo.fetchAll();

  const localMain: Reference = await repo.getCurrentBranch();
  const originMain = await repo.getBranch('origin/main');
  await repo.mergeBranches(localMain, originMain);
}

export { setupStarbase };
