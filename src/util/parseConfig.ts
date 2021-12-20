import { promises as fs } from 'fs';
import * as yaml from 'yaml';
import { YAMLMap } from 'yaml/types';
import {
  StarbaseConfig, 
  StarbaseIntegration,
  Neo4jStorage,
} from '../types';

export async function parseConfigYaml(configPath: string): Promise<StarbaseConfig> {
  let yamlConfig: StarbaseConfig = {
    integrations: [],
  };
  try {
    if(!((await fs.lstat(configPath)).isFile())) {
      throw new Error(`Missing config.yaml (path=${configPath})`);
    }
  }
  catch (err) {
    throw new Error(`Missing config.yaml (path=${configPath})`);
  }

  const configYaml: string = await fs.readFile(configPath, 'utf-8');
  const parsedYaml = yaml.parseDocument(configYaml);

  if(parsedYaml.get('integrations')) {
    for(const integration of parsedYaml.get('integrations').items) {
      if(hasMissingItems(integration)) {
        //TODO, should we be continuing to additional integrations like we're currently doing,
        //or should we throw an error and fail to execute all of them?
        console.log('WARNING.  Skipping the following due to missing item(s) in its config: ', integration);
      }
      else {
        let tempIntegration: StarbaseIntegration<string[]>  = {
          name: integration.get('name'),
          instanceId: integration.get('instanceId'),
          directory: integration.get('directory'),
          gitRemoteUrl:integration.get('gitRemoteUrl'),
          config: []
        };
        if(integration.get('config')) { //Configurations are *technically* optional
          for(const entry of integration.get('config').items) {
            tempIntegration.config.push(`${entry.key.value}=${entry.value.value}\n`);
          }
        }
        yamlConfig.integrations.push(tempIntegration);
      }
    }
    // Storage isn't nested within integrations, but we only care about bothering with
    // a storage endpoint if we have integrations to write to.
    if(parsedYaml.get('storage')) {
      if(parsedYaml.get('storage').get('engine') && parsedYaml.get('storage').get('engine') == 'neo4j') {
        const tempStorage: Neo4jStorage = {
          engine: parsedYaml.get('storage').get('engine'),
          config: {
            uri: parsedYaml.get('storage').get('uri'),
            username: parsedYaml.get('storage').get('username'),
            password: parsedYaml.get('storage').get('password')
          }
        }
        yamlConfig.storage = tempStorage;
      }
    }

    return yamlConfig;
  }
  else {
    throw new Error('ERROR.  Missing integrations definition in config.yaml.');
    
  }
}

function hasMissingItems(integration: YAMLMap) {
  if(integration.get('name') && integration.get('instanceId') && integration.get('directory')) {
    return false;
  }
  return true;
}