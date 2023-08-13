import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useDarkMode} from '../../DarkModeContext';
import {RootStackParamList} from '../../Types';
import base64 from 'react-native-base64';
import * as Keychain from 'react-native-keychain';
import SearchBar from '../../Components/SearchBar';

type TagScreenRouteProp = RouteProp<RootStackParamList, 'TagScreen'>;
type TagScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'TagScreen'
>;

type TagScreenProps = {
  route: TagScreenRouteProp;
  navigation: TagScreenNavigationProp;
};

const getDynamicStyles = (isDark: boolean) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#333' : '#f0f0f0',
    },
    text: {
      padding: 20,
      fontSize: 25,
      color: isDark ? '#ccc' : '#333',
    },
  });
};

const TagScreen: React.FC<TagScreenProps> = ({route, navigation}) => {
  const {isDarkMode} = useDarkMode();
  const dynamicStyles = getDynamicStyles(isDarkMode);
  const {repo, tags, url} = route.params;
  const [searchText, setSearchText] = useState('');
  const [credentials, setCredentials] = useState<{
    username: string;
    password: string;
  }>({
    username: '',
    password: '',
  });

  useEffect(() => {
    const loadCredentials = async () => {
      const keychainCredentails = await Keychain.getGenericPassword({
        service: url,
      });

      if (!keychainCredentails) {
        throw new Error('No credentials found for this service');
      }

      const {username, password} = keychainCredentails;

      setCredentials({username, password});
    };

    loadCredentials();
  }, [navigation, url]);

  function formatBytes(bytes: number): string {
    const B = 1;
    const KB = B * 1024;
    const MB = KB * 1024;
    const GB = MB * 1024;

    let value: number;
    let unit: string;

    if (bytes >= GB) {
      value = bytes / GB;
      unit = 'GB';
    } else if (bytes >= MB) {
      value = bytes / MB;
      unit = 'MB';
    } else if (bytes >= KB) {
      value = bytes / KB;
      unit = 'KB';
    } else {
      value = bytes;
      unit = 'B';
    }

    return `${value.toFixed(2)} ${unit}`;
  }

  const getBlob = async (digest: string) => {
    try {
      const {username, password} = credentials;
      const auth = 'Basic ' + base64.encode(username + ':' + password);
      const response = await fetch(`${url}/v2/${repo}/blobs/${digest}`, {
        method: 'GET',
        headers: {
          Authorization: auth,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const responseData = await response.json();
      return {
        architecture: responseData.architecture,
        os: responseData.os,
        created: responseData.created,
        author: responseData.author,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error in getBlob:', error.message);
        Alert.alert('Error', error.message);
      } else {
        console.error('An unexpected error occurred:', error);
        Alert.alert('Error', 'An unexpected error occurred');
      }
    }
  };

  const handlePress = async (tag: string) => {
    try {
      const {username, password} = credentials;
      const auth = 'Basic ' + base64.encode(username + ':' + password);
      const response = await fetch(`${url}/v2/${repo}/manifests/${tag}`, {
        method: 'GET',
        headers: {
          Authorization: auth,
          Accept: 'application/vnd.docker.distribution.manifest.v2+json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const responseData = await response.json();

      let size = 0;
      for (let i = 0; i < responseData.layers.length; i++) {
        size += responseData.layers[i].size;
      }

      const manifest: {
        size: string;
        digest:
          | {
              author: string;
              architecture: string;
              os: string;
              created: string;
            }
          | undefined;
      } = {
        size: formatBytes(size),
        digest: await getBlob(responseData.config.digest),
      };

      if (manifest.digest) {
        navigation.navigate('TagDetails', {
          repo: repo,
          tag: tag,
          size: manifest.size,
          architecture: manifest.digest.architecture,
          os: manifest.digest.os,
          created: manifest.digest.created,
          author: manifest.digest.author,
        });
        setSearchText('');
      } else {
        console.error('manifest.digest is undefined');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error in handlePress:', error.message);
        Alert.alert('Error', error.message);
      } else {
        console.error('An unexpected error occurred:', error);
        Alert.alert('Error', 'An unexpected error occurred');
      }
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: repo,
    });
  }, [navigation, repo]);

  return (
    <View style={dynamicStyles.container}>
      <SearchBar
        value={searchText}
        onChange={text => setSearchText(text)}
        isDarkMode={isDarkMode}
      />
      <FlatList
        data={tags.filter(item => item.includes(searchText))}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <View>
              <Text style={dynamicStyles.text}>{item}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default TagScreen;
