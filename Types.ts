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
    size: string;
    architecture: string;
    os: string;
    author: string;
  };
};
