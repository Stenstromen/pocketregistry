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
  TagDetailScreen: {
    size: string;
    architecture: string;
    os: string;
    author: string;
  };
};
