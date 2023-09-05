import base64 from 'react-native-base64';
import {showToast} from './Utils';

const createAuthHeader = (registryUser: string, registryPass: string) => {
  const auth = 'Basic ' + base64.encode(`${registryUser}:${registryPass}`);
  return {
    Authorization: auth,
  };
};

const baseUrl = (hostname: string, endpoint: string) =>
  `${hostname}/v2/${endpoint}`;

export const fetchRepositories = async (
  hostname: string,
  registryUser: string,
  registryPass: string,
) => {
  try {
    const response = await fetch(baseUrl(hostname, '_catalog'), {
      method: 'GET',
      headers: createAuthHeader(registryUser, registryPass),
    });

    if (!response.ok) {
      throw new Error('Error fetching repositories');
    }

    const responseData = await response.json();
    return responseData.repositories;
  } catch (error) {
    if (error instanceof Error) {
      showToast('Error: ' + error.message);
      throw error;
    } else {
      showToast('An unexpected error occurred.');
      throw new Error('An unexpected error occurred.');
    }
  }
};

export const fetchTags = async (
  hostname: string,
  registryUser: string,
  registryPass: string,
  tag: string,
) => {
  return await fetch(baseUrl(hostname, `${tag}/tags/list`), {
    method: 'GET',
    headers: createAuthHeader(registryUser, registryPass),
  });
};

export const fetchBlob = async (
  hostname: string,
  registryUser: string,
  registryPass: string,
  repo: string,
  digest: string,
) => {
  return await fetch(baseUrl(hostname, `${repo}/blobs/${digest}`), {
    method: 'GET',
    headers: createAuthHeader(registryUser, registryPass),
  });
};

export const fetchManifest = async (
  hostname: string,
  registryUser: string,
  registryPass: string,
  repo: string,
  tag: string,
) => {
  return await fetch(baseUrl(hostname, `${repo}/manifests/${tag}`), {
    method: 'GET',
    headers: {
      ...createAuthHeader(registryUser, registryPass),
      Accept: 'application/vnd.docker.distribution.manifest.v2+json',
    },
  });
};
