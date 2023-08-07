import axios from 'axios';
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

const RepositoryScreen: React.FC<any> = ({route, navigation}) => {
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
      title: route.params.serviceName,
    });

    const loadCredentials = async () => {
      const keychainCredentails = await Keychain.getGenericPassword(
        route.params.serviceName,
      );

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

      const response = await axios.get(
        `https://${route.params.serviceName}/v2/${tag}/tags/list`,
        {
          headers: {
            Authorization: 'Basic ' + base64.encode(username + ':' + password),
          },
        },
      );

      navigation.navigate('TagScreen', {
        repo: tag,
        tags: response.data.tags,
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
