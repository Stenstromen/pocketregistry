import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from './Types';
import MainScreen from './Navigation/MainScreen';
import FormScreen from './Navigation/Screens/FormScreen';
import ListScreen from './Navigation/Screens/ListScreen';
import RepositoryScreen from './Navigation/Screens/RepositoryScreen';
import TagScreen from './Navigation/Screens/TagScreen';

const Stack = createStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="PocketRegistry" component={MainScreen} />
        <Stack.Screen name="Add" component={FormScreen} />
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
