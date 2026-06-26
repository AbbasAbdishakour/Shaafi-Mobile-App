// src/components/SpecialtyChip.js
import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';

const SpecialtyChip = ({ name, icon, selected, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        selected ? styles.chipActive : styles.chipInactive,
      ]}
    >
      <Ionicons
        name={icon}
        size={16}
        color={selected ? colors.white : colors.secondary}
      />
      <Text
        style={[
          styles.text,
          { color: selected ? colors.white : colors.dark },
        ]}
      >
        {name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginRight: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipInactive: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  text: {
    ...typography.bodySmall,
    fontWeight: '500',
  },
});

export default SpecialtyChip;