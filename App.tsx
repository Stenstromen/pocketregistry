/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import MainScreen from './MainScreen';
import FormScreen from './FormScreen';
import ListScreen from './ListScreen';
import {APP_USERNAME, APP_PASSWORD} from '@env';
import axios from 'axios';
import base64 from 'react-native-base64';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  //SafeAreaView,
  ScrollView,
  //StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  //View,
  TouchableOpacity,
} from 'react-native';

import {
  Colors,
  //DebugInstructions,
  //LearnMoreLinks,
  //ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const registryUser = APP_USERNAME;
const registryPass = APP_PASSWORD;

const Stack = createStackNavigator<RootStackParamList>();

interface RepositoriesProps {
  navigation: any;
}

function Repositories({navigation}: RepositoriesProps): JSX.Element {
  const [data, setData] = useState<{
    repositories: string[];
  }>({
    repositories: [],
  });
  const isDarkMode = useColorScheme() === 'dark';
  const styless = StyleSheet.create({
    item: {
      padding: 20,
      fontSize: 15,
      marginTop: 5,
      color: isDarkMode ? Colors.white : Colors.black,
      backgroundColor: isDarkMode ? Colors.black : Colors.white,
    },
  });

  useEffect(() => {
    axios
      .get('https://dockr.it/v2/_catalog', {
        headers: {
          Authorization:
            'Basic ' + base64.encode(registryUser + ':' + registryPass),
        },
      })
      .then(response => {
        setData(response.data);
      });
  }, []);
  return (
    <ScrollView>
      {data.repositories.map((repo, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            navigation.navigate('Details', {
              repo: repo,
            });
          }}>
          <Text key={repo} style={styless.item}>
            {repo}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

type RootStackParamList = {
  Home: undefined;
  Details: {
    repo: string;
  };
};

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
type DetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Details'
>;

type Props = {
  route: DetailsScreenRouteProp;
  navigation: DetailsScreenNavigationProp;
};

function Tags({route}: Props): JSX.Element {
  const {repo} = route.params;
  const [data, setData] = useState<{
    name: string;
    tags: string[];
  } | null>({
    name: '',
    tags: [],
  });
  const isDarkMode = useColorScheme() === 'dark';
  const styless = StyleSheet.create({
    item: {
      padding: 20,
      fontSize: 15,
      marginTop: 5,
      color: isDarkMode ? Colors.white : Colors.black,
      backgroundColor: isDarkMode ? Colors.black : Colors.white,
    },
  });

  useEffect(() => {
    axios
      .get(`https://dockr.it/v2/${repo}/tags/list`, {
        headers: {
          Authorization:
            'Basic ' + base64.encode(registryUser + ':' + registryPass),
        },
      })
      .then(response => {
        setData(response.data);
      });
  }, [repo]);

  return (
    <ScrollView>
      {data?.tags.map((tag, index) => (
        <TouchableOpacity key={index}>
          <Text style={styless.item} key={tag}>
            {tag}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Form" component={FormScreen} />
        <Stack.Screen name="List" component={ListScreen} />
        {/*         <Stack.Screen name="Home" component={Repositories} />
        <Stack.Screen name="Details" component={Tags} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
  },
  item: {
    padding: 20,
    fontSize: 15,
    marginTop: 5,
    backgroundColor: '#f0f0f0',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
}); */

export default App;
