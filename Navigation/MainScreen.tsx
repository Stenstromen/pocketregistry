// React imports
import React, {useCallback, useState} from 'react';

// React Native imports
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

// Navigation related imports
import {StackNavigationProp} from '@react-navigation/stack';
import {useFocusEffect} from '@react-navigation/native';

// Custom hooks and context
import {useDarkMode} from '../DarkModeContext';

// Custom Image
import whaleImage from '../assets/whale.png';

// Types and models
import {RootStackParamList} from '../Types';

// External libraries
import * as Keychain from 'react-native-keychain';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  navigation: MainScreenNavigationProp;
}

const getDynamicStyles = (isDark: boolean) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#333' : '#fff',
    },
    image: {
      width: 300,
      height: 200,
      marginBottom: 20,
      tintColor: isDark ? 'white' : 'black',
    },
  });
};

const MainScreen: React.FC<Props> = ({navigation}) => {
  const {isDarkMode} = useDarkMode();
  const dynamicStyles = getDynamicStyles(isDarkMode);
  const [hasCredentials, setHasCredentials] = useState<boolean>(false);

  const loadCredentials = useCallback(async () => {
    const availableCredentials = await Keychain.getAllGenericPasswordServices();
    setHasCredentials(availableCredentials.length > 0);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCredentials();
      return () => {};
    }, [loadCredentials]),
  );
  return (
    <View style={dynamicStyles.container}>
      <Image source={whaleImage} style={styles.image} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Add')}>
          <Text style={styles.buttonText}>Add Registry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!hasCredentials}
          style={[styles.button, !hasCredentials && styles.buttonDisabled]}
          onPress={() => navigation.navigate('List')}>
          <Text style={styles.buttonText}>View Registries</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 80,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#A9A9A9',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    width: 256,
    textAlign: 'center',
  },
});

export default MainScreen;
