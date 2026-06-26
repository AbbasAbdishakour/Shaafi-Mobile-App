// src/components/StarRating.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const StarRating = ({ rating, size = 14, showNumber = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <View style={styles.container}>
      {[...Array(fullStars)].map((_, i) => (
        <Ionicons key={`full-${i}`} name="star" size={size} color={colors.starYellow} />
      ))}
      {hasHalf && <Ionicons name="star-half" size={size} color={colors.starYellow} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Ionicons key={`empty-${i}`} name="star-outline" size={size} color={colors.lightGrey} />
      ))}
      {showNumber && <Text style={[styles.ratingText, { fontSize: size }]}>{rating.toFixed(1)}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.dark,
    marginLeft: spacing.xs,
  },
});

export default StarRating;