import React from 'react';
import {Button, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

type MainScreenNavigationProp = StackNavigationProp<any, 'Main'>;

interface Props {
  navigation: MainScreenNavigationProp;
}

const MainScreen: React.FC<Props> = ({navigation}) => {
  return (
    <View>
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

export default MainScreen;
