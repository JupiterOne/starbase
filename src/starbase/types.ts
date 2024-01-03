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

interface Neo4jStorageEngineConfig {
  username: string;
  password: string;
  uri: string;
  database?: string;
}

interface MemgraphStorageEngineConfig {
  username: string;
  password: string;
  uri: string;
  database?: string;
}

interface JupiterOneStorageEngineConfig {
  /**
   * The JupiterOne API key to authenticate with
   */
  apiKey: string;
  /**
   * The JupiterOne account ID to target
   */
  accountId: string;
  /**
   * If provided this option specifies which base URL to use for synchronization (default: `https://api.us.jupiterone.io`)
   */
  apiBaseUrl?: string;
}

export type Neo4jStorage = StarbaseStorage<Neo4jStorageEngineConfig>;

export type MemgraphStorage = StarbaseStorage<MemgraphStorageEngineConfig>;

export type JupiterOneStorage = StarbaseStorage<JupiterOneStorageEngineConfig>;

export type StarbaseConfig = {
  integrations: StarbaseIntegration[];
  storage?: StarbaseStorage[];
};
