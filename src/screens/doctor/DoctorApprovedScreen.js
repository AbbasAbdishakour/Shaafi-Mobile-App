// src/screens/doctor/DoctorApprovedScreen.js
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import { shadow } from '../../theme/shadows';
import { useAuth } from '../../context/AuthContext';

const DoctorApprovedScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { getUserName } = useAuth();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface }]}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Celebration Icon */}
          <View style={[styles.iconCircle, { backgroundColor: theme.success + '15' }]}>
            <Ionicons name="checkmark-circle" size={80} color={theme.success} />
          </View>

          <Text style={[styles.title, { color: theme.success }]}>Congratulations!</Text>

          <Text style={[styles.subtitle, { color: theme.dark }]}>
            Welcome to Shaafi, Dr. {getUserName()}!
          </Text>

          <View style={[styles.card, { backgroundColor: theme.background }]}>
            <Ionicons name="information-circle" size={22} color={theme.success} />
            <Text style={[styles.cardText, { color: theme.secondary }]}>
              Your professional profile has been approved. You can now manage your appointments, patients, and earnings through the doctor dashboard.
            </Text>
          </View>

          <Pressable
            style={[styles.button, { backgroundColor: theme.success }]}
            onPress={() => navigation.replace('DoctorTabs')}
          >
            <Text style={styles.buttonText}>Go to Dashboard</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
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
    width: 140, height: 140, borderRadius: 70,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
  },
  title: { ...typography.h1, marginBottom: spacing.sm, textAlign: 'center' },
  subtitle: { ...typography.body, textAlign: 'center', marginBottom: spacing.lg, lineHeight: 24 },
  card: {
    flexDirection: 'row', padding: spacing.md, borderRadius: radius.lg,
    gap: spacing.sm, alignItems: 'flex-start', marginBottom: spacing.xl, width: '100%',
  },
  cardText: { ...typography.bodySmall, flex: 1, lineHeight: 20 },
  button: {
    flexDirection: 'row', height: 56, borderRadius: radius.lg,
    alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    paddingHorizontal: spacing.xl, ...shadow.card,
  },
  buttonText: { ...typography.button, color: '#FFFFFF' },
});

export default DoctorApprovedScreen;