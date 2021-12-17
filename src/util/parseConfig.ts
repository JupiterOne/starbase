import { promises as fs } from 'fs';
import * as yaml from 'yaml';
import { YAMLMap } from 'yaml/types';
import {
  StarbaseConfig, 
  StarbaseIntegration,
} from '../types';

export async function parseConfigYaml(configPath: string): Promise<StarbaseConfig> {
  let yamlConfig: StarbaseConfig = {
    integrations: [],
  };
  try {
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
          let tempIntegration: StarbaseIntegration = {
            name: integration.get('name'),
            instanceID: integration.get('instanceID'),
            directory: integration.get('directory'),
            git:integration.get('git'),
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
        yamlConfig.storage = {
          engine: parsedYaml.get('storage').get('engine'),
          uri: parsedYaml.get('storage').get('uri'),
          username: parsedYaml.get('storage').get('username'),
          password: parsedYaml.get('storage').get('password')
        }
      }

      return yamlConfig;
    }
    else {
      throw new Error('ERROR.  Missing integrations definition in config.yaml.');
      
    }
  }
  catch (err) {
    if(err.code === 'ENOENT') {
      err.message = 'ERROR.  Missing config.yaml.';
    }
    throw err;
  }
}

function hasMissingItems(integration: YAMLMap) {
  if(integration.get('name') && integration.get('instanceID') && integration.get('directory')) {
    return false;
  }
  return true;
}