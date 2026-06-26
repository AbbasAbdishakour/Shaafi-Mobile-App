// src/screens/ProfileScreen.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import ShaafiAlert from '../components/ShaafiAlert';

const menuItems = [
  { id: '1', label: 'Edit Profile', icon: 'person-outline', color: colors.dark, action: null },
  { id: '2', label: 'Notifications', icon: 'notifications-outline', color: colors.dark, action: null },
  { id: '3', label: 'Payment Methods', icon: 'card-outline', color: colors.dark, action: null },
  { id: '4', label: 'Privacy & Security', icon: 'lock-closed-outline', color: colors.dark, action: null },
  { id: '5', label: 'Help & Support', icon: 'help-circle-outline', color: colors.dark, action: null },
  { id: '6', label: 'Log Out', icon: 'log-out-outline', color: colors.danger, action: 'logout' },
];

const ProfileScreen = () => {
  const { user, signOut, getUserName } = useAuth();
  const [stats, setStats] = useState({ appointments: 0, doctors: 0, reviews: 0 });
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [user])
  );

  const fetchStats = async () => {
    if (!user) return;
    try {
      const [appointmentsRes, doctorsRes] = await Promise.all([
        supabase.from('appointments').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('doctors').select('id', { count: 'exact' }),
      ]);
      setStats({
        appointments: appointmentsRes.count || 0,
        doctors: doctorsRes.count || 0,
        reviews: 0,
      });
    } catch (error) {
      console.log('Error fetching stats:', error.message);
    }
  };

  const handleMenuPress = (item) => {
    if (item.action === 'logout') {
      setShowLogoutAlert(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color={colors.white} />
          </View>
          <Text style={styles.name}>{getUserName()}</Text>
          <Text style={styles.email}>{user?.email || 'user@shaafi.com'}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.appointments}</Text>
            <Text style={styles.statLabel}>Appointments</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.doctors}</Text>
            <Text style={styles.statLabel}>Doctors</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.reviews}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: colors.tertiary },
              ]}
              onPress={() => handleMenuPress(item)}
            >
              <Ionicons name={item.icon} size={22} color={item.color} />
              <Text style={[styles.menuLabel, { color: item.color }]}>
                {item.label}
              </Text>
              {item.id !== '6' && (
                <Ionicons name="chevron-forward" size={18} color={colors.lightGrey} />
              )}
            </Pressable>
          ))}
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      {/* Logout Alert */}
      <ShaafiAlert
        visible={showLogoutAlert}
        title="Log Out"
        message="Are you sure you want to log out? You will need to sign in again to access your appointments."
        icon="log-out-outline"
        iconColor={colors.danger}
        cancelText="Cancel"
        confirmText="Log Out"
        confirmDestructive={true}
        onCancel={() => setShowLogoutAlert(false)}
        onConfirm={() => {
          setShowLogoutAlert(false);
          signOut();
        }}
      />
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
  header: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  name: {
    ...typography.h2,
    textTransform: 'capitalize',
  },
  email: {
    ...typography.bodySmall,
    color: colors.grey,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h3,
    color: colors.primary,
  },
  statLabel: {
    ...typography.label,
    color: colors.grey,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.lightGrey,
  },
  menuContainer: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.tertiary,
    gap: spacing.md,
  },
  menuLabel: {
    ...typography.body,
    flex: 1,
  },
});

export default ProfileScreen;