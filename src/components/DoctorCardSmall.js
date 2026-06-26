// src/components/DoctorCardSmall.js
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { shadow } from '../theme/shadows';
import StarRating from './StarRating';

const DoctorCardSmall = ({ doctor, onPress }) => {
  const nextAvailable = doctor.availableDays[0];

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialty} • {doctor.experience} Yrs</Text>
      </View>
      <View style={styles.right}>
        <StarRating rating={doctor.rating} size={12} />
        <Text style={styles.next}>Next: {nextAvailable}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    ...typography.body,
    fontWeight: '600',
    color: colors.dark,
  },
  specialty: {
    ...typography.bodySmall,
    color: colors.grey,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  next: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '500',
  },
});

export default DoctorCardSmall;