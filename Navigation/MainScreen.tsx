// React imports
import React, {useCallback, useState} from 'react';

// React Native imports
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  navigation: MainScreenNavigationProp;
}

const getDynamicStyles = (isDark: boolean) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between', // new
      alignItems: 'center',
      backgroundColor: isDark ? '#333' : '#fff',
      paddingTop: 20,
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
  const adUnitId = 'ca-app-pub-3571877886198893/2929576432';

  const loadCredentials = useCallback(async () => {
    const availableCredentials = await Keychain.getAllGenericPasswordServices();
    const filteredCredentials = availableCredentials.filter(
      service => service !== 'se.stenstrom.registryport',
    );

    setHasCredentials(filteredCredentials.length - 1 > 0);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCredentials();
      return () => {};
    }, [loadCredentials]),
  );

  return (
    <View style={dynamicStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
      </ScrollView>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={error => {
          console.error('Ad failed to load:', error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 200,
    marginBottom: 140,
  },
  buttonContainer: {
    flex: 1,
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
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainScreen;
