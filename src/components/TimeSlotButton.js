// src/components/TimeSlotButton.js
import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';

const TimeSlotButton = ({ label, subLabel, selected, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        selected ? styles.buttonActive : styles.buttonInactive,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: selected ? colors.white : colors.dark },
        ]}
      >
        {label}
      </Text>
      {subLabel && (
        <Text
          style={[
            styles.subLabel,
            { color: selected ? colors.white : colors.grey },
          ]}
        >
          {subLabel}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    minWidth: 70,
  },
  buttonActive: {
    backgroundColor: colors.primary,
  },
  buttonInactive: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
  },
  subLabel: {
    ...typography.bodySmall,
    marginTop: 2,
  },
});

export default TimeSlotButton;