// src/screens/BookingScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { shadow } from '../theme/shadows';
import TimeSlotButton from '../components/TimeSlotButton';

const dayMapping = {
  Mon: 'Mon',
  Tue: 'Tue',
  Wed: 'Wed',
  Thu: 'Thu',
  Fri: 'Fri',
  Sat: 'Sat',
  Sun: 'Sun',
};

const dateMapping = {
  Mon: '10',
  Tue: '11',
  Wed: '12',
  Thu: '13',
  Fri: '14',
  Sat: '15',
  Sun: '16',
};

const BookingScreen = ({ route, navigation }) => {
  const { doctor } = route.params;

  const displayDoctor = {
    ...doctor,
    pricePerSession: doctor.price_per_session || doctor.pricePerSession,
    availableDays: doctor.available_days || doctor.availableDays,
    timeSlots: doctor.time_slots || doctor.timeSlots,
  };

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const canContinue = selectedDay && selectedTime;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Doctor Summary Card */}
          <View style={styles.summaryCard}>
            <Image source={{ uri: displayDoctor.avatar }} style={styles.avatar} />
            <View style={styles.summaryInfo}>
              <Text style={styles.doctorName}>{displayDoctor.name}</Text>
              <Text style={styles.doctorSpecialty}>{displayDoctor.specialty}</Text>
            </View>
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>${displayDoctor.pricePerSession}</Text>
            </View>
          </View>

          {/* Day Picker */}
          <Text style={styles.sectionTitle}>Select Day</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayScroll}
          >
            {displayDoctor.availableDays?.map((day) => (
              <TimeSlotButton
                key={day}
                label={dayMapping[day] || day}
                subLabel={dateMapping[day]}
                selected={selectedDay === day}
                onPress={() => setSelectedDay(day)}
              />
            ))}
          </ScrollView>

          {/* Time Slot Picker */}
          <Text style={styles.sectionTitle}>Available Time</Text>
          <View style={styles.timeGrid}>
            {displayDoctor.timeSlots?.map((slot) => (
              <TimeSlotButton
                key={slot}
                label={slot}
                selected={selectedTime === slot}
                onPress={() => setSelectedTime(slot)}
              />
            ))}
          </View>
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
            disabled={!canContinue}
            onPress={() =>
              navigation.navigate('ConfirmBooking', {
                doctor: displayDoctor,
                selectedDay,
                selectedTime,
              })
            }
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.tertiary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.tertiary,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    ...shadow.card,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  summaryInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  doctorName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.dark,
  },
  doctorSpecialty: {
    ...typography.bodySmall,
    color: colors.grey,
    marginTop: 2,
  },
  priceBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  priceText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  sectionTitle: {
    ...typography.h3,
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  dayScroll: {
    paddingLeft: spacing.md,
    gap: spacing.sm,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  buttonContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  continueButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: colors.lightGrey,
  },
  continueButtonText: {
    ...typography.button,
  },
});

export default BookingScreen;