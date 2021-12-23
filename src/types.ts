export type StarbaseIntegration<TConfig = any> = {
  name: string;
  instanceId: string;
  directory: string;
  gitRemoteUrl?: string;
  config?: TConfig;
};

export type StarbaseStorage<TStorageConfig = any> = {
  engine: string;
  config: TStorageConfig;
};

interface Neo4jStorageConfig {
  username: string;
  password: string;
  uri: string;
}

export type Neo4jStorage = StarbaseStorage<Neo4jStorageConfig>;

export type StarbaseConfig = {
  integrations: StarbaseIntegration[];
  storage?: StarbaseStorage;
};
