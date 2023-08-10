import React, {useCallback, useState} from 'react';
import {Button, Image, StyleSheet, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import * as Keychain from 'react-native-keychain';
import {useFocusEffect} from '@react-navigation/native';
import {RootStackParamList} from '../Types';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  navigation: MainScreenNavigationProp;
}

const MainScreen: React.FC<Props> = ({navigation}) => {
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
    <View style={styles.container}>
      <Image source={{uri: 'https://http.cat/200.jpg'}} style={styles.image} />
      <Button
        title="Add Credentials"
        onPress={() => navigation.navigate('Add')}
      />
      <Button
        title="View Credentials"
        onPress={() => navigation.navigate('List')}
        disabled={!hasCredentials}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
});

export default MainScreen;
