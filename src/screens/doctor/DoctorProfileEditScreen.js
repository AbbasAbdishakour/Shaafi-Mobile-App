// src/screens/doctor/DoctorProfileEditScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';
import ShaafiAlert from '../../components/ShaafiAlert';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_SLOTS = [
  '06:00 AM','07:00 AM','08:00 AM','09:00 AM','10:00 AM','11:00 AM',
  '12:00 PM','01:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM',
  '06:00 PM','07:00 PM','08:00 PM','09:00 PM','10:00 PM','11:00 PM',
];

const DoctorProfileEditScreen = () => {
  const { theme } = useTheme();
  const { doctorId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bio, setBio] = useState('');
  const [hospital, setHospital] = useState('');
  const [price, setPrice] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', icon: '', iconColor: '' });

  useEffect(() => { loadProfile(); }, [doctorId]);

  const loadProfile = async () => {
    if (!doctorId) return;
    const { data: doctor } = await supabase.from('doctors').select('*').eq('id', doctorId).single();
    if (doctor) {
      setBio(doctor.bio || '');
      setHospital(doctor.hospital || '');
      setPrice(String(doctor.price_per_session || ''));
      setSelectedDays(doctor.available_days || []);
    }
    const { data: slots } = await supabase.from('doctor_slots').select('*').eq('doctor_id', doctorId).eq('is_booked', false);
    setSelectedSlots(slots?.map(s => s.time) || []);
    setLoading(false);
  };

  const toggleDay = (day) => setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  const toggleSlot = (time) => setSelectedSlots(prev => prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase.from('doctors').update({ bio, hospital, price_per_session: parseInt(price), available_days: selectedDays }).eq('id', doctorId);
      await supabase.from('doctor_slots').delete().eq('doctor_id', doctorId).eq('is_booked', false);
      if (selectedDays.length > 0 && selectedSlots.length > 0) {
        const rows = [];
        selectedDays.forEach(day => selectedSlots.forEach(time => rows.push({ doctor_id: doctorId, day, time, is_booked: false })));
        await supabase.from('doctor_slots').insert(rows);
      }
      setAlert({ visible: true, title: 'Saved!', message: 'Profile updated.', icon: 'checkmark-circle', iconColor: theme.success });
    } catch (e) {
      setAlert({ visible: true, title: 'Error', message: e.message, icon: 'close-circle', iconColor: theme.danger });
    } finally { setSaving(false); }
  };

  if (loading) return <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}><ActivityIndicator size="large" color={theme.primary} /></View>;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={[styles.pageTitle, { color: theme.dark }]}>Edit Profile</Text>
        <Text style={[styles.label, { color: theme.grey }]}>Bio</Text>
        <TextInput style={[styles.input, { backgroundColor: theme.surface, color: theme.dark, borderColor: theme.border }]} value={bio} onChangeText={setBio} multiline numberOfLines={3} placeholder="Write your bio..." placeholderTextColor={theme.grey} />
        <Text style={[styles.label, { color: theme.grey }]}>Hospital / Clinic</Text>
        <TextInput style={[styles.input, { backgroundColor: theme.surface, color: theme.dark, borderColor: theme.border }]} value={hospital} onChangeText={setHospital} placeholder="Hospital name" placeholderTextColor={theme.grey} />
        <Text style={[styles.label, { color: theme.grey }]}>Price per Session ($)</Text>
        <TextInput style={[styles.input, { backgroundColor: theme.surface, color: theme.dark, borderColor: theme.border }]} value={price} onChangeText={setPrice} keyboardType="number-pad" placeholder="50" placeholderTextColor={theme.grey} />
        <Text style={[styles.sectionTitle, { color: theme.dark }]}>Working Days</Text>
        <View style={styles.chipRow}>{DAYS.map(day => <Pressable key={day} style={[styles.chip, { backgroundColor: selectedDays.includes(day) ? theme.primary : theme.surface, borderColor: theme.border }]} onPress={() => toggleDay(day)}><Text style={[styles.chipText, { color: selectedDays.includes(day) ? '#FFF' : theme.dark }]}>{day}</Text></Pressable>)}</View>
        <Text style={[styles.sectionTitle, { color: theme.dark }]}>Available Time Slots</Text>
        <View style={styles.chipRow}>{TIME_SLOTS.map(slot => <Pressable key={slot} style={[styles.chip, { backgroundColor: selectedSlots.includes(slot) ? theme.primary : theme.surface, borderColor: theme.border }]} onPress={() => toggleSlot(slot)}><Text style={[styles.chipText, { color: selectedSlots.includes(slot) ? '#FFF' : theme.dark }]}>{slot}</Text></Pressable>)}</View>
        <Pressable style={[styles.saveBtn, { backgroundColor: theme.primary }]} onPress={handleSave} disabled={saving}>{saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveText}>Save Changes</Text>}</Pressable>
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
      <ShaafiAlert visible={alert.visible} title={alert.title} message={alert.message} icon={alert.icon} iconColor={alert.iconColor} confirmText="OK" onConfirm={() => setAlert({ ...alert, visible: false })} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 }, container: { flex: 1, paddingHorizontal: spacing.md },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pageTitle: { ...typography.h2, paddingVertical: spacing.md },
  label: { ...typography.bodySmall, fontWeight: '600', marginTop: spacing.md, marginBottom: spacing.xs },
  input: { borderWidth: 1, borderRadius: radius.md, padding: spacing.md, ...typography.body, marginBottom: spacing.sm },
  sectionTitle: { ...typography.h3, marginTop: spacing.lg, marginBottom: spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full, borderWidth: 1 },
  chipText: { ...typography.bodySmall, fontWeight: '500' },
  saveBtn: { height: 56, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', marginTop: spacing.xl },
  saveText: { ...typography.button, color: '#FFF' },
});

export default DoctorProfileEditScreen;