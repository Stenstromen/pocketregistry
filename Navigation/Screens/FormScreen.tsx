import React, {useState} from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {StackNavigationProp} from '@react-navigation/stack';
import {useDarkMode} from '../../DarkModeContext';
import {RootStackParamList} from '../../Types';

type FormScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  navigation: FormScreenNavigationProp;
}

const getDynamicStyles = (isDark: boolean) => {
  return StyleSheet.create({
    text: {
      padding: 20,
      fontSize: 25,
      color: isDark ? '#ccc' : '#333',
    },
    label: {
      color: isDark ? '#ccc' : '#333',
      fontSize: 18,
      marginLeft: 10,
    },
  });
};

const FormScreen: React.FC<Props> = ({navigation}) => {
  const [hostname, setHostname] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [secure, setSecure] = useState<boolean>(true);

  const {isDarkMode} = useDarkMode();
  const dynamicStyles = getDynamicStyles(isDarkMode);

  const handleSave = async () => {
    const protocol = secure ? 'https://' : 'http://';
    const fullHostname = `${protocol}${hostname}`;

    await Keychain.setGenericPassword(username, password, {
      service: fullHostname,
    });
    navigation.navigate('PocketRegistry');
  };

  return (
    <View>
      <TextInput
        placeholder="Hostname"
        onChangeText={setHostname}
        value={hostname}
        autoFocus
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        style={dynamicStyles.text}
      />
      <TextInput
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        style={dynamicStyles.text}
      />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        style={dynamicStyles.text}
      />
      <View style={styles.checkboxContainer}>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={secure ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setSecure(!secure)}
          value={secure}
          style={styles.checkbox}
        />
        <Text style={dynamicStyles.label}>Secure (https)</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  checkbox: {
    marginTop: 3,
    marginLeft: 15,
  },
});

export default FormScreen;
