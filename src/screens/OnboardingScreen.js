// src/screens/OnboardingScreen.js
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Dimensions,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { shadow } from '../theme/shadows';
import { onboardingSlides } from '../data/onboardingSlides';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ onFinish }) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const goToNext = () => {
    if (currentIndex < onboardingSlides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onFinish();
    }
  };

  const skip = () => {
    onFinish();
  };

  const isLastSlide = currentIndex === onboardingSlides.length - 1;

  const renderSlide = ({ item }) => {
    if (item.isTeamSlide) {
      return (
        <View style={styles.slide}>
          <View style={styles.iconCircle}>
            <Ionicons name={item.icon} size={52} color={colors.primary} />
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>

          {/* Team List */}
          <View style={styles.teamContainer}>
            {item.team.map((member, index) => (
              <View key={index} style={styles.teamRow}>
                <View style={styles.teamAvatar}>
                  <Ionicons name="person" size={20} color={colors.primary} />
                </View>
                <View style={styles.teamInfo}>
                  <Text style={styles.teamName}>{member.name}</Text>
                  <Text style={styles.teamRole}>{member.role}</Text>
                </View>
                <View style={styles.teamIcons}>
                  <Ionicons name="logo-github" size={18} color={colors.secondary} />
                  <Ionicons name="logo-linkedin" size={18} color={colors.secondary} />
                  <Ionicons name="logo-twitter" size={18} color={colors.secondary} />
                </View>
              </View>
            ))}
          </View>

          <Text style={styles.version}>Shaafi v1.0</Text>
        </View>
      );
    }

    return (
      <View style={styles.slide}>
        <View style={styles.iconCircle}>
          <Ionicons name={item.icon} size={64} color={colors.primary} />
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Skip Button */}
      {!isLastSlide && (
        <Pressable style={styles.skipButton} onPress={skip}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={onboardingSlides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
      />

      {/* Footer: Dots + Button */}
      <View style={styles.footer}>
        {/* Dots */}
        <View style={styles.dotsContainer}>
          {onboardingSlides.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            const dotScale = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 1.3, 0.8],
              extrapolate: 'clamp',
            });

            const dotColor = scrollX.interpolate({
              inputRange,
              outputRange: [colors.lightGrey, colors.primary, colors.lightGrey],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    transform: [{ scale: dotScale }],
                    backgroundColor: dotColor,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Button */}
        <Pressable style={styles.button} onPress={goToNext}>
          <Text style={styles.buttonText}>
            {isLastSlide ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons
            name={isLastSlide ? 'checkmark-circle' : 'arrow-forward'}
            size={20}
            color={colors.white}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  skipButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  skipText: {
    ...typography.body,
    color: colors.secondary,
    fontWeight: '600',
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: 100,
  },
  iconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.grey,
    textAlign: 'center',
    lineHeight: 24,
  },
  teamContainer: {
    width: '100%',
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tertiary,
    padding: spacing.sm + 4,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  teamAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.dark,
    fontSize: 12,
  },
  teamRole: {
    ...typography.label,
    color: colors.grey,
    fontSize: 10,
  },
  teamIcons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  version: {
    ...typography.bodySmall,
    color: colors.lightGrey,
    marginTop: spacing.lg,
  },
  footer: {
    position: 'absolute',
    bottom: spacing.xl,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    alignItems: 'center',
    gap: spacing.sm,
    ...shadow.card,
  },
  buttonText: {
    ...typography.button,
  },
});

export default OnboardingScreen;