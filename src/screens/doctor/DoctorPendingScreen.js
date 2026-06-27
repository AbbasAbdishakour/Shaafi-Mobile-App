// src/screens/doctor/DoctorPendingScreen.js
import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';

const DoctorPendingScreen = () => {
  const { theme } = useTheme();
  const { signOut, getUserName } = useAuth();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface }]}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Icon */}
          <View style={[styles.iconCircle, { backgroundColor: theme.warning + '15' }]}>
            <Ionicons name="time" size={64} color={theme.warning} />
          </View>

          <Text style={[styles.title, { color: theme.dark }]}>Application Under Review</Text>

          <Text style={[styles.subtitle, { color: theme.grey }]}>
            Thank you for applying, Dr. {getUserName()}!
          </Text>

          <View style={[styles.infoCard, { backgroundColor: theme.background }]}>
            <Ionicons name="information-circle" size={24} color={theme.primary} />
            <Text style={[styles.infoText, { color: theme.secondary }]}>
              Your professional profile has been submitted and is currently being reviewed by our team. You will be notified once your application is approved.
            </Text>
          </View>

          <View style={styles.stepsContainer}>
            <View style={styles.stepRow}>
              <View style={[styles.stepDot, { backgroundColor: theme.success }]}>
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              </View>
              <Text style={[styles.stepText, { color: theme.dark }]}>Registration Submitted</Text>
            </View>
            <View style={[styles.stepLine, { backgroundColor: theme.border }]} />
            <View style={styles.stepRow}>
              <View style={[styles.stepDot, { backgroundColor: theme.warning }]}>
                <Text style={styles.stepDotText}>2</Text>
              </View>
              <Text style={[styles.stepText, { color: theme.dark }]}>Profile Review in Progress</Text>
            </View>
            <View style={[styles.stepLine, { backgroundColor: theme.border }]} />
            <View style={styles.stepRow}>
              <View style={[styles.stepDot, { backgroundColor: theme.lightGrey }]}>
                <Text style={[styles.stepDotText, { color: theme.grey }]}>3</Text>
              </View>
              <Text style={[styles.stepText, { color: theme.grey }]}>Approved & Ready to Practice</Text>
            </View>
          </View>

          <Pressable
            style={[styles.logoutButton, { borderColor: theme.border }]}
            onPress={signOut}
          >
            <Ionicons name="log-out-outline" size={20} color={theme.grey} />
            <Text style={[styles.logoutText, { color: theme.grey }]}>Sign Out</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, justifyContent: 'center' },
  content: { alignItems: 'center', paddingHorizontal: spacing.xl },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { ...typography.h1, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { ...typography.body, textAlign: 'center', marginBottom: spacing.lg },
  infoCard: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.sm,
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
    width: '100%',
  },
  infoText: { ...typography.bodySmall, flex: 1, lineHeight: 20 },
  stepsContainer: {
    width: '100%',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotText: { ...typography.label, fontWeight: '700', color: '#FFFFFF' },
  stepText: { ...typography.body, fontWeight: '500' },
  stepLine: { width: 2, height: 20, marginLeft: 13 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  logoutText: { ...typography.body, fontWeight: '500' },
});

export default DoctorPendingScreen;