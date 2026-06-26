// src/components/CustomTabBar.js
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const tabs = [
  { name: 'Home', icon: 'home', label: 'Home' },
  { name: 'Doctors', icon: 'search', label: 'Doctors' },
  { name: 'Bookings', icon: 'calendar', label: 'Bookings' },
  { name: 'Messages', icon: 'chatbubble', label: 'Messages' },
  { name: 'Profile', icon: 'person', label: 'Profile' },
];

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const tabConfig = tabs.find((t) => t.name === route.name);

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

        const iconColor = isFocused ? colors.primary : colors.grey;

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tab}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={isFocused ? tabConfig.icon : `${tabConfig.icon}-outline`}
                size={24}
                color={iconColor}
              />
              {isFocused && <View style={styles.activeDot} />}
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
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey,
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
    backgroundColor: colors.primary,
    marginTop: 2,
  },
  label: {
    ...typography.label,
    marginTop: 2,
  },
});

export default CustomTabBar;