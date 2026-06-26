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
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { shadow } from '../theme/shadows';

const ConfirmBookingScreen = ({ route, navigation }) => {
  const { doctor, selectedDay, selectedTime } = route.params;

  const displayDoctor = {
    ...doctor,
    pricePerSession: doctor.price_per_session || doctor.pricePerSession,
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Confirm Booking</Text>

          {/* Summary Card */}
          <View style={styles.card}>
            <View style={styles.doctorRow}>
              <Image source={{ uri: displayDoctor.avatar }} style={styles.avatar} />
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{displayDoctor.name}</Text>
                <Text style={styles.doctorSpecialty}>{displayDoctor.specialty}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={18} color={colors.secondary} />
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{selectedDay}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color={colors.secondary} />
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{selectedTime}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={18} color={colors.secondary} />
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={styles.detailValue}>${displayDoctor.pricePerSession}/Session</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${displayDoctor.pricePerSession}</Text>
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
    backgroundColor: colors.tertiary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.tertiary,
  },
  title: {
    ...typography.h2,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
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
    color: colors.dark,
  },
  doctorSpecialty: {
    ...typography.bodySmall,
    color: colors.grey,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGrey,
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
    color: colors.dark,
    flex: 1,
  },
  detailValue: {
    ...typography.body,
    fontWeight: '600',
    color: colors.dark,
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
    color: colors.primary,
  },
  buttonContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  confirmButton: {
    backgroundColor: colors.primary,
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