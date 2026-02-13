import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTheme = async (theme: string) => {
  await AsyncStorage.setItem('theme', theme);
};

export const getTheme = async () => {
  return await AsyncStorage.getItem('theme');
};
