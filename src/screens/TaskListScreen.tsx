import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTasks, deleteTask } from '../services/api';

export default function TaskListScreen({ navigation }: any) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        loadUserAndTasks();
    }, []);

    const loadUserAndTasks = async () => {
        try {
            const userJson = await AsyncStorage.getItem('user');
            console.log("User from AsyncStorage:", userJson);

            if (userJson) {
                const user = JSON.parse(userJson);
                console.log("Parsed user:", user);
                
                const email = user.email;
                console.log("User email:", email);
                setUserEmail(email);

                await fetchTasks(email);
            } else {
                console.log("No user found in AsyncStorage");
            }
        } catch (error) {
            console.error("Error loading user and tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTasks = async (email: string) => {
        try {
            console.log("Fetching tasks for:", email);
            const tasksData = await getTasks(email);
            console.log("Tasks received:", tasksData);
            
            setTasks(tasksData || []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setTasks([]);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            setDeletingId(taskId);
            console.log("Deleting task:", taskId);
            
            const result = await deleteTask(taskId, userEmail);
            console.log("Delete result:", result);
            
            if (result && result.success) {
                setTasks(tasks.filter((task: any) => task.id !== taskId));
                console.log("✅ Task deleted successfully");
            } else {
                console.error("Failed to delete task");
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        } finally {
            setDeletingId(null);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        if (userEmail) {
            await fetchTasks(userEmail);
        }
        setRefreshing(false);
    };

    const renderTask = ({ item }: any) => (
        <View style={styles.taskCard}>
            <View style={styles.taskContent}>
                <View style={styles.taskHeader}>
                    <Text style={styles.taskTitle}>{item.title}</Text>
                    <View style={[
                        styles.statusBadge,
                        item.state === 'COMPLETED' && styles.statusBadgeCompleted
                    ]}>
                        <Text style={[
                            styles.statusText,
                            item.state === 'COMPLETED' && styles.statusTextCompleted
                        ]}>
                            {item.state || 'PENDING'}
                        </Text>
                    </View>
                </View>
                
                {item.description ? (
                    <Text style={styles.taskDescription}>{item.description}</Text>
                ) : null}
                
                <Text style={styles.taskDate}>
                    Created: {new Date(item.createdDate).toLocaleDateString()}
                </Text>
            </View>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTask(item.id)}
                disabled={deletingId === item.id}
                activeOpacity={0.7}
            >
                {deletingId === item.id ? (
                    <ActivityIndicator size="small" color="#dc2626" />
                ) : (
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                )}
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text style={styles.loadingText}>Loading tasks...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
          
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                
                <Text style={styles.headerTitle}>My Tasks</Text>
                
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('Add Task')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
            </View>

            {tasks.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📝</Text>
                    <Text style={styles.emptyTitle}>No tasks yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Start by adding your first task!
                    </Text>
                    <TouchableOpacity
                        style={styles.emptyButton}
                        onPress={() => navigation.navigate('Add Task')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.emptyButtonText}>Add Task</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={tasks}
                    renderItem={renderTask}
                    keyExtractor={(item: any) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#6366f1']}
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#64748b',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        fontSize: 16,
        color: '#6366f1',
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    addButton: {
        backgroundColor: '#6366f1',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    listContent: {
        padding: 24,
    },
    taskCard: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    taskContent: {
        flex: 1,
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0f172a',
        flex: 1,
        marginRight: 12,
    },
    statusBadge: {
        backgroundColor: '#fef3c7',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusBadgeCompleted: {
        backgroundColor: '#d1fae5',
    },
    statusText: {
        fontSize: 11,
        color: '#f59e0b',
        fontWeight: '600',
    },
    statusTextCompleted: {
        color: '#059669',
    },
    taskDescription: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 12,
        lineHeight: 20,
    },
    taskDate: {
        fontSize: 12,
        color: '#94a3b8',
    },
    deleteButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    deleteButtonText: {
        fontSize: 24,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 24,
    },
    emptyButton: {
        backgroundColor: '#6366f1',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    emptyButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});