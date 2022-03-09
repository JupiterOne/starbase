import { promises as fs } from 'fs';
import * as path from 'path';
import { StarbaseIntegration, StarbaseStorage } from './types';
import Ajv, { Schema } from 'ajv';
import * as yaml from 'js-yaml';
import { StarbaseConfig } from './types';

const ajv = new Ajv({ allErrors: true });

const integrationSchema: Schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    instanceId: { type: 'string' },
    directory: { type: 'string' },
    gitRemoteUrl: { type: 'string' },
    config: { type: 'object' },
  },
  required: ['name', 'instanceId', 'directory'],
  additionalProperties: true,
};

const storageSchema: Schema = {
  type: 'object',
  properties: {
    engine: { type: 'string' },
    config: { type: 'object' },
  },
  required: ['engine'],
};

const configSchema: Schema = {
  type: 'object',
  properties: {
    integrations: { type: 'array' },
    storage: { type: 'object' },
  },
};

function integrationConfigToEnvFormat(config: StarbaseIntegration['config']) {
  let envFileContents = '';

  for (const configEntryName in config) {
    envFileContents += `${configEntryName}=${config[configEntryName]}\n`;
  }

  return envFileContents;
}

/**
 * This is the `.env` file that is written to the root of the Starbase project.
 */
async function writeNeo4jRootConfig(storage: StarbaseStorage) {
  await fs.writeFile(
    '.env',
    `NEO4J_URI=${storage.config.uri}
NEO4J_USER=${storage.config.username}
NEO4J_PASSWORD=${storage.config.password}
`,
  );
}

async function writeIntegrationConfig<TConfig = any>(
  integration: StarbaseIntegration<TConfig>,
) {
  if (!integration.config) return;

  await fs.writeFile(
    path.join(integration.directory, '.env'),
    integrationConfigToEnvFormat(integration.config),
  );
}

async function loadRawConfig(filePath: string) {
  try {
    const file = await fs.readFile(filePath, {
      encoding: 'utf-8',
    });

    return file;
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`Starbase config file not found (filePath=${filePath})`);
    }

    throw err;
  }
}

async function loadParsedConfig(filePath: string): Promise<StarbaseConfig> {
  const rawFile = await loadRawConfig(filePath);
  return yaml.load(rawFile) as StarbaseConfig;
}

function validateStarbaseConfigSchema(config: StarbaseConfig) {
  const finalConfig: StarbaseConfig = {
    integrations: [],
    storage: config.storage,
  };

  const validator = ajv.compile(integrationSchema);
  const configValidator = ajv.compile(configSchema);
  const storageValidator = ajv.compile(storageSchema);

  let configErrorCount = 0;

  if (!configValidator(config)) {
    console.error(
      `ERROR:  config file validation error(s):  `,
      configValidator.errors,
    );
    configErrorCount++;
  }

  if (!storageValidator(config.storage)) {
    console.error(
      `ERROR:  storage configuration validation error(s):  `,
      storageValidator.errors,
    );
    configErrorCount++;
  }

  for (const integration of config.integrations) {
    const integrationName =
      integration.name || integration.instanceId || 'Unknown integration';
    if (!validator(integration)) {
      console.error(
        'ERROR in configuration for ',
        integrationName,
        ':  ',
        validator.errors,
      );
      configErrorCount++;
    } else {
      finalConfig.integrations.push(integration);
    }
  }

  if (configErrorCount > 0) {
    throw new Error(
      `One or more errors found with configuration file.  Please correct above errors and try again.`,
    );
  }

  return finalConfig;
}

async function parseConfigYaml(configPath: string): Promise<StarbaseConfig> {
  const yamlConfig: StarbaseConfig = await loadParsedConfig(configPath);
  const finalConfig: StarbaseConfig = validateStarbaseConfigSchema(yamlConfig);

  return finalConfig;
}

export {
  parseConfigYaml,
  writeIntegrationConfig,
  writeNeo4jRootConfig,
  integrationConfigToEnvFormat,
};
