// src/screens/BookingSuccessScreen.js
import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { shadow } from '../theme/shadows';

const BookingSuccessScreen = ({ route, navigation }) => {
  const { doctor, selectedDay, selectedTime } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Success Icon */}
          <Ionicons name="checkmark-circle" size={100} color={colors.success} />

          {/* Title */}
          <Text style={styles.title}>Booking Confirmed!</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Your appointment has been successfully booked.
          </Text>

          {/* Summary Box */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryLeft} />
            <View style={styles.summaryContent}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.summaryDetail}>
                {selectedDay} at {selectedTime}
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Tabs', state: { routes: [{ name: 'Bookings' }] } }],
              })
            }
          >
            <Text style={styles.primaryButtonText}>View My Bookings</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Tabs' }],
              })
            }
          >
            <Text style={styles.secondaryButtonText}>Go to Home</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...typography.h1,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  subtitle: {
    ...typography.body,
    color: colors.grey,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    overflow: 'hidden',
    ...shadow.card,
    width: '100%',
  },
  summaryLeft: {
    width: 4,
    backgroundColor: colors.primary,
  },
  summaryContent: {
    flex: 1,
    padding: spacing.md,
  },
  doctorName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.dark,
  },
  summaryDetail: {
    ...typography.bodySmall,
    color: colors.grey,
    marginTop: spacing.xs,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: spacing.md,
  },
  primaryButtonText: {
    ...typography.button,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default BookingSuccessScreen;