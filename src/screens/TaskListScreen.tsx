import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Alert
} from 'react-native';
import { getTasks } from '../services/api';

export default function TaskListScreen({ navigation }: any) {
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadTasks = async () => {
    setRefreshing(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load tasks');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation?.addListener('focus', () => {
      loadTasks();
    });
    return unsubscribe;
  }, [navigation]);

  const handleEditTask = (task: any) => {
    Alert.alert('Edit Task', `Edit functionality for: ${task.title}`);
  };

  // const handleDeleteTask = (taskId: number, taskTitle: string) => {
  //   Alert.alert(
  //     'Delete Task',
  //     `Are you sure you want to delete "${taskTitle}"?`,
  //     [
  //       { text: 'Cancel', style: 'cancel' },
  //       { 
  //         text: 'Delete', 
  //         style: 'destructive',
  //         onPress: async () => {
  //           try {
  //             await deleteTask(taskId);
  //             loadTasks();
  //             Alert.alert('Success', 'Task deleted successfully');
  //           } catch (error) {
  //             Alert.alert('Error', 'Failed to delete task');
  //           }
  //         }
  //       }
  //     ]
  //   );
  // };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <View style={styles.emptyIconCircle}>
          <Text style={styles.emptyIconText}>!</Text>
        </View>
      </View>
      <Text style={styles.emptyTitle}>No tasks yet</Text>
      <Text style={styles.emptySubtitle}>Add your first task to get started!</Text>
      <TouchableOpacity
        style={styles.emptyAddButton}
        onPress={() => navigation?.navigate('Add Task')}
        activeOpacity={0.8}
      >
        <Text style={styles.emptyAddButtonText}>+ Create Task</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTask = ({ item }: any) => (
    <View style={styles.taskCard}>
<View style={styles.taskRow}>
  <View style={styles.taskMainContent}>
    <Text style={styles.taskTitle}>{item.title}</Text>
    {item.description && (
      <Text style={styles.taskDescription} numberOfLines={2}>
        {item.description}
      </Text>
    )}
  </View>

  <TouchableOpacity style={styles.completeBtn}>
    <Text style={styles.completeBtnText}>✓</Text>
  </TouchableOpacity>
</View>


      <View style={styles.cardBottom}>
        <View style={styles.dateContainer}>
          <Text style={styles.taskDate}>
            {new Date(item.createdDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditTask(item)}
            activeOpacity={0.7}
          >
            <View style={styles.buttonIcon}>
              <View style={styles.editIconLine1} />
              <View style={styles.editIconLine2} />
            </View>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>

          <View style={styles.buttonDivider} />

          <TouchableOpacity
            style={styles.deleteButton}
            activeOpacity={0.7}
          >
            <View style={styles.buttonIcon}>
              <View style={styles.deleteIconLine} />
            </View>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Tasks</Text>
          <Text style={styles.headerSubtitle}>
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation?.navigate('Add Task')}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderTask}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={[
          styles.listContent,
          tasks.length === 0 && styles.listContentEmpty
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadTasks}
            colors={['#6366f1']}
            tintColor="#6366f1"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '300',
    marginTop: -2,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  taskCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  cardTop: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 12,
  },
  checkboxContainer: {
    paddingTop: 2,
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  taskMainContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 6,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  taskDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginTop: 2,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fafbfc',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateIcon: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#94a3b8',
    marginRight: 6,
  },
  taskDate: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  buttonIcon: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  editIconLine1: {
    width: 10,
    height: 2,
    backgroundColor: '#6366f1',
    position: 'absolute',
    top: 3,
    borderRadius: 1,
  },
  editIconLine2: {
    width: 10,
    height: 2,
    backgroundColor: '#6366f1',
    position: 'absolute',
    bottom: 3,
    borderRadius: 1,
  },
  deleteIconLine: {
    width: 12,
    height: 2,
    backgroundColor: '#ef4444',
    borderRadius: 1,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366f1',
  },
  deleteButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ef4444',
  },
  buttonDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#e2e8f0',
  },
  emptyIconText: {
    fontSize: 52,
    color: '#94a3b8',
    fontWeight: '300',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  emptyAddButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 36,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  emptyAddButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  completeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  completeBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});