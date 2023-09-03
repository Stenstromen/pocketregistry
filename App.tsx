// React imports
import React from 'react';

// React Navigation imports
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// Contexts
import {DarkModeProvider, useDarkMode} from './DarkModeContext';

// Type definitions
import {RootStackParamList} from './Types';

// Screens
import MainScreen from './Navigation/MainScreen';
import FormScreen from './Navigation/Screens/FormScreen';
import ListScreen from './Navigation/Screens/ListScreen';
import RepositoryScreen from './Navigation/Screens/RepositoryScreen';
import TagScreen from './Navigation/Screens/TagScreen';
import TagDetails from './Navigation/Screens/TagDetails';

// External libraries
import {RootSiblingParent} from 'react-native-root-siblings';

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
          <Stack.Screen name="RegistryPort" component={MainScreen} />
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
          <Stack.Screen name="TagDetails" component={TagDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </DarkModeProvider>
  );
}

function App(): JSX.Element {
  return (
    <RootSiblingParent>
      <DarkModeProvider>
        <StackNavigator />
      </DarkModeProvider>
    </RootSiblingParent>
  );
}

export default App;
