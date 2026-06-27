// src/screens/DoctorProfileScreen.js
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
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import { shadow } from '../../theme/shadows';
import StarRating from '../../components/StarRating';

const DoctorProfileScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { doctor } = route.params;

  const displayDoctor = {
    ...doctor,
    reviewCount: doctor.review_count || doctor.reviewCount,
    pricePerSession: doctor.price_per_session || doctor.pricePerSession,
    availableDays: doctor.available_days || doctor.availableDays,
    timeSlots: doctor.time_slots || doctor.timeSlots,
  };

  const reviewCountDisplay = displayDoctor.reviewCount?.toLocaleString?.() || displayDoctor.reviewCount;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom']}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: displayDoctor.avatar }} style={styles.avatar} />
              {displayDoctor.verified && (
                <View style={[styles.verifiedBadge, { borderColor: theme.surface }]}>
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                </View>
              )}
            </View>
            <Text style={[styles.name, { color: theme.dark }]}>{displayDoctor.name}</Text>
            <Text style={[styles.meta, { color: theme.grey }]}>{displayDoctor.specialty} • {displayDoctor.hospital}</Text>
            <View style={styles.ratingRow}>
              <StarRating rating={Number(displayDoctor.rating)} size={16} />
              <Text style={[styles.reviewCount, { color: theme.grey }]}>({reviewCountDisplay} reviews)</Text>
            </View>
          </View>

          {/* Stats Row */}
          <View style={[styles.statsRow, { backgroundColor: theme.surface }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>{displayDoctor.experience}+</Text>
              <Text style={[styles.statLabel, { color: theme.grey }]}>Years Exp.</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>{Math.floor(Number(displayDoctor.reviewCount) / 1000)}K+</Text>
              <Text style={[styles.statLabel, { color: theme.grey }]}>Reviews</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>${displayDoctor.pricePerSession}</Text>
              <Text style={[styles.statLabel, { color: theme.grey }]}>Per Session</Text>
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.dark }]}>About</Text>
            <Text style={[styles.bio, { color: theme.grey }]} numberOfLines={3}>{displayDoctor.bio}</Text>
            <Pressable>
              <Text style={[styles.readMore, { color: theme.primary }]}>Read more</Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* Book Button */}
        <View style={[styles.buttonContainer, { backgroundColor: theme.background }]}>
          <Pressable
            style={styles.bookButton}
            onPress={() => navigation.navigate('Booking', { doctor: displayDoctor })}
          >
            <Text style={styles.bookButtonText}>Book Appointment</Text>
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
  header: {
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#2F80ED',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  name: {
    ...typography.h2,
    textAlign: 'center',
  },
  meta: {
    ...typography.bodySmall,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  reviewCount: {
    ...typography.bodySmall,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow.card,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h3,
  },
  statLabel: {
    ...typography.label,
    marginTop: 2,
  },
  divider: {
    width: 1,
  },
  section: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  bio: {
    ...typography.bodySmall,
    lineHeight: 20,
  },
  readMore: {
    ...typography.bodySmall,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  buttonContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  bookButton: {
    backgroundColor: '#2F80ED',
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    ...typography.button,
  },
});

export default DoctorProfileScreen;