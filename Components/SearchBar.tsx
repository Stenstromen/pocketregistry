import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

type SearchBarProps = {
  value: string;
  onChange: (text: string) => void;
  isDarkMode: boolean;
};

const SearchBar: React.FC<SearchBarProps> = ({value, onChange, isDarkMode}) => {
  const dynamicStyles = getDynamicStyles(isDarkMode);

  return (
    <View style={dynamicStyles.container}>
      <TextInput
        style={dynamicStyles.input}
        value={value}
        onChangeText={onChange}
        placeholder="Search..."
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
      />
    </View>
  );
};

const getDynamicStyles = (isDark: boolean) => {
  return StyleSheet.create({
    container: {
      padding: 8,
      backgroundColor: isDark ? '#333' : '#f0f0f0',
      borderBottomWidth: 1,
      borderColor: isDark ? '#555' : '#e0e0e0',
    },
    input: {
      height: 40,
      paddingHorizontal: 10,
      backgroundColor: isDark ? '#444' : '#fff',
      borderRadius: 5,
      borderColor: isDark ? '#555' : '#ccc',
      borderWidth: 1,
      color: isDark ? '#ccc' : '#333',
    },
  });
};

export default SearchBar;
