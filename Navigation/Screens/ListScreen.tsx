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
import {fetchRepositories} from '../../Api';
import {showToast} from '../../Utils';
import Icon from '../../Components/Icon';

// External libraries and components
import * as Keychain from 'react-native-keychain';
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
      flex: 1,
      padding: 18,
      fontSize: 25,
      color: isDark ? '#ccc' : '#333',
      marginRight: 15,
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
  const [pressedItemKey, setPressedItemKey] = useState<string | null>(null);
  const [needsReload, setNeedsReload] = useState(true);

  useEffect(() => {
    if (needsReload) {
      const loadCredentials = async () => {
        const availableCredentials =
          await Keychain.getAllGenericPasswordServices();
        const filteredCredentials = availableCredentials.filter(
          service => service !== 'se.stenstromen.registryport',
        );

        setCredentials(filteredCredentials.map(service => ({service})));

        if (
          filteredCredentials.length === 0 ||
          (availableCredentials.length === 1 &&
            availableCredentials[0] === 'se.stenstromen.registryport')
        ) {
          navigation.navigate('RegistryPort');
        }

        setNeedsReload(false);
      };

      loadCredentials();
    }
  }, [navigation, credentials, needsReload]);

  const handleDelete = async (service: string) => {
    try {
      const result = await Keychain.resetGenericPassword({service});
      if (result) {
        const availableCredentials =
          await Keychain.getAllGenericPasswordServices();
        setCredentials(availableCredentials.map(service => ({service})));
        setNeedsReload(true);
      }
      showToast(
        `${service.replace(/^https?:\/\//, '').replace(/:.*/, '')} removed`,
      );
    } catch (error) {
      showToast('Error deleting ' + service);
    }
  };

  const handlePress = (service: string, key: string) => {
    setPressedItemKey(key);
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

        if (repositories.length === 0) {
          throw new Error('No repositories found');
        }

        navigation.navigate('RepositoryScreen', {
          serviceName: url,
          username,
          password,
          data: repositories,
        });
        setPressedItemKey(null);
      } else {
        showToast('No credentials stored for this service');
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast('Error: ' + error.message);
      } else {
        showToast('An unexpected error occurred.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <SwipeListView
        data={credentials}
        keyExtractor={item => item.service}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => handlePress(item.service, item.service)}
              style={dynamicStyles.rowFront}>
              <Animated.View
                style={[
                  styles.item,
                  pressedItemKey === item.service
                    ? {transform: [{scale: scaleAnim}]}
                    : {},
                ]}>
                <View style={styles.listItem}>
                  <Text style={dynamicStyles.text}>
                    {item.service
                      .replace(/^https?:\/\//, '')
                      .replace(/:.*/, '')}
                  </Text>
                  <Text>
                    <Icon name="doubleleft" size={25} isDarkMode={isDarkMode} />
                  </Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          );
        }}
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  item: {
    width: '100%',
  },
});

export default ListScreen;
