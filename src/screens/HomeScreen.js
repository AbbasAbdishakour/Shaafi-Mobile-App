// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import SectionHeader from '../components/SectionHeader';
import DoctorCard from '../components/DoctorCard';
import DoctorCardSmall from '../components/DoctorCardSmall';
import SpecialtyChip from '../components/SpecialtyChip';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning!';
  if (hour < 17) return 'Good Afternoon!';
  return 'Good Evening!';
};

const HomeScreen = ({ navigation }) => {
  const { getUserName } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);

  const displayName = getUserName();
  const greeting = getGreeting();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [doctorsRes, specialtiesRes] = await Promise.all([
        supabase.from('doctors').select('*'),
        supabase.from('specialties').select('*'),
      ]);
      setDoctors(doctorsRes.data || []);
      setSpecialties(specialtiesRes.data || []);
      if (specialtiesRes.data && specialtiesRes.data.length > 0) {
        setSelectedSpecialty(specialtiesRes.data[0].id.toString());
      }
    } catch (error) {
      console.log('Error fetching data:', error.message);
    }
  };

  const topDoctors = doctors.slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={24} color={colors.white} />
            </View>
            <View>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.userName} numberOfLines={1}>{displayName}</Text>
            </View>
          </View>
          <Pressable>
            <Ionicons name="notifications-outline" size={24} color={colors.dark} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color={colors.grey} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search Nearest Available Doctor"
                placeholderTextColor={colors.grey}
              />
              <Ionicons name="options-outline" size={20} color={colors.grey} />
            </View>
          </View>

          {/* Top Doctors */}
          {topDoctors.length > 0 && (
            <>
              <SectionHeader
                title="Top Doctors"
                onSeeAll={() => navigation.navigate('Doctors')}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {topDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={{
                      ...doctor,
                      reviewCount: doctor.review_count,
                      pricePerSession: doctor.price_per_session,
                      availableDays: doctor.available_days,
                      timeSlots: doctor.time_slots,
                    }}
                    onPress={() => navigation.navigate('DoctorProfile', { doctor })}
                  />
                ))}
              </ScrollView>
            </>
          )}

          {/* Specialties */}
          {specialties.length > 0 && (
            <>
              <SectionHeader title="Specialties" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipScroll}
              >
                {specialties.map((item) => (
                  <SpecialtyChip
                    key={item.id}
                    name={item.name}
                    icon={item.icon}
                    selected={selectedSpecialty === item.id.toString()}
                    onPress={() => setSelectedSpecialty(item.id.toString())}
                  />
                ))}
              </ScrollView>
            </>
          )}

          {/* Available Doctors */}
          {doctors.length > 0 && (
            <>
              <SectionHeader title="Available Doctors" onSeeAll={() => navigation.navigate('Doctors')} />
              {doctors.map((doctor) => (
                <DoctorCardSmall
                  key={doctor.id}
                  doctor={{
                    ...doctor,
                    reviewCount: doctor.review_count,
                    pricePerSession: doctor.price_per_session,
                    availableDays: doctor.available_days,
                    timeSlots: doctor.time_slots,
                  }}
                  onPress={() => navigation.navigate('DoctorProfile', { doctor })}
                />
              ))}
            </>
          )}

          <View style={{ height: spacing.xl }} />
        </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.tertiary,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    ...typography.bodySmall,
    color: colors.grey,
  },
  userName: {
    ...typography.h3,
    textTransform: 'capitalize',
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tertiary,
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
  horizontalScroll: {
    paddingLeft: spacing.md,
  },
  chipScroll: {
    paddingLeft: spacing.md,
  },
});

export default HomeScreen;