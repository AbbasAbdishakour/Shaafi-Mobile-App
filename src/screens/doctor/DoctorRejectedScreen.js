// src/screens/doctor/DoctorRejectedScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';

const DoctorRejectedScreen = () => {
  const { theme } = useTheme();
  const { user, signOut, getUserName } = useAuth();
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchReason();
  }, []);

  const fetchReason = async () => {
    const { data } = await supabase
      .from('doctors')
      .select('rejection_reason')
      .eq('user_id', user?.id)
      .single();
    setReason(data?.rejection_reason || 'your application did not meet our current requirements.');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface }]}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={[styles.iconCircle, { backgroundColor: theme.danger + '15' }]}>
            <Ionicons name="close-circle" size={80} color={theme.danger} />
          </View>
          <Text style={[styles.title, { color: theme.danger }]}>Application Rejected</Text>
          <Text style={[styles.subtitle, { color: theme.grey }]}>
            We're sorry, Dr. {getUserName()}.
          </Text>
          <View style={[styles.reasonCard, { backgroundColor: theme.background, borderColor: theme.danger + '30' }]}>
            <Ionicons name="alert-circle" size={22} color={theme.danger} />
            <View style={styles.reasonContent}>
              <Text style={[styles.reasonLabel, { color: theme.danger }]}>Reason for Rejection</Text>
              <Text style={[styles.reasonText, { color: theme.secondary }]}>{reason}</Text>
            </View>
          </View>
          <View style={[styles.infoCard, { backgroundColor: theme.background }]}>
            <Ionicons name="information-circle" size={20} color={theme.secondary} />
            <Text style={[styles.infoText, { color: theme.secondary }]}>
              You may reapply after 30 days. Please ensure your profile meets all requirements before resubmitting.
            </Text>
          </View>
          <Pressable style={[styles.button, { backgroundColor: theme.danger }]} onPress={signOut}>
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Sign Out</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 }, container: { flex: 1, justifyContent: 'center' },
  content: { alignItems: 'center', paddingHorizontal: spacing.xl },
  iconCircle: { width: 140, height: 140, borderRadius: 70, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, marginBottom: spacing.sm, textAlign: 'center' },
  subtitle: { ...typography.body, textAlign: 'center', marginBottom: spacing.lg },
  reasonCard: { flexDirection: 'row', padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, gap: spacing.sm, marginBottom: spacing.md, width: '100%' },
  reasonContent: { flex: 1 }, reasonLabel: { ...typography.bodySmall, fontWeight: '700', marginBottom: spacing.xs },
  reasonText: { ...typography.bodySmall, lineHeight: 20 },
  infoCard: { flexDirection: 'row', padding: spacing.md, borderRadius: radius.lg, gap: spacing.sm, alignItems: 'flex-start', marginBottom: spacing.xl, width: '100%' },
  infoText: { ...typography.bodySmall, flex: 1, lineHeight: 20 },
  button: { flexDirection: 'row', height: 56, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingHorizontal: spacing.xl },
  buttonText: { ...typography.button, color: '#FFFFFF' },
});

export default DoctorRejectedScreen;