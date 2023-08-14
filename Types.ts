export type RootStackParamList = {
  PocketRegistry: undefined;
  Add: undefined;
  List: undefined;
  RepositoryScreen: {
    username: string;
    password: string;
    data: string[];
    serviceName: string;
  };
  TagScreen: {
    tags: string[];
    repo: string;
    url: string;
    username: string;
    password: string;
  };
  TagDetails: {
    url: string;
    repo: string;
    tag: string;
    version: number | undefined;
    size: string;
    architecture: string;
    os: string;
    created: string;
    env: string[];
    entrypoint: string[];
    repodigest: string;
  };
};
