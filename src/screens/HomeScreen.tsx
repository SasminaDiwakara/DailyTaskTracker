import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Task Tracker</Text>

      <Button title="View Tasks" onPress={() => navigation.navigate('Tasks')} />
      <Button title="Add Task" onPress={() => navigation.navigate('Add Task')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20
  }
});
