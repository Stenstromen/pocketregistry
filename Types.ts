export type RootStackParamList = {
  PocketRegistry: undefined;
  Add: undefined;
  List: undefined;
  RepositoryScreen: {
    data: string[];
    serviceName: string;
  };
  TagScreen: {
    tags: string[];
    repo: string;
    url: string;
  };
  TagDetails: {
    repo: string;
    tag: string;
    size: string;
    architecture: string;
    os: string;
    author: string;
    created: string;
  };
};
