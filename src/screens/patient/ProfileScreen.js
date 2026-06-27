// src/screens/ProfileScreen.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';
import ShaafiAlert from '../../components/ShaafiAlert';

const ProfileScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, signOut, getUserName } = useAuth();
  const [stats, setStats] = useState({ appointments: 0, doctors: 0, reviews: 0 });
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const menuItems = [
    { id: '0', label: 'Dark Mode', icon: 'moon', action: 'theme', isToggle: true },
    { id: '1', label: 'Edit Profile', icon: 'person-outline', action: null },
    { id: '2', label: 'Notifications', icon: 'notifications-outline', action: null },
    { id: '3', label: 'Payment Methods', icon: 'card-outline', action: null },
    { id: '4', label: 'Privacy & Security', icon: 'lock-closed-outline', action: null },
    { id: '5', label: 'Help & Support', icon: 'help-circle-outline', action: null },
    { id: '6', label: 'Log Out', icon: 'log-out-outline', action: 'logout' },
  ];

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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color="#FFFFFF" />
          </View>
          <Text style={[styles.name, { color: theme.dark }]}>{getUserName()}</Text>
          <Text style={[styles.email, { color: theme.grey }]}>{user?.email || 'user@shaafi.com'}</Text>
        </View>

        <View style={[styles.statsRow, { backgroundColor: theme.surface }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.primary }]}>{stats.appointments}</Text>
            <Text style={[styles.statLabel, { color: theme.grey }]}>Appointments</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.primary }]}>{stats.doctors}</Text>
            <Text style={[styles.statLabel, { color: theme.grey }]}>Doctors</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.primary }]}>{stats.reviews}</Text>
            <Text style={[styles.statLabel, { color: theme.grey }]}>Reviews</Text>
          </View>
        </View>

        <View style={[styles.menuContainer, { backgroundColor: theme.surface }]}>
          {menuItems.map((item) => {
            const itemColor = item.action === 'logout' ? theme.danger : theme.dark;
            return (
              <Pressable
                key={item.id}
                style={({ pressed }) => [
                  styles.menuItem,
                  { borderBottomColor: theme.background },
                  pressed && !item.isToggle && { backgroundColor: theme.background },
                ]}
                onPress={() => handleMenuPress(item)}
              >
                <Ionicons name={item.icon} size={22} color={itemColor} />
                <Text style={[styles.menuLabel, { color: itemColor }]}>{item.label}</Text>
                {item.isToggle ? (
                  <Switch
                    value={isDark}
                    onValueChange={toggleTheme}
                    trackColor={{ false: theme.lightGrey, true: theme.primary }}
                    thumbColor="#FFFFFF"
                  />
                ) : item.id !== '6' ? (
                  <Ionicons name="chevron-forward" size={18} color={theme.lightGrey} />
                ) : null}
              </Pressable>
            );
          })}
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      <ShaafiAlert
        visible={showLogoutAlert}
        title="Log Out"
        message="Are you sure you want to log out? You will need to sign in again to access your appointments."
        icon="log-out-outline"
        iconColor={theme.danger}
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
  },
  container: {
    flex: 1,
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
    backgroundColor: '#2F80ED',
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
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
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
  },
  statLabel: {
    ...typography.label,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
  },
  menuContainer: {
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
    gap: spacing.md,
  },
  menuLabel: {
    ...typography.body,
    flex: 1,
  },
});

export default ProfileScreen;