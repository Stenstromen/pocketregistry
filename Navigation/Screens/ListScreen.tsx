/* eslint-disable @typescript-eslint/no-shadow */
import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import * as Keychain from 'react-native-keychain';
import base64 from 'react-native-base64';
import {StackNavigationProp} from '@react-navigation/stack';
import {useDarkMode} from '../../DarkModeContext';
import {RootStackParamList} from '../../Types';

type FormScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  navigation: FormScreenNavigationProp;
}

const getDynamicStyles = (isDark: boolean) => {
  return StyleSheet.create({
    text: {
      padding: 20,
      fontSize: 25,
      color: isDark ? '#ccc' : '#333',
    },
    rowFront: {
      alignItems: 'center',
      backgroundColor: isDark ? '#333' : '#fff',
      borderBottomColor: isDark ? '#666' : '#ccc',
      borderBottomWidth: 1,
      justifyContent: 'center',
      height: 60,
    },
    rowBack: {
      alignItems: 'center',
      backgroundColor: isDark ? '#333' : '#fff',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 15,
    },
  });
};

const ListScreen: React.FC<Props> = ({navigation}) => {
  const {isDarkMode} = useDarkMode();
  const dynamicStyles = getDynamicStyles(isDarkMode);
  const [credentials, setCredentials] = useState<Array<{service: string}>>([]);

  useEffect(() => {
    const loadCredentials = async () => {
      const availableCredentials =
        await Keychain.getAllGenericPasswordServices();
      // Update the credentials state.
      setCredentials(availableCredentials.map(service => ({service})));
      // If the credentials list is empty, navigate to 'PocketRegistry'.
      if (availableCredentials.length === 0) {
        navigation.navigate('PocketRegistry');
      }
    };

    loadCredentials();
  }, [navigation, credentials]);

  const handleDelete = async (service: string) => {
    try {
      const result = await Keychain.resetGenericPassword({service});
      if (result) {
        const availableCredentials =
          await Keychain.getAllGenericPasswordServices();
        setCredentials(availableCredentials.map(service => ({service})));
      }
    } catch (error) {
      Alert.alert('Error deleting ' + service);
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
      const auth = 'Basic ' + base64.encode(registryUser + ':' + registryPass);
      const response = await fetch(`${hostname}/v2/_catalog`, {
        method: 'GET',
        headers: {
          Authorization: auth,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const responseData = await response.json();
      return responseData.repositories;
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
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => handleCredentialPress(item.service)}>
            <View style={dynamicStyles.rowFront}>
              <Text style={dynamicStyles.text}>
                {item.service.replace(/^https?:\/\//, '')}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        renderHiddenItem={({item}) => (
          <View style={dynamicStyles.rowBack}>
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
