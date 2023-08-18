// React imports
import React, {useEffect, useState} from 'react';

// React Native components
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

// Navigation related imports
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

// Contexts
import {useDarkMode} from '../../DarkModeContext';

// Custom components
import SearchBar from '../../Components/SearchBar';

// Type definitions
import {RootStackParamList, RenderSearchBarProps} from '../../Types';

// Utilities and helpers
import {formatBytes, showToast} from '../../Utils';
import {fetchBlob, fetchManifest} from '../../Api';

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

const RenderSearchBar: React.FC<RenderSearchBarProps> = ({
  searchText,
  setSearchText,
  isDarkMode,
}) => {
  return (
    <SearchBar
      value={searchText}
      onChange={text => setSearchText(text)}
      isDarkMode={isDarkMode}
    />
  );
};

const TagScreen: React.FC<TagScreenProps> = ({route, navigation}) => {
  const {isDarkMode} = useDarkMode();
  const dynamicStyles = getDynamicStyles(isDarkMode);
  const {repo, tags, url, username, password} = route.params;
  const [searchText, setSearchText] = useState('');

  const getBlob = async (digest: string) => {
    try {
      const response = await fetchBlob(url, username, password, repo, digest);
      if (!response.ok) {
        showToast('Network response was not ok.');
        return undefined;
      }
      const responseData = await response.json();
      return {
        architecture: responseData.architecture,
        os: responseData.os,
        created: responseData.created,
        author: responseData.author,
        env: responseData.config.Env,
        entrypoint: responseData.config.Entrypoint,
      };
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message);
      } else {
        showToast('An unexpected error occurred');
      }
    }
  };

  const handlePress = async (tag: string) => {
    try {
      const response = await fetchManifest(url, username, password, repo, tag);
      if (!response.ok) {
        showToast('Network response was not ok.');
      }

      const responseData = await response.json();

      let size = 0;
      for (let i = 0; i < responseData.layers.length; i++) {
        size += responseData.layers[i].size;
      }

      const manifest: {
        size: string;
        version: number;
        repodigest: string;
        digest:
          | {
              author: string;
              architecture: string;
              os: string;
              created: string;
              env: string[];
              entrypoint: string[];
            }
          | undefined;
      } = {
        size: formatBytes(size),
        version: responseData.schemaVersion,
        digest: await getBlob(responseData.config.digest),
        repodigest: responseData.config.digest,
      };

      if (manifest.digest) {
        navigation.navigate('TagDetails', {
          url: url.replace(/^https?:\/\//, ''),
          repo: repo,
          tag: tag,
          version: manifest.version,
          size: manifest.size,
          architecture: manifest.digest.architecture,
          os: manifest.digest.os,
          created: manifest.digest.created,
          env: manifest.digest.env,
          entrypoint: manifest.digest.entrypoint,
          repodigest: manifest.repodigest,
        });
        setSearchText('');
      } else {
        return showToast('API error: manifest.digest is undefined');
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message);
      } else {
        showToast('An unexpected error occurred');
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
      <FlatList
        data={tags.filter(item => item.includes(searchText))}
        keyExtractor={item => item}
        ListHeaderComponent={
          <RenderSearchBar
            searchText={searchText}
            setSearchText={setSearchText}
            isDarkMode={isDarkMode}
          />
        }
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
