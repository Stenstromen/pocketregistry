import React, {useCallback, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import * as Keychain from 'react-native-keychain';
import {useFocusEffect} from '@react-navigation/native';
import {useDarkMode} from '../DarkModeContext';
import {RootStackParamList} from '../Types';

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
      backgroundColor: isDark ? '#333' : '#fff', // dark background for dark mode, white for light mode
    },
    image: {
      width: 300,
      height: 200,
      marginBottom: 20,
      tintColor: isDark ? 'white' : 'black', // this will change the color of the image, make sure it makes sense for your image
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
      <Image source={{uri: 'https://http.cat/200.jpg'}} style={styles.image} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Add')}>
        <Text style={styles.buttonText}>Add Credentials</Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={!hasCredentials}
        style={[styles.button, !hasCredentials && styles.buttonDisabled]}
        onPress={() => navigation.navigate('List')}>
        <Text style={styles.buttonText}>View Credentials</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    margin: 10,
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A9A9A9', // Disabled color
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default MainScreen;
