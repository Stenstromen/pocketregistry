import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import * as Keychain from 'react-native-keychain';

const ListScreen: React.FC = () => {
  const [credentials, setCredentials] = useState<Array<{service: string}>>([]);

  useEffect(() => {
    const loadCredentials = async () => {
      const availableCredentials =
        await Keychain.getAllGenericPasswordServices();
      setCredentials(availableCredentials.map(service => ({service})));
    };

    loadCredentials();
  }, []);

  return (
    <View>
      <FlatList
        data={credentials}
        keyExtractor={item => item.service}
        renderItem={({item}) => <Text>{item.service}</Text>}
      />
    </View>
  );
};

export default ListScreen;
