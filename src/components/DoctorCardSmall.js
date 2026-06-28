// src/components/DoctorCardSmall.js
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { shadow } from '../theme/shadows';
import StarRating from './StarRating';

const DoctorCardSmall = ({ doctor, onPress }) => {
  const { theme } = useTheme();
  const nextAvailable = doctor.availableDays?.[0] || 'N/A';
  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor: theme.surface }]}>
      <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.dark }]} numberOfLines={1}>{doctor.name}</Text>
        <Text style={[styles.specialty, { color: theme.grey }]}>{doctor.specialty} • {doctor.experience} Yrs</Text>
      </View>
      <View style={styles.right}>
        <StarRating rating={doctor.rating} size={12} />
        <Text style={[styles.next, { color: theme.primary }]}>Next: {nextAvailable}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.lg, padding: spacing.md, marginHorizontal: spacing.md, marginBottom: spacing.sm, ...shadow.card },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  info: { flex: 1, marginLeft: spacing.md },
  name: { ...typography.body, fontWeight: '600' },
  specialty: { ...typography.bodySmall, marginTop: 2 },
  right: { alignItems: 'flex-end', gap: 4 },
  next: { ...typography.bodySmall, fontWeight: '500' },
});

export default DoctorCardSmall;