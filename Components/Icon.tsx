import React from 'react';
import AntIcon from 'react-native-vector-icons/AntDesign';

const Icon = ({
  name,
  size,
  isDarkMode,
}: {
  name: string;
  size?: number | undefined;
  isDarkMode: boolean;
}) => {
  let nsize = size || 16;
  return (
    <>
      <AntIcon name={name} size={nsize} color={isDarkMode ? '#ccc' : '#333'} />{' '}
    </>
  );
};

export default Icon;
