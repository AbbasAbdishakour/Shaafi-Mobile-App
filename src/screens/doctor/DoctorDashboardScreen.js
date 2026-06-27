// src/screens/doctor/DoctorDashboardScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import { shadow } from '../../theme/shadows';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';

const DoctorDashboardScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, doctorId, signOut, getUserName } = useAuth();
  const [stats, setStats] = useState({ patients: 0, today: 0, pending: 0, earnings: 0 });
  const [loading, setLoading] = useState(true);

  useFocusEffect(useCallback(() => { fetchStats(); }, [user, doctorId]));

  const fetchStats = async () => {
    if (!user || !doctorId) return;
    try {
      const { data: appointments } = await supabase.from('appointments').select('*').eq('doctor_id', doctorId);
      const { data: payments } = await supabase.from('payments').select('amount').eq('doctor_id', doctorId);

      const all = appointments || [];
      const confirmed = all.filter(a => a.status === 'confirmed');
      const pending = all.filter(a => a.status === 'pending');
      const totalEarnings = (payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);

      setStats({
        patients: new Set(all.map(a => a.user_id)).size,
        today: confirmed.length,
        pending: pending.length,
        earnings: totalEarnings,
      });
    } catch (e) { console.log(e.message); }
    finally { setLoading(false); }
  };

  if (loading) return <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}><ActivityIndicator size="large" color={theme.primary} /></View>;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.grey }]}>Welcome back,</Text>
            <Text style={[styles.name, { color: theme.dark }]}>Dr. {getUserName()}</Text>
          </View>
          <Pressable onPress={signOut} style={styles.logoutBtn}><Ionicons name="log-out-outline" size={22} color={theme.grey} /></Pressable>
        </View>
        <View style={styles.statsGrid}>
          <StatCard theme={theme} icon="people" color={theme.primary} value={stats.patients} label="Patients" />
          <StatCard theme={theme} icon="calendar" color={theme.success} value={stats.today} label="Confirmed" />
          <StatCard theme={theme} icon="hourglass" color={theme.warning} value={stats.pending} label="Pending" />
          <StatCard theme={theme} icon="cash" color={theme.danger} value={`$${stats.earnings}`} label="Earnings" />
        </View>
        <Text style={[styles.sectionTitle, { color: theme.dark }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <Pressable style={[styles.actionCard, { backgroundColor: theme.surface }]} onPress={() => navigation.navigate('Appointments')}>
            <View style={[styles.actionIcon, { backgroundColor: theme.primary + '15' }]}><Ionicons name="calendar" size={22} color={theme.primary} /></View>
            <Text style={[styles.actionLabel, { color: theme.dark }]}>Appointments</Text>
          </Pressable>
          <Pressable style={[styles.actionCard, { backgroundColor: theme.surface }]} onPress={() => navigation.navigate('DoctorProfileEdit')}>
            <View style={[styles.actionIcon, { backgroundColor: theme.success + '15' }]}><Ionicons name="create" size={22} color={theme.success} /></View>
            <Text style={[styles.actionLabel, { color: theme.dark }]}>Edit Profile</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const StatCard = ({ theme, icon, color, value, label }) => (
  <View style={[styles2.statCard, { backgroundColor: theme.surface }]}>
    <Ionicons name={icon} size={28} color={color} />
    <Text style={[styles2.statValue, { color: theme.dark }]}>{value}</Text>
    <Text style={[styles2.statLabel, { color: theme.grey }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1 }, container: { flex: 1, paddingHorizontal: spacing.md },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md },
  greeting: { ...typography.bodySmall }, name: { ...typography.h2 }, logoutBtn: { padding: spacing.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  sectionTitle: { ...typography.h3, marginBottom: spacing.md },
  actionsGrid: { flexDirection: 'row', gap: spacing.sm, paddingBottom: spacing.xxl },
  actionCard: { width: '47%', padding: spacing.md, borderRadius: radius.lg, ...shadow.card, gap: spacing.sm },
  actionIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { ...typography.body, fontWeight: '600' },
});

const styles2 = StyleSheet.create({
  statCard: { width: '47%', padding: spacing.md, borderRadius: radius.lg, ...shadow.card, gap: spacing.xs },
  statValue: { ...typography.h1, fontSize: 24 }, statLabel: { ...typography.bodySmall },
});

export default DoctorDashboardScreen;