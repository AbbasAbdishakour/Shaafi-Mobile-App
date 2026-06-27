// src/screens/patient/BookingScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, ScrollView, Pressable,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import { shadow } from '../../theme/shadows';
import { supabase } from '../../config/supabase';
import TimeSlotButton from '../../components/TimeSlotButton';

const dayMapping = { Mon: 'Mon', Tue: 'Tue', Wed: 'Wed', Thu: 'Thu', Fri: 'Fri', Sat: 'Sat', Sun: 'Sun' };
const dateMapping = { Mon: '10', Tue: '11', Wed: '12', Thu: '13', Fri: '14', Sat: '15', Sun: '16' };

const BookingScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { doctor } = route.params;

  const displayDoctor = {
    ...doctor,
    pricePerSession: doctor.price_per_session || doctor.pricePerSession,
  };

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableDays, setAvailableDays] = useState([]);
  const [allSlots, setAllSlots] = useState([]); // { time, isBooked }
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAvailability(); }, []);

  const fetchAvailability = async () => {
    const { data: doctorData } = await supabase.from('doctors').select('available_days').eq('id', displayDoctor.id).single();
    const { data: slots } = await supabase.from('doctor_slots').select('time, is_booked').eq('doctor_id', displayDoctor.id);

    setAvailableDays(doctorData?.available_days || []);

    // Show ALL slots — booked ones marked
    const uniqueSlots = [];
    const seen = new Set();
    (slots || []).forEach(s => {
      if (!seen.has(s.time)) {
        seen.add(s.time);
        uniqueSlots.push({ time: s.time, isBooked: s.is_booked });
      }
    });
    setAllSlots(uniqueSlots);
    setLoading(false);
  };

  const canContinue = selectedDay && selectedTime;

  if (loading) {
    return <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}><ActivityIndicator size="large" color={theme.primary} /></View>;
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom']}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.summaryCard, { backgroundColor: theme.surface }]}>
            <Image source={{ uri: displayDoctor.avatar }} style={styles.avatar} />
            <View style={styles.summaryInfo}>
              <Text style={[styles.doctorName, { color: theme.dark }]}>{displayDoctor.name}</Text>
              <Text style={[styles.doctorSpecialty, { color: theme.grey }]}>{displayDoctor.specialty}</Text>
            </View>
            <View style={styles.priceBadge}><Text style={styles.priceText}>${displayDoctor.pricePerSession}</Text></View>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.dark }]}>Select Day</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayScroll}>
            {availableDays.map((day) => (
              <TimeSlotButton key={day} label={dayMapping[day] || day} subLabel={dateMapping[day]} selected={selectedDay === day} onPress={() => setSelectedDay(day)} />
            ))}
          </ScrollView>

          <Text style={[styles.sectionTitle, { color: theme.dark }]}>Available Time</Text>
          <View style={styles.timeGrid}>
            {allSlots.map((slot) => (
              <Pressable
                key={slot.time}
                style={[
                  styles.slotBtn,
                  { backgroundColor: slot.isBooked ? theme.lightGrey : (selectedTime === slot.time ? theme.primary : theme.surface), borderColor: theme.border },
                  slot.isBooked && styles.slotBooked,
                ]}
                disabled={slot.isBooked}
                onPress={() => setSelectedTime(slot.time)}
              >
                <Text style={[
                  styles.slotText,
                  { color: slot.isBooked ? theme.grey : (selectedTime === slot.time ? '#FFF' : theme.dark) },
                  slot.isBooked && styles.slotTextBooked,
                ]}>{slot.time}</Text>
                {slot.isBooked && <Text style={[styles.bookedLabel, { color: theme.danger }]}>Taken</Text>}
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.continueButton, !canContinue && { backgroundColor: theme.lightGrey }]}
            disabled={!canContinue}
            onPress={() => navigation.navigate('ConfirmBooking', { doctor: displayDoctor, selectedDay, selectedTime })}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 }, container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  summaryCard: { flexDirection: 'row', alignItems: 'center', margin: spacing.md, padding: spacing.md, borderRadius: radius.lg, ...shadow.card },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  summaryInfo: { flex: 1, marginLeft: spacing.md },
  doctorName: { ...typography.body, fontWeight: '600' },
  doctorSpecialty: { ...typography.bodySmall, marginTop: 2 },
  priceBadge: { backgroundColor: '#2F80ED15', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.full },
  priceText: { ...typography.bodySmall, color: '#2F80ED', fontWeight: '600' },
  sectionTitle: { ...typography.h3, paddingHorizontal: spacing.md, marginTop: spacing.lg, marginBottom: spacing.sm },
  dayScroll: { paddingLeft: spacing.md, gap: spacing.sm },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.md, gap: spacing.sm },
  slotBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 4, borderRadius: radius.md, borderWidth: 1, minWidth: 80, alignItems: 'center' },
  slotBooked: { opacity: 0.6 },
  slotText: { ...typography.body, fontWeight: '600' },
  slotTextBooked: { textDecorationLine: 'line-through' },
  bookedLabel: { ...typography.label, marginTop: 2 },
  buttonContainer: { padding: spacing.md, paddingBottom: spacing.xl },
  continueButton: { backgroundColor: '#2F80ED', height: 56, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  continueButtonText: { ...typography.button },
});

export default BookingScreen;