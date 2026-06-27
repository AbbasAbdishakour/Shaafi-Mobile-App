// src/screens/doctor/DoctorRegisterScreen.js
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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import { supabase } from '../../config/supabase';
import ShaafiAlert from '../../components/ShaafiAlert';

const specialties = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Psychiatry',
  'Dermatology', 'Pediatrics', 'General Medicine', 'Ophthalmology',
];

const DoctorRegisterScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [hospital, setHospital] = useState('');
  const [experience, setExperience] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', icon: '', iconColor: '', onConfirm: null });

  const showAlert = (title, message, icon, iconColor, onConfirm = null) => {
    setAlert({ visible: true, title, message, icon, iconColor, onConfirm });
  };

  const hideAlert = () => {
    setAlert({ ...alert, visible: false });
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !specialty || !hospital || !experience || !price) {
      showAlert('Missing Fields', 'Please fill in all fields.', 'information-circle', theme.primary);
      return;
    }
    if (password.length < 6) {
      showAlert('Weak Password', 'Password must be at least 6 characters.', 'shield-outline', theme.warning);
      return;
    }
    setLoading(true);
    try {
      // 1. Create auth user directly with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, role: 'doctor' } },
      });
      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error('Failed to create user account.');

      // 2. Create doctor profile linked by user_id
      const { error: doctorError } = await supabase.from('doctors').insert({
        user_id: userId,
        name,
        specialty,
        hospital,
        experience: parseInt(experience),
        price_per_session: parseInt(price),
        avatar: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 70)}.jpg`,
        available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        time_slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
        bio: `Dr. ${name} is a ${specialty} at ${hospital}.`,
        is_approved: false,
        status: 'pending',
      });

      if (doctorError) throw doctorError;

      showAlert(
        'Registration Submitted!',
        'Your profile has been submitted for review. You will be able to log in once approved by the admin.',
        'checkmark-circle',
        theme.success,
        () => navigation.goBack()
      );
    } catch (error) {
      showAlert('Registration Failed', error.message, 'close-circle', theme.danger);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.surface }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="medkit" size={40} color={theme.primary} />
          </View>
          <Text style={[styles.title, { color: theme.primary }]}>Join as a Doctor</Text>
          <Text style={[styles.subtitle, { color: theme.grey }]}>Fill in your professional details</Text>
        </View>

        <View style={styles.form}>
          <View style={[styles.inputContainer, { backgroundColor: theme.inputBg }]}>
            <Ionicons name="person-outline" size={20} color={theme.grey} />
            <TextInput style={[styles.input, { color: theme.dark }]} placeholder="Full Name" placeholderTextColor={theme.grey} value={name} onChangeText={setName} />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: theme.inputBg }]}>
            <Ionicons name="mail-outline" size={20} color={theme.grey} />
            <TextInput style={[styles.input, { color: theme.dark }]} placeholder="Email" placeholderTextColor={theme.grey} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: theme.inputBg }]}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.grey} />
            <TextInput style={[styles.input, { color: theme.dark }]} placeholder="Password (min 6 chars)" placeholderTextColor={theme.grey} value={password} onChangeText={setPassword} secureTextEntry />
          </View>

          <Text style={[styles.sectionLabel, { color: theme.grey }]}>Professional Details</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.specialtyScroll}>
            {specialties.map((s) => (
              <Pressable
                key={s}
                style={[styles.specialtyChip, { backgroundColor: specialty === s ? theme.primary : theme.inputBg }]}
                onPress={() => setSpecialty(s)}
              >
                <Text style={[styles.specialtyText, { color: specialty === s ? '#FFFFFF' : theme.grey }]}>{s}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={[styles.inputContainer, { backgroundColor: theme.inputBg }]}>
            <Ionicons name="business-outline" size={20} color={theme.grey} />
            <TextInput style={[styles.input, { color: theme.dark }]} placeholder="Hospital / Clinic Name" placeholderTextColor={theme.grey} value={hospital} onChangeText={setHospital} />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { backgroundColor: theme.inputBg }, styles.halfInput]}>
              <Ionicons name="time-outline" size={20} color={theme.grey} />
              <TextInput style={[styles.input, { color: theme.dark }]} placeholder="Years Exp." placeholderTextColor={theme.grey} value={experience} onChangeText={setExperience} keyboardType="number-pad" />
            </View>
            <View style={[styles.inputContainer, { backgroundColor: theme.inputBg }, styles.halfInput]}>
              <Ionicons name="cash-outline" size={20} color={theme.grey} />
              <TextInput style={[styles.input, { color: theme.dark }]} placeholder="$/Session" placeholderTextColor={theme.grey} value={price} onChangeText={setPrice} keyboardType="number-pad" />
            </View>
          </View>
        </View>

        <Pressable style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Submit for Review</Text>}
        </Pressable>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.grey }]}>Already registered? </Text>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={[styles.footerLink, { color: theme.primary }]}>Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>

      <ShaafiAlert visible={alert.visible} title={alert.title} message={alert.message} icon={alert.icon} iconColor={alert.iconColor} confirmText="OK" onConfirm={() => { hideAlert(); if (alert.onConfirm) alert.onConfirm(); }} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingVertical: spacing.xxl },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2F80ED15', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  title: { ...typography.h1 },
  subtitle: { ...typography.body, marginTop: spacing.xs },
  form: { gap: spacing.md },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.md, paddingHorizontal: spacing.md, height: 52, gap: spacing.sm },
  input: { flex: 1, ...typography.body },
  sectionLabel: { ...typography.body, fontWeight: '600', marginTop: spacing.sm },
  specialtyScroll: { gap: spacing.sm },
  specialtyChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full },
  specialtyText: { ...typography.bodySmall, fontWeight: '500' },
  row: { flexDirection: 'row', gap: spacing.md },
  halfInput: { flex: 1 },
  button: { backgroundColor: '#2F80ED', height: 56, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg },
  buttonText: { ...typography.button },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  footerText: { ...typography.body },
  footerLink: { ...typography.body, fontWeight: '600' },
});

export default DoctorRegisterScreen;