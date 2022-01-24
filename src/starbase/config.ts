import { promises as fs } from 'fs';
import * as path from 'path';
import { StarbaseIntegration, StarbaseStorage } from "./types";
import Ajv, { Schema } from 'ajv';
import * as yaml from 'js-yaml';
import { StarbaseConfig } from './types';

const ajv = new Ajv();

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

function integrationConfigToEnvFormat(
  config: StarbaseIntegration['config']
) {
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
  integration: StarbaseIntegration<TConfig>
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

async function loadParsedConfig(
  filePath: string,
): Promise<StarbaseConfig> {
  const rawFile = await loadRawConfig(filePath);
  return yaml.load(rawFile) as StarbaseConfig;
}

async function validateStarbaseConfigSchema(config: StarbaseConfig) {
  const finalConfig: StarbaseConfig = { integrations: [] };
  const validator = ajv.compile(integrationSchema);

  for (const integration of config.integrations) {
    if (!validator(integration)) {
      console.log(
        'WARNING.  Skipping the following due to missing item(s) in its config: ',
        integration,
      );
    } else {
      finalConfig.integrations.push(integration);
    }
  }

  finalConfig.storage = config.storage;
  return finalConfig;
}

async function parseConfigYaml(
  configPath: string,
): Promise<StarbaseConfig> {
  const yamlConfig: StarbaseConfig = await loadParsedConfig(configPath);
  const finalConfig: StarbaseConfig = await validateStarbaseConfigSchema(
    yamlConfig,
  );

  validateStarbaseConfigSchema(yamlConfig);
  return finalConfig;
}

export {
  parseConfigYaml,
  writeIntegrationConfig,
  writeNeo4jRootConfig,
  integrationConfigToEnvFormat
};
