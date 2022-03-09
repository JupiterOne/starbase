import { Clone, Reference, Repository } from 'nodegit';
import { StarbaseConfig, StarbaseIntegration } from './types';
import { isDirectoryPresent } from '@jupiterone/integration-sdk-runtime';
import { executeWithLogging } from './process';
import snakecase from 'lodash.snakecase';
import Ajv, { Schema } from 'ajv';

// Set up Ajv to return all errors instead of just the first and
// allow for the 'mask' keyword used in our instanceConfigFields.
const ajv = new Ajv({ allErrors: true });
ajv.addKeyword('mask');

async function setupStarbase(config: StarbaseConfig) {
  let configErrorCount = 0;
  for (const integration of config.integrations) {
    await setupIntegration(integration);
    if (!(await checkInstanceConfigFields(integration))) {
      configErrorCount++;
    }
    await installIntegrationDependencies(integration.directory);
  }
  if (configErrorCount > 0) {
    console.error(
      `ERROR:  Configurations for ${configErrorCount} integration(s) failed validation tests.  Please correct above error messages and retry.`,
    );
  }
}

async function installIntegrationDependencies(directory: string) {
  return executeWithLogging(`yarn --cwd ${directory} install`);
}

/**
 * After we have cloned the repository, pull down information on the required
 * instanceConfigFields and perform additional checks.  Returns false if the
 * config fields weren't successfully validated.
 */
async function checkInstanceConfigFields(
  integration: StarbaseIntegration,
): Promise<boolean> {
  let checkSuccessful = true;
  await import(`../.${integration.directory}/src/index`).then(
    ({ invocationConfig }) => {
      if (invocationConfig.instanceConfigFields) {
        // We have to snake_case and UPPERCASE our instanceConfigFields keys before
        // building our validator to mimic conversions that occur during execution
        // of our integrations.
        const capsConfig = Object.assign({}, ...Object.keys(invocationConfig.instanceConfigFields).map(
          (key)=>({
            [snakecase(key).toUpperCase()]:invocationConfig.instanceConfigFields[key]
          })
        ));
        const integrationSchema: Schema = {
          type: 'object',
          properties: capsConfig,
          required: Object.keys(capsConfig),
        };
        const validator = ajv.compile(integrationSchema);

        if (!validator(integration.config)) {
          // Log but don't throw an error so we can report errors for all integration configurations, not just the first failure
          console.error(
            `ERROR:  instanceConfigFields validation error(s) for ${integration.name}:  `,
            validator.errors,
          );
          checkSuccessful = false;
        }
      }
    },
  );
  return checkSuccessful;
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
