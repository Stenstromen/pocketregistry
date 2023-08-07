/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import MainScreen from './MainScreen';
import FormScreen from './FormScreen';
import ListScreen from './ListScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import RepositoryScreen from './RepositoryScreen';
import TagScreen from './TagScreen';

type RootStackParamList = {
  PocketRegistry: undefined;
  Form: undefined;
  List: undefined;
  RepositoryScreen: {
    data: string[];
    serviceName: string;
  };
  TagScreen: {
    tags: string[];
    repo: string;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="PocketRegistry" component={MainScreen} />
        <Stack.Screen name="Form" component={FormScreen} />
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen
          name="RepositoryScreen"
          component={RepositoryScreen}
          options={({route}) => ({title: route.params.serviceName})}
        />
        <Stack.Screen
          name="TagScreen"
          component={TagScreen}
          options={({route}) => ({title: route.params.repo})}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
