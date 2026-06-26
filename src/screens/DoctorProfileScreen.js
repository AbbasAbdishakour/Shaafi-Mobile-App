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
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { shadow } from '../theme/shadows';
import StarRating from '../components/StarRating';

const DoctorProfileScreen = ({ route, navigation }) => {
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
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: displayDoctor.avatar }} style={styles.avatar} />
              {displayDoctor.verified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={14} color={colors.white} />
                </View>
              )}
            </View>
            <Text style={styles.name}>{displayDoctor.name}</Text>
            <Text style={styles.meta}>{displayDoctor.specialty} • {displayDoctor.hospital}</Text>
            <View style={styles.ratingRow}>
              <StarRating rating={Number(displayDoctor.rating)} size={16} />
              <Text style={styles.reviewCount}>({reviewCountDisplay} reviews)</Text>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{displayDoctor.experience}+</Text>
              <Text style={styles.statLabel}>Years Exp.</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Math.floor(Number(displayDoctor.reviewCount) / 1000)}K+</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${displayDoctor.pricePerSession}</Text>
              <Text style={styles.statLabel}>Per Session</Text>
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio} numberOfLines={3}>{displayDoctor.bio}</Text>
            <Pressable>
              <Text style={styles.readMore}>Read more</Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* Book Button */}
        <View style={styles.buttonContainer}>
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
    backgroundColor: colors.tertiary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.tertiary,
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
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  name: {
    ...typography.h2,
    textAlign: 'center',
  },
  meta: {
    ...typography.bodySmall,
    color: colors.grey,
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
    color: colors.grey,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
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
    color: colors.primary,
  },
  statLabel: {
    ...typography.label,
    color: colors.grey,
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: colors.lightGrey,
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
    color: colors.grey,
    lineHeight: 20,
  },
  readMore: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  buttonContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.tertiary,
  },
  bookButton: {
    backgroundColor: colors.primary,
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