import {
  JupiterOneStorage,
  SupabaseStorage,
  StarbaseConfig,
  StarbaseIntegration,
} from './types';
import { findGraphEntityJSONFiles } from './util';
import { executeWithLogging } from './process';
import { StarbaseConfigurationError } from './error';
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs/promises';
import path from 'path';

async function collectIntegrationData(integrationDirectory: string) {
  await executeWithLogging(
    `yarn --cwd ${integrationDirectory} start --disable-schema-validation;`,
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

async function writeIntegrationDataToSupabase(
  integrationInstanceId: string,
  integrationDirectory: string,
  storageConfig: SupabaseStorage,
) {
  const supabaseUrl = storageConfig.config.apiBaseUrl;
  const supabaseKey = storageConfig.config.apiKey;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const entityFiles = await findGraphEntityJSONFiles(
      path.join(integrationDirectory, '.j1-integration'),
    );
    for (const entityFile of entityFiles) {
      const entityData = await fs.readFile(entityFile, 'utf8');
      // peek at the first entity to determine the entity type being uploaded
      const object = JSON.parse(entityData);
      const entityType = object.entities[0]._type;
      const uploadFileName = `${entityType}.json`;
      const { error } = await supabase.storage
        .from('integration-data')
        .upload(uploadFileName, entityData);
      if (error) {
        console.warn(
          `Error uploading ${uploadFileName} to Supabase: ${error.message}`,
        );
      } else {
        console.log(`Uploaded ${uploadFileName} to Supabase.`);
      }
    }
  } catch (err) {
    console.log(err);
  }
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
      case 'jupiterone':
        await writeIntegrationDataToJupiterOne(
          integration.instanceId,
          integration.directory,
          storageConfig,
        );
        break;
      case 'supabase':
        await writeIntegrationDataToSupabase(
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
  writeIntegrationDataToNeo4j,
  writeIntegrationDataToJupiterOne,
  writeIntegrationDataToSupabase,
};
