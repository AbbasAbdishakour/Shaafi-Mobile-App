// src/components/StarRating.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const StarRating = ({ rating, size = 14, showNumber = true }) => {
  const { theme } = useTheme();
  const safeRating = Number(rating) || 0;
  const fullStars = Math.floor(safeRating);
  const hasHalf = safeRating - fullStars >= 0.5;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalf ? 1 : 0));

  return (
    <View style={styles.container}>
      {[...Array(fullStars)].map((_, i) => (
        <Ionicons key={`full-${i}`} name="star" size={size} color={theme.starYellow} />
      ))}
      {hasHalf && <Ionicons name="star-half" size={size} color={theme.starYellow} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Ionicons key={`empty-${i}`} name="star-outline" size={size} color={theme.lightGrey} />
      ))}
      {showNumber && <Text style={[styles.ratingText, { fontSize: size, color: theme.dark }]}>{safeRating.toFixed(1)}</Text>}
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
    marginLeft: spacing.xs,
  },
});

export default StarRating;