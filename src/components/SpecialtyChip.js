// src/components/SpecialtyChip.js
import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';

const SpecialtyChip = ({ name, icon, selected, onPress }) => {
  const { theme } = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected ? { backgroundColor: theme.primary } : { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }]}>
      <Ionicons name={icon} size={16} color={selected ? '#FFFFFF' : theme.secondary} />
      <Text style={[styles.text, { color: selected ? '#FFFFFF' : theme.dark }]}>{name}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full, marginRight: spacing.sm },
  text: { ...typography.bodySmall, fontWeight: '500' },
});

export default SpecialtyChip;