/* eslint-disable @typescript-eslint/no-shadow */
import React, {useEffect, useState} from 'react';
import {
  /* FlatList */
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import * as Keychain from 'react-native-keychain';
import axios from 'axios';
import base64 from 'react-native-base64';
import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  Main: undefined;
  Form: undefined;
  List: undefined;
  RepositoryScreen: {serviceName: string; data: string[]};
};

type FormScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Form'>;

interface Props {
  navigation: FormScreenNavigationProp;
}

const ListScreen: React.FC<Props> = ({navigation}) => {
  const [credentials, setCredentials] = useState<Array<{service: string}>>([]);

  useEffect(() => {
    const loadCredentials = async () => {
      const availableCredentials =
        await Keychain.getAllGenericPasswordServices();
      setCredentials(availableCredentials.map(service => ({service})));
    };

    loadCredentials();
  }, []);

  const handleDelete = async (service: string) => {
    try {
      const result = await Keychain.resetGenericPassword({service});
      if (result) {
        Alert.alert('Credentials deleted successfully!');
        const availableCredentials =
          await Keychain.getAllGenericPasswordServices();
        setCredentials(availableCredentials.map(service => ({service})));
      }
    } catch (error) {
      Alert.alert('Error deleting credentials');
      console.error(error);
    }
  };
  const handleCredentialPress = async (service: string) => {
    try {
      const credentials = await Keychain.getGenericPassword({service});
      if (credentials) {
        const {username, password} = credentials;
        const repositories = await fetchRepositories(
          service,
          username,
          password,
        );
        navigation.navigate('RepositoryScreen', {
          serviceName: service,
          data: repositories,
        });
      } else {
        console.error('No credentials stored for this service');
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
    }
  };

  const fetchRepositories = async (
    hostname: string,
    registryUser: string,
    registryPass: string,
  ) => {
    try {
      const response = await axios.get(`https://${hostname}/v2/_catalog`, {
        headers: {
          Authorization:
            'Basic ' + base64.encode(registryUser + ':' + registryPass),
        },
      });
      return response.data.repositories;
    } catch (error) {
      console.error('Error fetching repositories:', error);
      return [];
    }
  };

  return (
    <View style={styles.container}>
      <SwipeListView
        data={credentials}
        keyExtractor={item => item.service}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleCredentialPress(item.service)}>
            <View style={styles.rowFront}>
              <Text style={styles.text}>{item.service}</Text>
            </View>
          </TouchableOpacity>
        )}
        renderHiddenItem={({item}) => (
          <View style={styles.rowBack}>
            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnRight]}
              onPress={() => {
                handleDelete(item.service);
              }}>
              <Text style={styles.backTextWhite}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-75}
        stopRightSwipe={-75}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    padding: 20,
    fontSize: 25,
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 60,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    //justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  backTextWhite: {
    color: '#FFF',
  },
});

export default ListScreen;
