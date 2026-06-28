// src/screens/doctor/DoctorApprovedScreen.js
import React, { useRef, useState } from 'react';
import {
  View, Text, FlatList, Pressable,
  Dimensions, StyleSheet, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import { shadow } from '../../theme/shadows';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const doctorSlides = [
  {
    id: '1', icon: 'calendar', title: 'Manage Appointments',
    description: 'View, approve, and manage all your patient appointments from one dashboard. Accept or reject bookings with a single tap.',
  },
  {
    id: '2', icon: 'cash', title: 'Track Your Earnings',
    description: 'Monitor your revenue in real-time. See payments per session, track monthly income, and grow your practice.',
  },
  {
    id: '3', icon: 'settings', title: 'Control Your Schedule',
    description: 'Set your working days, manage time slots, and update your profile. Full control over your availability.',
  },
];

const DoctorApprovedScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { getUserName } = useAuth();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const goToNext = () => {
    if (currentIndex < doctorSlides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('DoctorTabs');
    }
  };

  const skip = () => navigation.replace('DoctorTabs');
  const isLastSlide = currentIndex === doctorSlides.length - 1;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]} edges={['top', 'bottom']}>
      {/* Welcome Header */}
      <View style={styles.welcomeHeader}>
        <View style={[styles.welcomeIcon, { backgroundColor: theme.success + '15' }]}>
          <Ionicons name="checkmark-circle" size={40} color={theme.success} />
        </View>
        <Text style={[styles.welcomeTitle, { color: theme.success }]}>Congratulations!</Text>
        <Text style={[styles.welcomeSub, { color: theme.dark }]}>Welcome, Dr. {getUserName()}!</Text>
      </View>

      {/* Skip Button */}
      {!isLastSlide && (
        <Pressable style={[styles.skipButton, { borderColor: theme.success }]} onPress={skip}>
          <Text style={[styles.skipText, { color: theme.success }]}>Skip</Text>
        </Pressable>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef} data={doctorSlides}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={[styles.iconCircle, { backgroundColor: theme.success + '12' }]}>
              <Ionicons name={item.icon} size={64} color={theme.success} />
            </View>
            <Text style={[styles.title, { color: theme.dark }]}>{item.title}</Text>
            <Text style={[styles.description, { color: theme.grey }]}>{item.description}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id} horizontal pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onViewableItemsChanged={onViewableItemsChanged} viewabilityConfig={viewabilityConfig} bounces={false}
      />

      {/* Footer: Dots + Button */}
      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {doctorSlides.map((_, index) => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
            const dotScale = scrollX.interpolate({ inputRange, outputRange: [0.8, 1.3, 0.8], extrapolate: 'clamp' });
            const dotColor = scrollX.interpolate({ inputRange, outputRange: [theme.lightGrey, theme.success, theme.lightGrey], extrapolate: 'clamp' });
            return <Animated.View key={index} style={[styles.dot, { transform: [{ scale: dotScale }], backgroundColor: dotColor }]} />;
          })}
        </View>

        <Pressable style={[styles.button, { backgroundColor: theme.success }]} onPress={goToNext}>
          <Text style={styles.buttonText}>{isLastSlide ? 'Go to Dashboard' : 'Next'}</Text>
          <Ionicons name={isLastSlide ? 'checkmark-circle' : 'arrow-forward'} size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  welcomeHeader: { alignItems: 'center', paddingTop: spacing.lg, paddingBottom: spacing.md },
  welcomeIcon: { width: 70, height: 70, borderRadius: 35, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  welcomeTitle: { ...typography.h2, marginBottom: spacing.xs },
  welcomeSub: { ...typography.body },
  skipButton: {
    position: 'absolute', top: 80, right: spacing.md, zIndex: 10,
    paddingHorizontal: spacing.xl, paddingVertical: spacing.sm + 2,
    borderRadius: radius.full, borderWidth: 1.5,
  },
  skipText: { ...typography.body, fontWeight: '800', fontSize: 15 },
  slide: { width, flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl, paddingBottom: 80 },
  iconCircle: { width: 130, height: 130, borderRadius: 65, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  title: { ...typography.h1, textAlign: 'center', marginBottom: spacing.md },
  description: { ...typography.body, textAlign: 'center', lineHeight: 24 },
  footer: { position: 'absolute', bottom: spacing.xl, left: 0, right: 0, alignItems: 'center', paddingHorizontal: spacing.xl, gap: spacing.lg },
  dotsContainer: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  button: { flexDirection: 'row', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.full, alignItems: 'center', gap: spacing.sm, ...shadow.card },
  buttonText: { ...typography.button },
});

export default DoctorApprovedScreen;