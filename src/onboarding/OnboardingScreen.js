// src/onboarding/OnboardingScreen.js
import React, { useRef, useState } from 'react';
import {
  View, Text, FlatList, Pressable,
  Dimensions, StyleSheet, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { shadow } from '../theme/shadows';
import { onboardingSlides } from '../data/onboardingSlides';

const { width } = Dimensions.get('window');
const PATIENT_COLOR = '#7C3AED';

const OnboardingScreen = ({ onFinish }) => {
  const { theme } = useTheme();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const goToNext = () => {
    if (currentIndex < onboardingSlides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else { onFinish(); }
  };
  const skip = () => onFinish();
  const isLastSlide = currentIndex === onboardingSlides.length - 1;

  const renderSlide = ({ item }) => {
    if (item.isTeamSlide) {
      return (
        <View style={styles.slide}>
          <View style={[styles.iconCircle, { backgroundColor: PATIENT_COLOR + '12' }]}>
            <Ionicons name={item.icon} size={52} color={PATIENT_COLOR} />
          </View>
          <Text style={[styles.title, { color: theme.dark }]}>{item.title}</Text>
          <Text style={[styles.description, { color: theme.grey }]}>{item.description}</Text>
          <View style={styles.teamContainer}>
            {item.team.map((member, index) => (
              <View key={index} style={[styles.teamRow, { backgroundColor: theme.background }]}>
                <View style={[styles.teamAvatar, { backgroundColor: PATIENT_COLOR + '15' }]}>
                  <Ionicons name="person" size={20} color={PATIENT_COLOR} />
                </View>
                <View style={styles.teamInfo}>
                  <Text style={[styles.teamName, { color: theme.dark }]}>{member.name}</Text>
                  <Text style={[styles.teamRole, { color: theme.grey }]}>{member.role}</Text>
                </View>
                <View style={styles.teamIcons}>
                  <Ionicons name="logo-github" size={18} color={theme.secondary} />
                  <Ionicons name="logo-linkedin" size={18} color={theme.secondary} />
                  <Ionicons name="logo-twitter" size={18} color={theme.secondary} />
                </View>
              </View>
            ))}
          </View>
          <Text style={[styles.version, { color: theme.lightGrey }]}>Shaafi v1.0</Text>
        </View>
      );
    }
    return (
      <View style={styles.slide}>
        <View style={[styles.iconCircle, { backgroundColor: PATIENT_COLOR + '12' }]}>
          <Ionicons name={item.icon} size={64} color={PATIENT_COLOR} />
        </View>
        <Text style={[styles.title, { color: theme.dark }]}>{item.title}</Text>
        <Text style={[styles.description, { color: theme.grey }]}>{item.description}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]} edges={['top', 'bottom']}>
      {!isLastSlide && (
        <Pressable style={[styles.skipButton, { borderColor: PATIENT_COLOR }]} onPress={skip}>
          <Text style={[styles.skipText, { color: PATIENT_COLOR }]}>Skip</Text>
        </Pressable>
      )}
      <FlatList
        ref={flatListRef} data={onboardingSlides} renderItem={renderSlide}
        keyExtractor={(item) => item.id} horizontal pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onViewableItemsChanged={onViewableItemsChanged} viewabilityConfig={viewabilityConfig} bounces={false}
      />
      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {onboardingSlides.map((_, index) => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
            const dotScale = scrollX.interpolate({ inputRange, outputRange: [0.8, 1.3, 0.8], extrapolate: 'clamp' });
            const dotColor = scrollX.interpolate({ inputRange, outputRange: [theme.lightGrey, PATIENT_COLOR, theme.lightGrey], extrapolate: 'clamp' });
            return <Animated.View key={index} style={[styles.dot, { transform: [{ scale: dotScale }], backgroundColor: dotColor }]} />;
          })}
        </View>
        <Pressable style={[styles.button, { backgroundColor: PATIENT_COLOR }]} onPress={goToNext}>
          <Text style={styles.buttonText}>{isLastSlide ? 'Get Started' : 'Next'}</Text>
          <Ionicons name={isLastSlide ? 'checkmark-circle' : 'arrow-forward'} size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  skipButton: { position: 'absolute', top: 80, right: spacing.md, zIndex: 10, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm + 2, borderRadius: radius.full, borderWidth: 1.5 },
  skipText: { ...typography.body, fontWeight: '800', fontSize: 15 },
  slide: { width, flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl, paddingBottom: 100 },
  iconCircle: { width: 130, height: 130, borderRadius: 65, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  title: { ...typography.h1, textAlign: 'center', marginBottom: spacing.md },
  description: { ...typography.body, textAlign: 'center', lineHeight: 24 },
  teamContainer: { width: '100%', marginTop: spacing.xl, gap: spacing.sm },
  teamRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.sm + 4, borderRadius: radius.md, gap: spacing.sm },
  teamAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  teamInfo: { flex: 1 },
  teamName: { ...typography.bodySmall, fontWeight: '600', fontSize: 12 },
  teamRole: { ...typography.label, fontSize: 10 },
  teamIcons: { flexDirection: 'row', gap: spacing.sm },
  version: { ...typography.bodySmall, marginTop: spacing.lg },
  footer: { position: 'absolute', bottom: spacing.xl, left: 0, right: 0, alignItems: 'center', paddingHorizontal: spacing.xl, gap: spacing.lg },
  dotsContainer: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  button: { flexDirection: 'row', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.full, alignItems: 'center', gap: spacing.sm, ...shadow.card },
  buttonText: { ...typography.button },
});

export default OnboardingScreen;