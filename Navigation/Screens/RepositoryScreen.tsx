// React imports
import React, {useEffect, useState} from 'react';

// React Native components
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

// Navigation related imports
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

// Custom components
import SearchBar from '../../Components/SearchBar';

// Contexts
import {useDarkMode} from '../../DarkModeContext';

// Type definitions
import {RootStackParamList, RenderSearchBarProps} from '../../Types';

// Utilities and helpers
import {fetchTags} from '../../Api';
import {showToast} from '../../Utils';

type RepositoryScreenRouteProp = RouteProp<
  RootStackParamList,
  'RepositoryScreen'
>;
type RepositoryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RepositoryScreen'
>;

type TagScreenProps = {
  route: RepositoryScreenRouteProp;
  navigation: RepositoryScreenNavigationProp;
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

const RepositoryScreen: React.FC<TagScreenProps> = ({route, navigation}) => {
  const {isDarkMode} = useDarkMode();
  const dynamicStyles = getDynamicStyles(isDarkMode);
  const {data, username, password} = route.params;
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    navigation.setOptions({
      title: route.params.serviceName
        .replace(/^https?:\/\//, '')
        .replace(/:.*/, ''),
    });
  }, [navigation, route.params.serviceName]);

  const handlePress = async (tag: string) => {
    try {
      const response = await fetchTags(
        route.params.serviceName,
        username,
        password,
        tag,
      );

      if (!response.ok) {
        showToast('Network response was not ok.');
      }

      const responseData = await response.json();

      if (!responseData.tags) {
        return showToast('No tags found for this repository');
      }

      navigation.navigate('TagScreen', {
        repo: tag,
        tags: responseData.tags,
        url: route.params.serviceName,
        username: username,
        password: password,
      });
      setSearchText('');
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message);
      } else {
        showToast('An unexpected error occurred' + error);
      }
    }
  };

  return (
    <View style={dynamicStyles.container}>
      <FlatList
        data={data.filter(item => item.includes(searchText))}
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

export default RepositoryScreen;
