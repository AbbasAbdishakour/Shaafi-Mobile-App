// src/auth/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { useAuth } from '../context/AuthContext';
import ShaafiAlert from '../components/ShaafiAlert';

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', icon: '', iconColor: '' });

  const showAlert = (title, message, icon = 'alert-circle', iconColor = theme.warning) => {
    setAlert({ visible: true, title, message, icon, iconColor });
  };

  const hideAlert = () => {
    setAlert({ ...alert, visible: false });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Missing Fields', 'Please fill in all fields to sign in.', 'information-circle', theme.primary);
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      let message = error.message;
      if (message.includes('Invalid login credentials')) {
        message = 'The email or password you entered is incorrect. Please try again.';
      } else if (message.includes('Email not confirmed')) {
        message = 'Please verify your email address before signing in. Check your inbox for the verification link.';
      }
      showAlert('Login Failed', message, 'close-circle', theme.danger);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.surface }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="medical" size={48} color={theme.primary} />
          </View>
          <Text style={[styles.title, { color: theme.primary }]}>Welcome to Shaafi</Text>
          <Text style={[styles.subtitle, { color: theme.grey }]}>Sign in to book appointments</Text>
        </View>

        <View style={styles.form}>
          <View style={[styles.inputContainer, { backgroundColor: theme.inputBg }]}>
            <Ionicons name="mail-outline" size={20} color={theme.grey} />
            <TextInput
              style={[styles.input, { color: theme.dark }]}
              placeholder="Email"
              placeholderTextColor={theme.grey}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: theme.inputBg }]}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.grey} />
            <TextInput
              style={[styles.input, { color: theme.dark }]}
              placeholder="Password"
              placeholderTextColor={theme.grey}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={theme.grey}
              />
            </Pressable>
          </View>

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.grey }]}>Don't have an account? </Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.footerLink, { color: theme.primary }]}>Sign Up</Text>
          </Pressable>
        </View>

        {/* Doctor Registration Link */}
        <Pressable
          style={styles.doctorLink}
          onPress={() => navigation.navigate('DoctorLogin')}
        >
          <Ionicons name="medkit-outline" size={16} color={theme.secondary} />
          <Text style={[styles.doctorLinkText, { color: theme.secondary }]}>
            Are you a doctor? Join as a provider
          </Text>
        </Pressable>
      </View>

      <ShaafiAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        icon={alert.icon}
        iconColor={alert.iconColor}
        confirmText="OK"
        onConfirm={hideAlert}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2F80ED' + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.xs,
  },
  form: {
    gap: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 52,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
  },
  button: {
    backgroundColor: '#2F80ED',
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    ...typography.button,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.body,
  },
  footerLink: {
    ...typography.body,
    fontWeight: '600',
  },
  doctorLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  doctorLinkText: {
    ...typography.bodySmall,
    fontWeight: '500',
  },
});

export default LoginScreen;