
export type StarbaseIntegration = {
  name: string;
  instanceID: string;
  directory: string;
  git?: string;
  config: string[];
}

export type StarbaseStorage = {
  engine: string;
  username: string;
  password: string;
  uri: string;
}

export type StarbaseConfig = {
  integrations: StarbaseIntegration[];
  storage?: StarbaseStorage;
}