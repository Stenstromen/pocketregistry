import React, {useEffect} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useDarkMode} from '../../DarkModeContext';
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

const getDynamicStyles = (isDark: boolean) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#333' : '#f0f0f0',
    },
    text: {
      padding: 20,
      fontSize: 25,
      color: isDark ? '#ccc' : '#333',
    },
  });
};

const TagScreen: React.FC<TagScreenProps> = ({route, navigation}) => {
  const {isDarkMode} = useDarkMode();
  const dynamicStyles = getDynamicStyles(isDarkMode);
  const {tags} = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: route.params.repo,
    });
  }, [navigation, route.params.repo]);

  return (
    <View style={dynamicStyles.container}>
      <FlatList
        data={tags}
        keyExtractor={item => item}
        renderItem={({item}) => <Text style={dynamicStyles.text}>{item}</Text>}
      />
    </View>
  );
};

export default TagScreen;
