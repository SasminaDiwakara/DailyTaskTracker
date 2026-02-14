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
import { registerUser } from "../services/api";

export default function SignUpScreen({ navigation }: any) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSignUp = async () => {
        console.log("Sign up clicked");
        setErrorMessage('');
        setSuccessMessage('');

        // Validation
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setErrorMessage("Please fill in all fields");
            return;
        }

        if (password.length < 6) {
            setErrorMessage("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setErrorMessage("Please enter a valid email");
            return;
        }

        setLoading(true);

        try {
            const fullName = `${firstName.trim()} ${lastName.trim()}`;
            const result = await registerUser(fullName, email.trim(), password.trim());

            console.log("Registration result:", result);

            setLoading(false);

            if (result && result.success) {
                console.log("✅ Registration successful!");
                setSuccessMessage("Account created successfully! Redirecting to login...");
                
                // Clear form
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                
                // Navigate to login after 2 seconds
                setTimeout(() => {
                    console.log("Navigating to Login...");
                    navigation.navigate("Login");
                }, 2000);
                
            } else {
                setErrorMessage(result?.error || result?.message || "Registration failed. Please try again.");
            }

        } catch (error) {
            console.error("Sign up error:", error);
            setLoading(false);
            setErrorMessage("Sign up failed. Please try again.");
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
                            <View style={styles.logoPlus}>
                                <View style={styles.logoPlusH} />
                                <View style={styles.logoPlusV} />
                            </View>
                        </View>
                    </View>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Sign up to get started</Text>
                </View>

                {/* Error Message */}
                {errorMessage ? (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>❌ {errorMessage}</Text>
                    </View>
                ) : null}

                {/* Success Message */}
                {successMessage ? (
                    <View style={styles.successBox}>
                        <Text style={styles.successText}>✅ {successMessage}</Text>
                    </View>
                ) : null}

                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>First Name</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your first name"
                                placeholderTextColor="#94a3b8"
                                value={firstName}
                                onChangeText={setFirstName}
                                editable={!loading}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Last Name</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your last name"
                                placeholderTextColor="#94a3b8"
                                value={lastName}
                                onChangeText={setLastName}
                                editable={!loading}
                            />
                        </View>
                    </View>

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
                                placeholder="Create a password (min 6 characters)"
                                placeholderTextColor="#94a3b8"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={true}
                                editable={!loading}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm your password"
                                placeholderTextColor="#94a3b8"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={true}
                                editable={!loading}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
                        onPress={handleSignUp}
                        activeOpacity={0.8}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text style={styles.signUpButtonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.footerLink}>Sign In</Text>
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
        paddingTop: 50,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoContainer: {
        marginBottom: 20,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#10b981',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    logoPlus: {
        position: 'relative',
        width: 32,
        height: 32,
    },
    logoPlusH: {
        position: 'absolute',
        width: 32,
        height: 4,
        backgroundColor: '#ffffff',
        top: 14,
        borderRadius: 2,
    },
    logoPlusV: {
        position: 'absolute',
        width: 4,
        height: 32,
        backgroundColor: '#ffffff',
        left: 14,
        borderRadius: 2,
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
    successBox: {
        backgroundColor: '#d1fae5',
        borderWidth: 1,
        borderColor: '#10b981',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    successText: {
        color: '#059669',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    formContainer: {
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 18,
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
    signUpButton: {
        backgroundColor: '#10b981',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        marginTop: 8,
    },
    signUpButtonDisabled: {
        backgroundColor: '#cbd5e1',
        shadowOpacity: 0,
    },
    signUpButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#ffffff',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
        paddingTop: 16,
    },
    footerText: {
        fontSize: 14,
        color: '#64748b',
    },
    footerLink: {
        fontSize: 14,
        color: '#10b981',
        fontWeight: '700',
    },
});