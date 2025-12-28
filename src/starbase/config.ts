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
    integrations: {
      type: 'array',
      items: integrationSchema,
    },
    storage: {
      type: 'array',
      items: storageSchema,
    },
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
  await fs.appendFile(
    '.env',
    `NEO4J_URI=${storage.config.uri}
NEO4J_USER=${storage.config.username}
NEO4J_PASSWORD=${storage.config.password}
`,
  );
}

async function writeMemgraphRootConfig(storage: StarbaseStorage) {
  await fs.appendFile(
    '.env',
    `MEMGRAPH_URI=${storage.config.uri}
    MEMGRAPH_USER=${storage.config.username}
    MEMGRAPH_PASSWORD=${storage.config.password}
`,
  );
}

async function writeJ1RootConfig(storage: StarbaseStorage) {
  await fs.appendFile(
    '.env',
    `JUPITERONE_API_KEY=${storage.config.apiKey}
JUPITERONE_ACCOUNT=${storage.config.accountId}
JUPITERONE_API_BASEURL=${
      storage.config.apiBaseUrl || 'https://api.us.jupiterone.io'
    }
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
      throw new Error(
        `Config file not found. Starbase cannot continue without the configuration information provided in it. Please create a config.yaml file in the project root directory before retrying. See the config.yaml.example file in the project root directory for a formatting example.`,
      );
    }

    throw err;
  }
}

async function loadParsedConfig(filePath: string): Promise<StarbaseConfig> {
  const rawFile = await loadRawConfig(filePath);
  return yaml.load(rawFile) as StarbaseConfig;
}

function validateStarbaseConfigSchema(config: StarbaseConfig) {
  const configValidator = ajv.compile(configSchema);

  if (!configValidator(config)) {
    console.error(
      `ERROR:  config file validation error(s):  `,
      configValidator.errors,
    );
    throw new Error(
      `One or more errors found with configuration file.  Please correct above errors and try again.`,
    );
  }

  return config;
}

// We were allowing for partial config runs when only some of our integration configurations
// were incorrect or missing data.  We're now throwing and not allowing partial configs to
// continue, so we can look at revamping this in the future to simplify, since the yamlConfig
// won't be potentially mutated in the validate call.
async function parseConfigYaml(configPath: string): Promise<StarbaseConfig> {
  const yamlConfig: StarbaseConfig = await loadParsedConfig(configPath);
  const finalConfig: StarbaseConfig = validateStarbaseConfigSchema(yamlConfig);

  return finalConfig;
}

export {
  parseConfigYaml,
  writeIntegrationConfig,
  writeMemgraphRootConfig,
  writeNeo4jRootConfig,
  writeJ1RootConfig,
  integrationConfigToEnvFormat,
};
