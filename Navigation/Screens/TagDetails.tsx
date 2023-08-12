import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useDarkMode} from '../../DarkModeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../Types';
import {RouteProp} from '@react-navigation/native';

type TagDetailsScreenRouteProp = RouteProp<RootStackParamList, 'TagDetails'>;
type TagDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'TagDetails'
>;

type TagDetailsProps = {
  route: TagDetailsScreenRouteProp;
  navigation: TagDetailsScreenNavigationProp;
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

const TagDetails: React.FC<TagDetailsProps> = ({route, navigation}) => {
  const {isDarkMode} = useDarkMode();
  const dynamicStyles = getDynamicStyles(isDarkMode);
  const {size, architecture, os, author} = route.params;
  return (
    <View style={dynamicStyles.container}>
      <Text>Tag Details</Text>
      <Text>Size: {size}</Text>
      <Text>Architecture: {architecture}</Text>
      <Text>OS: {os}</Text>
      <Text>Author: {author}</Text>
    </View>
  );
};

export default TagDetails;
