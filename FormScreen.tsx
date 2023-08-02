import React, {useState} from 'react';
import {Button, TextInput, View} from 'react-native';
import * as Keychain from 'react-native-keychain';

const FormScreen: React.FC = () => {
  const [hostname, setHostname] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSave = async () => {
    await Keychain.setGenericPassword(username, password, {service: hostname});
    alert('Credentials saved!');
  };

  return (
    <View>
      <TextInput
        placeholder="Hostname"
        onChangeText={setHostname}
        value={hostname}
      />
      <TextInput
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

export default FormScreen;
function alert(_arg0: string) {
  throw new Error('Function not implemented.');
}
