import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation, route }: any) {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      console.log("User from AsyncStorage:", userJson);
      
      if (userJson) {
        const user = JSON.parse(userJson);
        console.log("Parsed user:", user);
      
        setUserName(user.username || 'User');
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out...");
      await AsyncStorage.removeItem("user");
      console.log("User removed from AsyncStorage");
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Welcome back, {userName}!</Text>
            <Text style={styles.title}>Daily Task Tracker</Text>
            <Text style={styles.subtitle}>Stay organized and productive</Text>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={logout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Tasks')}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📋</Text>
          </View>
          <Text style={styles.cardTitle}>View Tasks</Text>
          <Text style={styles.cardSubtitle}>Check your daily tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardSecondary]}
          onPress={() => navigation.navigate('Add Task')}
          activeOpacity={0.8}
        >
          <View style={[styles.iconContainer, styles.iconContainerSecondary]}>
            <Text style={styles.icon}>➕</Text>
          </View>
          <Text style={styles.cardTitle}>Add Task</Text>
          <Text style={styles.cardSubtitle}>Create a new task</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  logoutText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 30,
    backgroundColor: '#6366f1',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: {
    fontSize: 16,
    color: '#e0e7ff',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  cardContainer: {
    paddingHorizontal: 24,
    marginTop: -20,
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardSecondary: {
    backgroundColor: '#f1f5f9',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainerSecondary: {
    backgroundColor: '#dbeafe',
  },
  icon: {
    fontSize: 28,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
    flex: 1,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748b',
    position: 'absolute',
    left: 96,
    bottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 32,
    gap: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748b',
  },
});