// src/screens/MessagesScreen.js
import React from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import MessageItem from '../../components/MessageItem';

const mockMessages = [
  {
    id: '1',
    name: 'Dr. Habeeb',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    lastMessage: 'Thank you for the session today...',
    time: '2:30 PM',
    unread: 2,
  },
  {
    id: '2',
    name: 'Dr. Cismaan Dufle',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastMessage: 'Your next appointment is confirmed...',
    time: 'Yesterday',
    unread: 0,
  },
  {
    id: '3',
    name: 'Dr. Amina Hassan',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastMessage: 'Please bring your previous reports...',
    time: 'Mon',
    unread: 1,
  },
];

const MessagesScreen = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Ionicons name="search-outline" size={20} color={theme.grey} />
            <TextInput
              style={[styles.searchInput, { color: theme.dark }]}
              placeholder="Search messages"
              placeholderTextColor={theme.grey}
            />
          </View>
        </View>

        <FlatList
          data={mockMessages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <MessageItem
              name={item.name}
              avatar={item.avatar}
              lastMessage={item.lastMessage}
              time={item.time}
              unread={item.unread}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.full,
    height: 48,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
  },
  list: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
});

export default MessagesScreen;