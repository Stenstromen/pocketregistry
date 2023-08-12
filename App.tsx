import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {DarkModeProvider} from './DarkModeContext';
import {useDarkMode} from './DarkModeContext';
import {RootStackParamList} from './Types';
import MainScreen from './Navigation/MainScreen';
import FormScreen from './Navigation/Screens/FormScreen';
import ListScreen from './Navigation/Screens/ListScreen';
import RepositoryScreen from './Navigation/Screens/RepositoryScreen';
import TagScreen from './Navigation/Screens/TagScreen';
import TagDetails from './Navigation/Screens/TagDetails';

const Stack = createStackNavigator<RootStackParamList>();

function StackNavigator(): JSX.Element {
  const {isDarkMode} = useDarkMode();
  const theme = isDarkMode ? DarkTheme : DefaultTheme;

  return (
    <DarkModeProvider>
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: isDarkMode ? '#333' : '#fff',
            },
            headerTintColor: isDarkMode ? '#fff' : '#000',
            cardStyle: {
              backgroundColor: isDarkMode ? '#333' : '#fff',
            },
          }}>
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
            options={({route}) => ({
              title: route.params.repo,
            })}
          />
          <Stack.Screen
            name="TagDetails"
            component={TagDetails}
            /*             options={({route}) => ({
              size: route.params.size,
              architecture: route.params.architecture,
              os: route.params.os,
              author: route.params.author,
              created: route.params.created,
            })} */
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DarkModeProvider>
  );
}

function App(): JSX.Element {
  return (
    <DarkModeProvider>
      <StackNavigator />
    </DarkModeProvider>
  );
}

export default App;
