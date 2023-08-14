import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {useDarkMode} from '../../DarkModeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../Types';
import {RouteProp} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import Clipboard from '@react-native-clipboard/clipboard';
import {TouchableOpacity} from 'react-native';

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
      padding: 16,
      backgroundColor: isDark ? '#333' : '#f0f0f0',
    },
    section: {
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#555' : '#ddd',
      paddingBottom: 16,
    },
    header: {
      fontSize: 24,
      fontWeight: '500',
      marginBottom: 10,
      color: isDark ? '#ccc' : '#333',
    },
    metaLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#aaa' : '#555',
    },
    metaData: {
      fontSize: 18,
      marginBottom: 10,
      color: isDark ? '#ccc' : '#333',
    },
    button: {
      padding: 10,
      backgroundColor: isDark ? '#444' : '#ddd',
      borderRadius: 5,
      marginTop: 10,
      alignItems: 'center',
    },
  });
};

type DateAndDaysAgo = {
  formattedDate: string;
  daysAgo: string;
};

function formatDateAndDaysAgo(dateString: string): DateAndDaysAgo {
  const inputDate = new Date(dateString);
  const currentDate = new Date();

  const formattedDate = inputDate.toISOString().split('T')[0];

  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
  const daysDifference = Math.floor(
    (currentDate.getTime() - inputDate.getTime()) / oneDayInMilliseconds,
  );

  let daysAgo = '';
  if (daysDifference === 0) {
    daysAgo = 'Today';
  } else if (daysDifference === 1) {
    daysAgo = '1 day ago';
  } else {
    daysAgo = `${daysDifference} days ago`;
  }

  return {
    formattedDate,
    daysAgo,
  };
}

const TagDetails: React.FC<TagDetailsProps> = ({route, navigation}) => {
  const {isDarkMode} = useDarkMode();
  const dynamicStyles = getDynamicStyles(isDarkMode);
  const {
    url,
    repo,
    tag,
    version,
    size,
    architecture,
    os,
    created,
    env,
    entrypoint,
    repodigest,
  } = route.params;
  const tagdate = formatDateAndDaysAgo(created);

  const copyPullCommand = (textToCopy: string): void => {
    Clipboard.setString(textToCopy);
    Alert.alert('Copied to clipboard!');
  };

  useEffect(() => {
    navigation.setOptions({
      title: tag,
      headerBackTitle: repo,
    });
  }, [navigation, tag, repo]);

  return (
    <ScrollView style={dynamicStyles.container}>
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.header}>Overview</Text>
        <Text style={dynamicStyles.metaLabel}>Tag:</Text>
        <Text style={dynamicStyles.metaData}>{tag}</Text>
        <Text style={dynamicStyles.metaLabel}>Repository:</Text>
        <Text style={dynamicStyles.metaData}>{repo}</Text>
      </View>

      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.metaLabel}>Size:</Text>
        <Text style={dynamicStyles.metaData}>{size}</Text>

        <Text style={dynamicStyles.metaLabel}>Architecture:</Text>
        <Text style={dynamicStyles.metaData}>{architecture}</Text>

        <Text style={dynamicStyles.metaLabel}>OS:</Text>
        <Text style={dynamicStyles.metaData}>{os}</Text>

        <Text style={dynamicStyles.metaLabel}>Created:</Text>
        <Text style={dynamicStyles.metaData}>
          {tagdate.formattedDate} ({tagdate.daysAgo})
        </Text>
      </View>

      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.header}>Extended Information</Text>

        <Text style={dynamicStyles.metaLabel}>Digest</Text>
        <Text style={dynamicStyles.metaData}>{repodigest}</Text>

        <Text style={dynamicStyles.metaLabel}>Docker Version:</Text>
        <Text style={dynamicStyles.metaData}>{version}</Text>

        <Text style={dynamicStyles.metaLabel}>Environment Variables:</Text>
        {env?.map((variable, index) => (
          <Text key={index} style={dynamicStyles.metaData}>
            {'- ' + variable}
          </Text>
        ))}

        <Text style={dynamicStyles.metaLabel}>Entrypoint:</Text>
        {entrypoint ? (
          entrypoint.map((variable, index) => (
            <Text key={index} style={dynamicStyles.metaData}>
              {'- ' + variable}
            </Text>
          ))
        ) : (
          <Text style={dynamicStyles.metaData}>Unknown</Text>
        )}
      </View>

      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.header}>Actions</Text>
        <TouchableOpacity
          style={dynamicStyles.button}
          onPress={() => copyPullCommand(`docker pull ${url}/${repo}:${tag}`)}>
          <Text style={dynamicStyles.metaData}>Copy Pull Command</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={dynamicStyles.button}
          onPress={() => copyPullCommand(repodigest)}>
          <Text style={dynamicStyles.metaData}>Copy Digest</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default TagDetails;
