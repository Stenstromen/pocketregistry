// React imports
import React, {useEffect, useRef, useState} from 'react';

// React Native components and animations
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

// Navigation related imports
import {StackNavigationProp} from '@react-navigation/stack';

// Contexts
import {useDarkMode} from '../../DarkModeContext';

// Type definitions
import {RootStackParamList} from '../../Types';

// Utilities and helpers
import {showToast} from '../../Utils';

// External libraries and components
import * as Keychain from 'react-native-keychain';
import base64 from 'react-native-base64';
import {SwipeListView} from 'react-native-swipe-list-view';

// ESLint disabling comment
/* eslint-disable @typescript-eslint/no-shadow */

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
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loadCredentials = async () => {
      const availableCredentials =
        await Keychain.getAllGenericPasswordServices();
      setCredentials(availableCredentials.map(service => ({service})));
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
      showToast(
        `${service.replace(/^https?:\/\//, '').replace(/:.*/, '')} removed`,
      );
    } catch (error) {
      showToast('Error deleting ' + service);
    }
  };

  const handlePress = (service: string) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      handleCredentialPress(service);
    });
  };
  const handleCredentialPress = async (url: string) => {
    try {
      const credentials = await Keychain.getGenericPassword({service: url});
      if (credentials) {
        const {username, password} = credentials;
        const repositories = await fetchRepositories(url, username, password);
        navigation.navigate('RepositoryScreen', {
          serviceName: url,
          username,
          password,
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
            onPress={() => handlePress(item.service)}>
            <Animated.View
              style={[
                dynamicStyles.rowFront,
                {transform: [{scale: scaleAnim}]},
              ]}>
              <Text style={dynamicStyles.text}>
                {item.service.replace(/^https?:\/\//, '').replace(/:.*/, '')}
              </Text>
            </Animated.View>
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
