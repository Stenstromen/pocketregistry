import React from 'react';
import {Button, Image, StyleSheet, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

type MainScreenNavigationProp = StackNavigationProp<any, 'Main'>;

interface Props {
  navigation: MainScreenNavigationProp;
}

const MainScreen: React.FC<Props> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Image source={{uri: 'https://http.cat/200.jpg'}} style={styles.image} />
      <Button
        title="Add Credentials"
        onPress={() => navigation.navigate('Form')}
      />
      <Button
        title="View Credentials"
        onPress={() => navigation.navigate('List')}
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
