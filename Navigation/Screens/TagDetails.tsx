import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useDarkMode} from '../../DarkModeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../Types';
import {RouteProp} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';

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
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
      color: isDark ? '#ccc' : '#333',
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
  });
};

type DateAndDaysAgo = {
  formattedDate: string;
  daysAgo: string;
};

function formatDateAndDaysAgo(dateString: string): DateAndDaysAgo {
  const inputDate = new Date(dateString);
  const currentDate = new Date();

  // Format the date to "YYYY-MM-DD"
  const formattedDate = inputDate.toISOString().split('T')[0];

  // Compute days difference
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
  const {repo, tag, size, architecture, os, author, created} = route.params;
  const tagdate = formatDateAndDaysAgo(created);

  useEffect(() => {
    navigation.setOptions({
      title: tag,
      headerBackTitle: repo,
    });
  }, [navigation, tag, repo]);

  return (
    <ScrollView style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Tag Details</Text>

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

        <Text style={dynamicStyles.metaLabel}>Author:</Text>
        <Text style={dynamicStyles.metaData}>
          {author ? author : 'Unknown'}
        </Text>

        <Text style={dynamicStyles.metaLabel}>Created:</Text>
        <Text style={dynamicStyles.metaData}>
          {tagdate.formattedDate} ({tagdate.daysAgo})
        </Text>
      </View>

      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.header}>Extended Information</Text>

        <Text style={dynamicStyles.metaLabel}>Environment Variables:</Text>
        <Text style={dynamicStyles.metaData}>Environment Variables:</Text>

        <Text style={dynamicStyles.metaLabel}>Docker Version:</Text>
        <Text style={dynamicStyles.metaData}>Docker Version</Text>

        <Text style={dynamicStyles.metaLabel}>Base Image:</Text>
        <Text style={dynamicStyles.metaData}>Base Image</Text>

        <Text style={dynamicStyles.metaLabel}>Entrypoint:</Text>
        <Text style={dynamicStyles.metaData}>Entrypoint</Text>
      </View>

      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.header}>Actions</Text>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum officiis
          quis quae cumque obcaecati aperiam accusamus tempore, voluptas
          eligendi aspernatur quasi quisquam maxime corporis vero, quas magni
          dicta molestias fugiat?
        </Text>
      </View>
    </ScrollView>
  );
};

export default TagDetails;
