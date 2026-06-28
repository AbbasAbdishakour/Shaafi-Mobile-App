// src/components/MessageItem.js
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';

const MessageItem = ({ name, avatar, lastMessage, time, unread, onPress }) => {
  const { theme } = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        {unread > 0 && <View style={[styles.unreadBadge, { backgroundColor: theme.primary, borderColor: theme.surface }]} />}
      </View>
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={[styles.name, { color: theme.dark }]} numberOfLines={1}>{name}</Text>
          <Text style={[styles.time, { color: theme.grey }]}>{time}</Text>
        </View>
        <Text style={[styles.message, { color: theme.grey }]} numberOfLines={1}>{lastMessage}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 4, marginHorizontal: spacing.md, marginBottom: spacing.xs, borderRadius: radius.lg },
  avatarContainer: { position: 'relative' },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  unreadBadge: { position: 'absolute', top: 2, right: 2, width: 12, height: 12, borderRadius: 6, borderWidth: 2 },
  info: { flex: 1, marginLeft: spacing.md },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  name: { ...typography.body, fontWeight: '600', flex: 1 },
  time: { ...typography.label, marginLeft: spacing.sm },
  message: { ...typography.bodySmall },
});

export default MessageItem;