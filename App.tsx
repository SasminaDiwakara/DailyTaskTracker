import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import TaskListScreen from './src/screens/TaskListScreen';
import AddTaskScreen from './src/screens/AddTaskScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Tasks" component={TaskListScreen} />
        <Stack.Screen name="Add Task" component={AddTaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
