// src/components/DoctorCard.js
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { shadow } from '../theme/shadows';
import StarRating from './StarRating';

const DoctorCard = ({ doctor, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.badges}>
        <View style={styles.hospitalBadge}>
          <Text style={styles.hospitalText}>{doctor.hospital}</Text>
        </View>
        <View style={styles.specialtyBadge}>
          <Text style={styles.specialtyText}>{doctor.specialty}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
        <View style={styles.details}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{doctor.name}</Text>
            {doctor.verified && (
              <Ionicons name="checkmark-circle" size={18} color={colors.white} />
            )}
          </View>
          <StarRating rating={doctor.rating} size={12} />
          <Text style={styles.experience}>{doctor.experience}+ Years Exp.</Text>
          <Text style={styles.price}>${doctor.pricePerSession}/Session</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 260,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginRight: spacing.md,
    ...shadow.card,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  hospitalBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  hospitalText: {
    ...typography.label,
    color: colors.white,
  },
  specialtyBadge: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  specialtyText: {
    ...typography.label,
    color: colors.white,
  },
  infoRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  details: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    ...typography.h3,
    color: colors.white,
    flex: 1,
  },
  experience: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  price: {
    ...typography.body,
    fontWeight: '600',
    color: colors.white,
    marginTop: spacing.xs,
  },
});

export default DoctorCard;