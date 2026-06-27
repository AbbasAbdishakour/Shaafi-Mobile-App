// src/components/BookingCard.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { shadow } from '../theme/shadows';

const BookingCard = ({ booking }) => {
  const { theme } = useTheme();

  const statusConfig = {
    confirmed: { color: theme.success, label: 'Confirmed' },
    completed: { color: theme.primary, label: 'Completed' },
    pending: { color: theme.warning, label: 'Pending' },
    cancelled: { color: theme.danger, label: 'Cancelled' },
  };

  const status = statusConfig[booking.status] || { color: theme.grey, label: booking.status || 'Unknown' };

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <View style={[styles.accentBar, { backgroundColor: status.color }]} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Image source={{ uri: booking.avatar || 'https://randomuser.me/api/portraits/men/1.jpg' }} style={styles.avatar} />
          <View style={styles.info}>
            <Text style={[styles.name, { color: theme.dark }]}>{booking.doctorName}</Text>
            <Text style={[styles.specialty, { color: theme.grey }]}>{booking.specialty}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={14} color={theme.grey} />
            <Text style={[styles.detailText, { color: theme.dark }]}>{booking.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={14} color={theme.grey} />
            <Text style={[styles.detailText, { color: theme.dark }]}>{booking.time}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: radius.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadow.card,
  },
  accentBar: { width: 4 },
  content: { flex: 1, padding: spacing.md },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  info: { marginLeft: spacing.sm, flex: 1 },
  name: { ...typography.body, fontWeight: '600' },
  specialty: { ...typography.bodySmall },
  detailRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.sm },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  detailText: { ...typography.bodySmall },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.full },
  statusText: { ...typography.label, fontWeight: '600' },
});

export default BookingCard;