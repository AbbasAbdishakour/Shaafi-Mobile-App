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
import { useTheme } from '../context/ThemeContext';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { shadow } from '../theme/shadows';

const BookingSuccessScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { doctor, selectedDay, selectedTime } = route.params;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface }]}>
      <View style={[styles.container, { backgroundColor: theme.surface }]}>
        <View style={styles.content}>
          <Ionicons name="checkmark-circle" size={100} color={theme.success} />

          <Text style={[styles.title, { color: theme.dark }]}>Booking Confirmed!</Text>

          <Text style={[styles.subtitle, { color: theme.grey }]}>
            Your appointment has been successfully booked.
          </Text>

          <View style={[styles.summaryCard, { backgroundColor: theme.surface }]}>
            <View style={[styles.summaryLeft, { backgroundColor: theme.primary }]} />
            <View style={styles.summaryContent}>
              <Text style={[styles.doctorName, { color: theme.dark }]}>{doctor.name}</Text>
              <Text style={[styles.summaryDetail, { color: theme.grey }]}>
                {selectedDay} at {selectedTime}
              </Text>
            </View>
          </View>

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
            style={[styles.secondaryButton, { backgroundColor: theme.surface, borderColor: theme.primary }]}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Tabs' }],
              })
            }
          >
            <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>Go to Home</Text>
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
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  summaryCard: {
    flexDirection: 'row',
    borderRadius: radius.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    overflow: 'hidden',
    ...shadow.card,
    width: '100%',
  },
  summaryLeft: {
    width: 4,
  },
  summaryContent: {
    flex: 1,
    padding: spacing.md,
  },
  doctorName: {
    ...typography.body,
    fontWeight: '600',
  },
  summaryDetail: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
  },
  primaryButton: {
    backgroundColor: '#2F80ED',
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
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1.5,
  },
  secondaryButtonText: {
    ...typography.body,
    fontWeight: '600',
  },
});

export default BookingSuccessScreen;