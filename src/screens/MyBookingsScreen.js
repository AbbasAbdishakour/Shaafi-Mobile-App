// src/screens/MyBookingsScreen.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'confirmed', label: 'Upcoming' },
  { key: 'pending', label: 'Pending' },
  { key: 'cancelled', label: 'Cancelled' },
];

const MyBookingsScreen = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setBookings(data || []);
    } catch (error) {
      console.log('Error fetching bookings:', error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [user])
  );

  const filteredBookings =
    activeTab === 'all'
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.tabRow}>
          {tabs.map((tab) => (
            <Pressable
              key={tab.key}
              style={[
                styles.tab,
                { backgroundColor: theme.surface, borderColor: theme.border },
                activeTab === tab.key && { backgroundColor: theme.primary, borderColor: theme.primary },
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: theme.grey },
                  activeTab === tab.key && { color: '#FFFFFF' },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="calendar-outline" size={48} color={theme.lightGrey} />
              <Text style={[styles.emptyText, { color: theme.grey }]}>No bookings yet</Text>
            </View>
          }
          renderItem={({ item }) => <BookingCard booking={item} />}
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
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  tabText: {
    ...typography.bodySmall,
    fontWeight: '500',
  },
  list: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  empty: {
    alignItems: 'center',
    paddingTop: spacing.xxl * 2,
  },
  emptyText: {
    ...typography.h3,
    marginTop: spacing.md,
  },
});

export default MyBookingsScreen;