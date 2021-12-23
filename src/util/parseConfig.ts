import Ajv from 'ajv';
import { promises as fs } from 'fs';
import * as yaml from 'js-yaml';
import { StarbaseConfig } from '../types';

const ajv = new Ajv();

const integrationSchema = {
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

export async function loadParsedConfig(
  filePath: string,
): Promise<StarbaseConfig> {
  const rawFile = await loadRawConfig(filePath);
  return yaml.load(rawFile) as StarbaseConfig;
}

async function validateStarbaseConfigSchema(config: StarbaseConfig) {
  let finalConfig: StarbaseConfig = { integrations: [] };
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

export async function parseConfigYaml(
  configPath: string,
): Promise<StarbaseConfig> {
  let yamlConfig: StarbaseConfig = await loadParsedConfig(configPath);
  let finalConfig: StarbaseConfig = await validateStarbaseConfigSchema(
    yamlConfig,
  );
  validateStarbaseConfigSchema(yamlConfig);
  return finalConfig;
}
