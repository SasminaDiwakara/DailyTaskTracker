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
    SafeAreaView,
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
            if (userJson) {
                const user = JSON.parse(userJson);
                setUserEmail(user.email);
                await fetchTasks(user.email);
            }
        } catch (error) {
            console.error("Error loading:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTasks = async (email: string) => {
        try {
            const tasksData = await getTasks(email);
            setTasks(tasksData || []);
        } catch (error) {
            setTasks([]);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            setDeletingId(taskId);
            const result = await deleteTask(taskId, userEmail);
            if (result?.success) {
                setTasks(tasks.filter((task: any) => task.id !== taskId));
            }
        } finally {
            setDeletingId(null);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        if (userEmail) await fetchTasks(userEmail);
        setRefreshing(false);
    };

    const renderTask = ({ item }: any) => {
        const isCompleted = item.state === 'COMPLETED';

        return (
            <View style={[styles.taskCard, isCompleted ? styles.taskCardCompleted : styles.taskCardPending]}>
                <View style={styles.taskContent}>
                    <View style={styles.taskHeader}>
                        <Text style={[styles.taskTitle, isCompleted && styles.textStrikethrough]}>
                            {item.title}
                        </Text>
                        <View style={[styles.statusBadge, isCompleted ? styles.badgeCompleted : styles.badgePending]}>
                            <Text style={[styles.statusText, isCompleted ? styles.textCompleted : styles.textPending]}>
                                {isCompleted ? 'Done' : 'In Progress'}
                            </Text>
                        </View>
                    </View>
                    
                    {item.description ? (
                        <Text style={styles.taskDescription} numberOfLines={2}>
                            {item.description}
                        </Text>
                    ) : null}
                    
                    <View style={styles.taskFooter}>
                        <Text style={styles.taskDate}>
                            📅 {new Date(item.createdDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.deleteIconButton}
                    onPress={() => handleDeleteTask(item.id)}
                    disabled={deletingId === item.id}
                >
                    {deletingId === item.id ? (
                        <ActivityIndicator size="small" color="#ef4444" />
                    ) : (
                        <Text style={styles.deleteEmoji}>✕</Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4f46e5" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerSubtitle}>Hello!</Text>
                    <Text style={styles.headerTitle}>My Tasks</Text>
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('Add Task')}
                >
                    <Text style={styles.addButtonText}>+ New Task</Text>
                </TouchableOpacity>
            </View>

            {tasks.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIllustration}>
                        <Text style={styles.emptyIcon}>✨</Text>
                    </View>
                    <Text style={styles.emptyTitle}>All caught up!</Text>
                    <Text style={styles.emptySubtitle}>You don't have any tasks for today.</Text>
                </View>
            ) : (
                <FlatList
                    data={tasks}
                    renderItem={renderTask}
                    keyExtractor={(item: any) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4f46e5" />
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcfcfd',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1e293b',
    },
    addButton: {
        backgroundColor: '#4f46e5',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        shadowColor: '#4f46e5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    addButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    taskCard: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    taskCardPending: {
        borderLeftWidth: 5,
        borderLeftColor: '#6366f1',
    },
    taskCardCompleted: {
        borderLeftWidth: 5,
        borderLeftColor: '#10b981',
        opacity: 0.8,
    },
    taskContent: {
        flex: 1,
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#334155',
        flex: 1,
        marginRight: 8,
    },
    textStrikethrough: {
        textDecorationLine: 'line-through',
        color: '#94a3b8',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgePending: { backgroundColor: '#eef2ff' },
    badgeCompleted: { backgroundColor: '#ecfdf5' },
    statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
    textPending: { color: '#6366f1' },
    textCompleted: { color: '#10b981' },
    taskDescription: {
        fontSize: 13,
        color: '#64748b',
        lineHeight: 18,
        marginBottom: 12,
    },
    taskFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskDate: {
        fontSize: 11,
        fontWeight: '600',
        color: '#94a3b8',
    },
    deleteIconButton: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#fff1f2',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: 12,
    },
    deleteEmoji: {
        color: '#ef4444',
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    emptyIllustration: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyIcon: { fontSize: 40 },
    emptyTitle: { fontSize: 20, fontWeight: '700', color: '#1e293b' },
    emptySubtitle: { fontSize: 15, color: '#94a3b8', marginTop: 4 },
});