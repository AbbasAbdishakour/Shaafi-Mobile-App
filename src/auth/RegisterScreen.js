// src/auth/RegisterScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import ShaafiAlert from '../components/ShaafiAlert';

const PATIENT_COLOR = '#7C3AED';

const RegisterScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', icon: '', iconColor: '', onConfirm: null });

  const showAlert = (title, message, icon = 'alert-circle', iconColor = theme.warning, onConfirm = null) => setAlert({ visible: true, title, message, icon, iconColor, onConfirm });
  const hideAlert = () => setAlert({ ...alert, visible: false });

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) { showAlert('Missing Fields', 'Please fill in all fields.', 'information-circle', PATIENT_COLOR); return; }
    if (password !== confirmPassword) { showAlert('Password Mismatch', 'Passwords do not match.', 'lock-closed', theme.warning); return; }
    if (password.length < 6) { showAlert('Weak Password', 'Password must be at least 6 characters.', 'shield-outline', theme.warning); return; }
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name, role: 'patient' } } });
      if (authError) throw authError;
      const userId = authData.user?.id;
      if (!userId) throw new Error('Failed to create account.');
      const { error: patientError } = await supabase.from('patients').insert({ user_id: userId, full_name: name, email });
      if (patientError) throw patientError;
      showAlert('Account Created!', 'Please check your email to verify, then sign in.', 'checkmark-circle', theme.success, () => navigation.goBack());
    } catch (error) {
      let message = error.message;
      if (message.includes('already registered')) message = 'An account with this email already exists.';
      showAlert('Registration Failed', message, 'close-circle', theme.danger);
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: theme.surface }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: PATIENT_COLOR + '15' }]}>
            <Ionicons name="person-add" size={40} color={PATIENT_COLOR} />
          </View>
          <Text style={[styles.title, { color: PATIENT_COLOR }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: theme.grey }]}>Join Shaafi to book appointments</Text>
        </View>
        <View style={styles.form}>
          <View style={[styles.inputContainer, { backgroundColor: theme.inputBg }]}><Ionicons name="person-outline" size={20} color={theme.grey} /><TextInput style={[styles.input, { color: theme.dark }]} placeholder="Full Name" placeholderTextColor={theme.grey} value={name} onChangeText={setName} /></View>
          <View style={[styles.inputContainer, { backgroundColor: theme.inputBg }]}><Ionicons name="mail-outline" size={20} color={theme.grey} /><TextInput style={[styles.input, { color: theme.dark }]} placeholder="Email" placeholderTextColor={theme.grey} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" /></View>
          <View style={[styles.inputContainer, { backgroundColor: theme.inputBg }]}><Ionicons name="lock-closed-outline" size={20} color={theme.grey} /><TextInput style={[styles.input, { color: theme.dark }]} placeholder="Password" placeholderTextColor={theme.grey} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} /><Pressable onPress={() => setShowPassword(!showPassword)}><Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={theme.grey} /></Pressable></View>
          <View style={[styles.inputContainer, { backgroundColor: theme.inputBg }]}><Ionicons name="lock-closed-outline" size={20} color={theme.grey} /><TextInput style={[styles.input, { color: theme.dark }]} placeholder="Confirm Password" placeholderTextColor={theme.grey} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry /></View>
          <Pressable style={[styles.button, { backgroundColor: PATIENT_COLOR }, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading}>{loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Sign Up</Text>}</Pressable>
        </View>
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.grey }]}>Already have an account? </Text>
          <Pressable onPress={() => navigation.goBack()}><Text style={[styles.footerLink, { color: PATIENT_COLOR }]}>Sign In</Text></Pressable>
        </View>
      </ScrollView>
      <ShaafiAlert visible={alert.visible} title={alert.title} message={alert.message} icon={alert.icon} iconColor={alert.iconColor} confirmText="OK" onConfirm={() => { hideAlert(); if (alert.onConfirm) alert.onConfirm(); }} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 }, content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.xxl },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  iconContainer: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  title: { ...typography.h1 }, subtitle: { ...typography.body, marginTop: spacing.xs },
  form: { gap: spacing.md },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.md, paddingHorizontal: spacing.md, height: 52, gap: spacing.sm },
  input: { flex: 1, ...typography.body },
  button: { height: 56, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', marginTop: spacing.sm },
  buttonText: { ...typography.button },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  footerText: { ...typography.body }, footerLink: { ...typography.body, fontWeight: '600' },
});

export default RegisterScreen;