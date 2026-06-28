// src/screens/doctor/DoctorAppointmentsScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import { shadow } from '../../theme/shadows';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';
import ShaafiAlert from '../../components/ShaafiAlert';

const DoctorAppointmentsScreen = () => {
  const { theme } = useTheme();
  const { user, doctorId } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [patientNames, setPatientNames] = useState({});
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', icon: '', iconColor: '' });

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'confirmed', label: 'Confirmed' }, { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  useFocusEffect(useCallback(() => { fetchAppointments(); }, [user, doctorId]));

  const fetchAppointments = async () => {
    if (!doctorId) { setLoading(false); return; }
    const { data } = await supabase.from('appointments').select('*').eq('doctor_id', doctorId).order('created_at', { ascending: false });
    setAppointments(data || []);

    // Fetch patient names
    const userIds = [...new Set((data || []).map(a => a.patient_id || a.user_id))].filter(Boolean);
    if (userIds.length > 0) {
      const { data: patients } = await supabase.from('patients').select('user_id, full_name').in('user_id', userIds);
      const nameMap = {};
      (patients || []).forEach(p => { nameMap[p.user_id] = p.full_name; });
      setPatientNames(nameMap);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase.from('appointments').update({ status: newStatus }).eq('id', id);
    if (error) {
      setAlert({ visible: true, title: 'Error', message: error.message, icon: 'close-circle', iconColor: theme.danger });
    } else {
      // If completed or cancelled, free up the slot
      if (newStatus === 'completed' || newStatus === 'cancelled') {
        const appt = appointments.find(a => a.id === id);
        if (appt) {
          await supabase.from('doctor_slots')
            .update({ is_booked: false })
            .eq('doctor_id', doctorId)
            .eq('day', appt.date)
            .eq('time', appt.time);
        }
      }
      fetchAppointments();
    }
  };

  const filtered = activeTab === 'all' ? appointments : appointments.filter(a => a.status === activeTab);

  if (loading) return <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}><ActivityIndicator size="large" color={theme.primary} /></View>;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.pageTitle, { color: theme.dark }]}>My Appointments</Text>
        <View style={styles.tabRow}>
          {tabs.map(tab => (
            <Pressable key={tab.key} style={[styles.tab, { backgroundColor: theme.surface, borderColor: theme.border }, activeTab === tab.key && { backgroundColor: theme.primary, borderColor: theme.primary }]} onPress={() => setActiveTab(tab.key)}>
              <Text style={[styles.tabText, { color: theme.grey }, activeTab === tab.key && { color: '#FFF' }]}>{tab.label}</Text>
            </Pressable>
          ))}
        </View>
        <FlatList data={filtered} keyExtractor={item => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}
          ListEmptyComponent={<View style={styles.empty}><Ionicons name="calendar-outline" size={48} color={theme.lightGrey} /><Text style={[styles.emptyText, { color: theme.grey }]}>No appointments</Text></View>}
          renderItem={({ item }) => {
            const sc = item.status === 'confirmed' || item.status === 'completed' ? theme.success : item.status === 'cancelled' ? theme.danger : theme.warning;
            const patientName = patientNames[item.patient_id || item.user_id] || 'Unknown Patient';
            return (
              <View style={[styles.card, { backgroundColor: theme.surface }]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.statusBadge, { backgroundColor: sc + '20' }]}><Text style={[styles.statusText, { color: sc }]}>{item.status}</Text></View>
                  <Text style={[styles.dateText, { color: theme.grey }]}>{item.date} at {item.time}</Text>
                </View>
                <View style={styles.patientRow}>
                  <Ionicons name="person-circle-outline" size={20} color={theme.secondary} />
                  <Text style={[styles.patientId, { color: theme.secondary }]}>{patientName}</Text>
                </View>
                {item.status === 'pending' && (
                  <View style={styles.actions}>
                    <Pressable style={[styles.actionBtn, { backgroundColor: theme.success }]} onPress={() => handleStatusChange(item.id, 'confirmed')}><Ionicons name="checkmark" size={16} color="#FFF" /><Text style={styles.actionText}>Approve</Text></Pressable>
                    <Pressable style={[styles.actionBtn, { backgroundColor: theme.danger }]} onPress={() => handleStatusChange(item.id, 'cancelled')}><Ionicons name="close" size={16} color="#FFF" /><Text style={styles.actionText}>Reject</Text></Pressable>
                  </View>
                )}
                {item.status === 'confirmed' && (
                  <View style={styles.actions}>
                    <Pressable style={[styles.actionBtn, { backgroundColor: theme.primary }]} onPress={() => handleStatusChange(item.id, 'completed')}><Ionicons name="checkmark-done" size={16} color="#FFF" /><Text style={styles.actionText}>Mark Complete</Text></Pressable>
                  </View>
                )}
              </View>
            );
          }}
        />
      </View>
      <ShaafiAlert visible={alert.visible} title={alert.title} message={alert.message} icon={alert.icon} iconColor={alert.iconColor} confirmText="OK" onConfirm={() => setAlert({ ...alert, visible: false })} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 }, container: { flex: 1, paddingHorizontal: spacing.md },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pageTitle: { ...typography.h2, paddingVertical: spacing.md },
  tabRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md, flexWrap: 'wrap' },
  tab: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full, borderWidth: 1 },
  tabText: { ...typography.bodySmall, fontWeight: '500' },
  list: { paddingBottom: spacing.xxl }, empty: { alignItems: 'center', paddingTop: spacing.xxl * 2 }, emptyText: { ...typography.h3, marginTop: spacing.md },
  card: { padding: spacing.md, borderRadius: radius.lg, marginBottom: spacing.sm, ...shadow.card },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  statusBadge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.full },
  statusText: { ...typography.label, fontWeight: '700', textTransform: 'uppercase' }, dateText: { ...typography.bodySmall },
  patientRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm }, patientId: { ...typography.bodySmall },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full },
  actionText: { ...typography.label, color: '#FFFFFF', fontWeight: '700' },
});

export default DoctorAppointmentsScreen;