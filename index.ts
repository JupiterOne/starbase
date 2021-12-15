import { execSync  } from 'child_process';
import { promises as fs } from 'fs';
import * as yaml from 'yaml';

async function main() {
  console.log('Starting reading yaml');
  const configYaml: string = await fs.readFile('config.yaml', 'utf-8');
  const parsedYaml = yaml.parseDocument(configYaml);

  console.log(`Ensuring .integrations folder is ready`);
  execSync(`mkdir -p .integrations`);

  for(const integration of parsedYaml.get('integrations').items) {
    const name = integration.get('name');
    const directory = integration.get('directory');
    const gitURI = integration.get('git');
    console.log('Cloning/Pulling: ', gitURI);
    execSync(`if cd ${directory}; then git pull; else cd .integrations; git clone ${gitURI}; fi`);
    console.log(`Installing ${name}`);
    execSync(`cd ${directory}; yarn install;`);

    console.log(`Setting up .env file`);
    // execSync(`cd ${directory}; rm .env;`);
    for(const entry of integration.get('env').items) {
      console.log(`ADDING ${entry.key.value} to .env`);
      execSync(`echo ${entry.key.value}=${entry.value.value} >> ${directory}/.env`)
    }

    console.log(`Collecting ${name}`);
    execSync(`cd ${directory}; yarn start;`);
    console.log(`Pushing ${name} to neo4j (TBD)`);
  }

}

main();