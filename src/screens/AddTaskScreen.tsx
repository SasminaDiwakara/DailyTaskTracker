import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { addTask } from '../services/api';

export default function AddTaskScreen({ navigation }: any) {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const saveTask = async () => {
    await addTask(title, description);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        style={styles.input}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Description"
        style={styles.input}
        onChangeText={setDescription}
      />
      <Button title="Save Task" onPress={saveTask} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8
  }
});
