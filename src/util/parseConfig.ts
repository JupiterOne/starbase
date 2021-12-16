import { promises as fs } from 'fs';
import * as yaml from 'yaml';
import {
  StarbaseConfig, 
  StarbaseIntegration,
} from '../types';

export async function parseConfigYaml(configPath: string): Promise<StarbaseConfig> {
  let yamlConfig: StarbaseConfig = {
    integrations: [],
  };

  const configYaml: string = await fs.readFile(configPath, 'utf-8');
  const parsedYaml = yaml.parseDocument(configYaml);

  if(parsedYaml.get('integrations')) {
    for(const integration of parsedYaml.get('integrations').items) {
      let tempIntegration: StarbaseIntegration = {
        name: integration.get('name'),
        directory: integration.get('directory'),
        git:integration.get('git'),
        config: []
      };

      for(const entry of integration.get('config').items) {
        tempIntegration.config.push(`${entry.key.value}=${entry.value.value}\n`);
      }
      yamlConfig.integrations.push(tempIntegration);
    }
  }

  if(parsedYaml.get('storage')) {
    yamlConfig.storage = {
      engine: parsedYaml.get('storage').get('engine'),
      uri: parsedYaml.get('storage').get('uri'),
      username: parsedYaml.get('storage').get('username'),
      password: parsedYaml.get('storage').get('password')
    }
  }

  return yamlConfig;
}