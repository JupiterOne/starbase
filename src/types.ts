export type StarbaseIntegration<TConfig = any> = {
  name: string;
  instanceId: string;
  directory: string;
  gitRemoteUrl?: string;
  config?: TConfig;
};

export enum StorageEngineType {
  Neo4j = 'neo4j'
}

export type StarbaseStorage<TStorageConfig = any> = {
  engine: StorageEngineType;
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
