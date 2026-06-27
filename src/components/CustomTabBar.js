// src/components/CustomTabBar.js
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const patientTabs = [
  { name: 'Home', icon: 'home', label: 'Home' },
  { name: 'Doctors', icon: 'search', label: 'Doctors' },
  { name: 'Bookings', icon: 'calendar', label: 'Bookings' },
  { name: 'Messages', icon: 'chatbubble', label: 'Messages' },
  { name: 'Profile', icon: 'person', label: 'Profile' },
];

const doctorTabs = [
  { name: 'Dashboard', icon: 'grid', label: 'Dashboard' },
  { name: 'Appointments', icon: 'calendar', label: 'Appointments' },
  { name: 'Profile', icon: 'person', label: 'Profile' },
];

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { theme } = useTheme();

  // Detect if we're in doctor or patient navigator
  const isDoctorNav = state.routes.some(r => r.name === 'Dashboard');
  const tabs = isDoctorNav ? doctorTabs : patientTabs;

  return (
    <View style={[styles.container, { backgroundColor: theme.tabBarBg, borderTopColor: theme.tabBarBorder }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const tabConfig = tabs.find((t) => t.name === route.name);

        if (!tabConfig) return null;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconColor = isFocused ? theme.primary : theme.grey;

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tab}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={isFocused ? tabConfig.icon : `${tabConfig.icon}-outline`}
                size={24}
                color={iconColor}
              />
              {isFocused && <View style={[styles.activeDot, { backgroundColor: theme.primary }]} />}
            </View>
            <Text style={[styles.label, { color: iconColor }]}>
              {tabConfig.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  label: {
    ...typography.label,
    marginTop: 2,
  },
});

export default CustomTabBar;