import React, {useEffect} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../Types';

type TagScreenRouteProp = RouteProp<RootStackParamList, 'TagScreen'>;
type TagScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'TagScreen'
>;

type TagScreenProps = {
  route: TagScreenRouteProp;
  navigation: TagScreenNavigationProp;
};

const TagScreen: React.FC<TagScreenProps> = ({route, navigation}) => {
  const {tags} = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: route.params.repo,
    });
  }, [navigation, route.params.repo]);

  return (
    <View style={styles.container}>
      <FlatList
        data={tags}
        keyExtractor={item => item}
        renderItem={({item}) => <Text style={styles.text}>{item}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  text: {
    padding: 20,
    fontSize: 25,
  },
});

export default TagScreen;
