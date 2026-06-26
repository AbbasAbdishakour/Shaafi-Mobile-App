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
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import MessageItem from '../components/MessageItem';

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
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={colors.grey} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search messages"
              placeholderTextColor={colors.grey}
            />
          </View>
        </View>

        {/* Messages List */}
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
    backgroundColor: colors.tertiary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.tertiary,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.full,
    height: 48,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.dark,
  },
  list: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
});

export default MessagesScreen;