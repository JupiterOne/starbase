import { integrationConfigToEnvFormat, parseConfigYaml } from './config';
import { StarbaseConfig } from './types';

describe('#integrationConfigToEnvFormat', () => {
  test('should convert integration config to environment file format', () => {
    expect(
      integrationConfigToEnvFormat({
        JSON_STRING_KEY:
          '{"type": "my_account", "project_id": "the-project-id"}',
        PROJECT_ID: 'the-project-id',
      }),
    ).toEqual(
      `JSON_STRING_KEY={"type": "my_account", "project_id": "the-project-id"}\nPROJECT_ID=the-project-id\n`,
    );
  });
});

const testConfig: StarbaseConfig = {
  integrations: [
    {
      name: 'graph-jamf',
      instanceId: 'testInstanceId',
      directory: './.integrations/graph-jamf',
      gitRemoteUrl: 'https://github.com/JupiterOne/graph-jamf.git',
      config: {
        JAMF_HOST: 'example-host',
        JAMF_USERNAME: 'example-username',
        JAMF_PASSWORD: 'example-password',
      },
    },
    {
      name: 'graph-sentry',
      instanceId: 'testInstanceId',
      directory: './.integrations/graph-sentry',
      gitRemoteUrl: 'https://github.com/JupiterOne/graph-sentry.git',
      config: {
        AUTH_TOKEN: 'example-token',
        ORGANIZATION_SLUG: 'example-organization',
      },
    },
  ],
  storage: {
    engine: 'neo4j',
    config: {
      username: 'neo4j',
      password: 'devpass',
      uri: 'bolt://localhost:7687',
    },
  },
};

const testConfigOptionals: StarbaseConfig = {
  integrations: [
    {
      name: 'graph-jamf-no-git',
      instanceId: 'testInstanceId',
      directory: './.integrations/graph-jamf',
      config: {
        JAMF_HOST: 'example-host',
        JAMF_USERNAME: 'example-username',
        JAMF_PASSWORD: 'example-password',
      },
    },
    {
      name: 'graph-jamf-no-config',
      instanceId: 'testInstanceId',
      directory: './.integrations/graph-jamf',
      gitRemoteUrl: 'https://github.com/JupiterOne/graph-jamf.git',
    },
  ],
  storage: {
    engine: 'neo4j',
    config: {
      username: 'neo4j',
      password: 'devpass',
      uri: 'bolt://localhost:7687',
    },
  },
};

describe('#parseConfig', () => {
  test('Example config.yaml generates example config', async () => {
    const config = await parseConfigYaml('config.yaml.example');

    expect(config).toEqual(testConfig);
  });

  test('Missing config file', async () => {
    await expect(parseConfigYaml('')).rejects.toThrowError(
      'Starbase config file not found (filePath=)',
    );
  });

  test('Optional/Required integration values yeild proper config.', async () => {
    const config = await parseConfigYaml(
      './src/starbase/__fixtures__/config/config.missingValues.yaml',
    );

    expect(config).toEqual(testConfigOptionals);
  });
});
