import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import * as Keychain from 'react-native-keychain';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../Types';

type FormScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  navigation: FormScreenNavigationProp;
}

const FormScreen: React.FC<Props> = ({navigation}) => {
  const [hostname, setHostname] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [secure, setSecure] = useState<boolean>(true);

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
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={secure}
          onValueChange={setSecure}
          style={styles.checkbox}
        />
        <Text style={styles.label}>Secure (https)</Text>
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
  text: {
    padding: 20,
    fontSize: 25,
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
  label: {
    fontSize: 18,
    marginLeft: 10,
  },
});

export default FormScreen;
