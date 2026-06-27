// src/screens/doctor/DoctorRevokedScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';

const DoctorRevokedScreen = () => {
  const { theme } = useTheme();
  const { user, signOut, getUserName } = useAuth();
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchReason();
  }, []);

  const fetchReason = async () => {
    const { data } = await supabase
      .from('doctors')
      .select('revoked_reason')
      .eq('user_id', user?.id)
      .single();
    setReason(data?.revoked_reason || 'violation of platform policies.');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface }]}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={[styles.iconCircle, { backgroundColor: theme.danger + '15' }]}>
            <Ionicons name="ban" size={80} color={theme.danger} />
          </View>
          <Text style={[styles.title, { color: theme.danger }]}>Account Revoked</Text>
          <Text style={[styles.subtitle, { color: theme.grey }]}>
            Your access has been removed, Dr. {getUserName()}.
          </Text>
          <View style={[styles.reasonCard, { backgroundColor: theme.background, borderColor: theme.danger + '30' }]}>
            <Ionicons name="warning" size={22} color={theme.danger} />
            <View style={styles.reasonContent}>
              <Text style={[styles.reasonLabel, { color: theme.danger }]}>Reason for Revocation</Text>
              <Text style={[styles.reasonText, { color: theme.secondary }]}>{reason}</Text>
            </View>
          </View>
          <View style={[styles.linksContainer, { backgroundColor: theme.background }]}>
            <Pressable style={styles.linkRow}>
              <Ionicons name="document-text-outline" size={18} color={theme.secondary} />
              <Text style={[styles.linkText, { color: theme.secondary }]}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.lightGrey} />
            </Pressable>
            <View style={[styles.linkDivider, { backgroundColor: theme.border }]} />
            <Pressable style={styles.linkRow}>
              <Ionicons name="shield-outline" size={18} color={theme.secondary} />
              <Text style={[styles.linkText, { color: theme.secondary }]}>Terms of Use</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.lightGrey} />
            </Pressable>
          </View>
          <Text style={[styles.footerText, { color: theme.grey }]}>
            If you need further information, please contact{' '}
            <Text style={{ color: theme.primary }}>support@shaafi.com</Text>
          </Text>
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
  linksContainer: { borderRadius: radius.lg, width: '100%', marginBottom: spacing.md, overflow: 'hidden' },
  linkRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.sm },
  linkText: { ...typography.bodySmall, fontWeight: '500', flex: 1 },
  linkDivider: { height: 1, marginHorizontal: spacing.md },
  footerText: { ...typography.bodySmall, textAlign: 'center', lineHeight: 20, marginBottom: spacing.xl, paddingHorizontal: spacing.md },
  button: { flexDirection: 'row', height: 56, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingHorizontal: spacing.xl },
  buttonText: { ...typography.button, color: '#FFFFFF' },
});

export default DoctorRevokedScreen;