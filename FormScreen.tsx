import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  PocketRegistry: undefined;
  Form: undefined;
  List: undefined;
};

type FormScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Form'>;

interface Props {
  navigation: FormScreenNavigationProp;
}

const FormScreen: React.FC<Props> = ({navigation}) => {
  const [hostname, setHostname] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSave = async () => {
    await Keychain.setGenericPassword(username, password, {service: hostname});
    Alert.alert('Credentials saved!');
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
        style={styles.text}
      />
      <TextInput
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        style={styles.text}
      />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        style={styles.text}
      />
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
  text: {
    padding: 20,
    fontSize: 25,
  },
});

export default FormScreen;
