// src/screens/ConfirmBookingScreen.js
import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { shadow } from '../theme/shadows';

const ConfirmBookingScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { doctor, selectedDay, selectedTime } = route.params;

  const displayDoctor = {
    ...doctor,
    pricePerSession: doctor.price_per_session || doctor.pricePerSession,
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom']}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: theme.dark }]}>Confirm Booking</Text>

          {/* Summary Card */}
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <View style={styles.doctorRow}>
              <Image source={{ uri: displayDoctor.avatar }} style={styles.avatar} />
              <View style={styles.doctorInfo}>
                <Text style={[styles.doctorName, { color: theme.dark }]}>{displayDoctor.name}</Text>
                <Text style={[styles.doctorSpecialty, { color: theme.grey }]}>{displayDoctor.specialty}</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={18} color={theme.secondary} />
              <Text style={[styles.detailLabel, { color: theme.dark }]}>Date</Text>
              <Text style={[styles.detailValue, { color: theme.dark }]}>{selectedDay}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color={theme.secondary} />
              <Text style={[styles.detailLabel, { color: theme.dark }]}>Time</Text>
              <Text style={[styles.detailValue, { color: theme.dark }]}>{selectedTime}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={18} color={theme.secondary} />
              <Text style={[styles.detailLabel, { color: theme.dark }]}>Price</Text>
              <Text style={[styles.detailValue, { color: theme.dark }]}>${displayDoctor.pricePerSession}/Session</Text>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: theme.dark }]}>Total</Text>
              <Text style={[styles.totalValue, { color: theme.primary }]}>${displayDoctor.pricePerSession}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Confirm Button */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.confirmButton}
            onPress={() =>
              navigation.navigate('Payment', {
                doctor: displayDoctor,
                selectedDay,
                selectedTime,
              })
            }
          >
            <Text style={styles.confirmButtonText}>Proceed to Payment</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  title: {
    ...typography.h2,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },
  card: {
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    ...shadow.card,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  doctorInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  doctorName: {
    ...typography.body,
    fontWeight: '600',
  },
  doctorSpecialty: {
    ...typography.bodySmall,
  },
  divider: {
    height: 1,
    marginVertical: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs + 2,
    gap: spacing.sm,
  },
  detailLabel: {
    ...typography.body,
    flex: 1,
  },
  detailValue: {
    ...typography.body,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  totalLabel: {
    ...typography.h3,
  },
  totalValue: {
    ...typography.h3,
  },
  buttonContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  confirmButton: {
    backgroundColor: '#2F80ED',
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    ...typography.button,
  },
});

export default ConfirmBookingScreen;