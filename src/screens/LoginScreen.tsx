import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../services/api";

export default function LoginScreen({ navigation, onLogin }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        console.log("Login clicked");
        setErrorMessage('');

        if (!email.trim() || !password.trim()) {
            setErrorMessage("Please fill in all fields");
            return;
        }

        setLoading(true);

        try {
            const user = await loginUser(email.trim(), password.trim());

            console.log("Login response:", user);

            if (!user || user.error) {
                setLoading(false);
                setErrorMessage(user?.error || "Invalid credentials");
                return;
            }

            await AsyncStorage.setItem("user", JSON.stringify(user));
            console.log("User saved to AsyncStorage");

            setLoading(false);

            if (onLogin) {
                onLogin();
            }

        } catch (error) {
            console.error("Login error:", error);
            setLoading(false);
            setErrorMessage("Login failed. Please try again.");
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="dark-content" />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <View style={styles.logoCircle}>
                            <View style={styles.logoCheck} />
                        </View>
                    </View>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to continue</Text>
                </View>

                {/* Error Message */}
                {errorMessage ? (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>❌ {errorMessage}</Text>
                    </View>
                ) : null}

                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#94a3b8"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!loading}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor="#94a3b8"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={true}
                                editable={!loading}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        activeOpacity={0.8}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text style={styles.loginButtonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignUp')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.footerLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        marginBottom: 24,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    logoCheck: {
        width: 28,
        height: 14,
        borderLeftWidth: 4,
        borderBottomWidth: 4,
        borderColor: '#ffffff',
        transform: [{ rotate: '-45deg' }],
        marginTop: -8,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
    },
    errorBox: {
        backgroundColor: '#fee2e2',
        borderWidth: 1,
        borderColor: '#ef4444',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    errorText: {
        color: '#dc2626',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    formContainer: {
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        paddingHorizontal: 14,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: '#0f172a',
    },
    loginButton: {
        backgroundColor: '#6366f1',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonDisabled: {
        backgroundColor: '#cbd5e1',
        shadowOpacity: 0,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#ffffff',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
        paddingTop: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#64748b',
    },
    footerLink: {
        fontSize: 14,
        color: '#6366f1',
        fontWeight: '700',
    },
});