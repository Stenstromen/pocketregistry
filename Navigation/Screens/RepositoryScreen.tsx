import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import base64 from 'react-native-base64';
import * as Keychain from 'react-native-keychain';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../Types';

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

const RepositoryScreen: React.FC<TagScreenProps> = ({route, navigation}) => {
  const {data} = route.params;
  const [credentials, setCredentials] = useState<{
    username: string;
    password: string;
  }>({
    username: '',
    password: '',
  });

  useEffect(() => {
    navigation.setOptions({
      title: route.params.serviceName.replace(/^https?:\/\//, ''),
    });

    const loadCredentials = async () => {
      const keychainCredentails = await Keychain.getGenericPassword({
        service: route.params.serviceName,
      });

      if (!keychainCredentails) {
        throw new Error('No credentials found for this service');
      }

      const {username, password} = keychainCredentails;

      setCredentials({username, password});
    };

    loadCredentials();
  }, [navigation, route.params.serviceName]);

  const handlePress = async (tag: string) => {
    try {
      const {username, password} = credentials;
      const auth = 'Basic ' + base64.encode(username + ':' + password);

      const response = await fetch(
        `${route.params.serviceName}/v2/${tag}/tags/list`,
        {
          method: 'GET',
          headers: {
            Authorization: auth,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const responseData = await response.json();

      navigation.navigate('TagScreen', {
        repo: tag,
        tags: responseData.tags,
      });
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

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <View>
              <Text style={styles.text}>{item}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  text: {
    padding: 20,
    fontSize: 25,
  },
});

export default RepositoryScreen;
