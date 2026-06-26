// src/screens/DoctorsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { supabase } from '../config/supabase';
import DoctorCardSmall from '../components/DoctorCardSmall';
import SpecialtyChip from '../components/SpecialtyChip';

const DoctorsScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);

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
    } catch (error) {
      console.log('Error fetching data:', error.message);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty = selectedSpecialty
      ? doctor.specialty === specialties.find((s) => s.id.toString() === selectedSpecialty)?.name
      : true;
    return matchesSearch && matchesSpecialty;
  });

  const mappedDoctor = (doctor) => ({
    ...doctor,
    reviewCount: doctor.review_count,
    pricePerSession: doctor.price_per_session,
    availableDays: doctor.available_days,
    timeSlots: doctor.time_slots,
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={colors.grey} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Doctor or Specialty"
              placeholderTextColor={colors.grey}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* Specialty Chips */}
        {specialties.length > 0 && (
          <FlatList
            horizontal
            data={specialties}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScroll}
            renderItem={({ item }) => (
              <SpecialtyChip
                name={item.name}
                icon={item.icon}
                selected={selectedSpecialty === item.id.toString()}
                onPress={() =>
                  setSelectedSpecialty(
                    selectedSpecialty === item.id.toString() ? null : item.id.toString()
                  )
                }
              />
            )}
          />
        )}

        {/* Doctor List */}
        <FlatList
          data={filteredDoctors}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={48} color={colors.lightGrey} />
              <Text style={styles.emptyText}>No doctors found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
            </View>
          }
          renderItem={({ item }) => (
            <DoctorCardSmall
              doctor={mappedDoctor(item)}
              onPress={() => navigation.navigate('DoctorProfile', { doctor: item })}
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
  chipScroll: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
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
    color: colors.grey,
    marginTop: spacing.md,
  },
  emptySubtext: {
    ...typography.bodySmall,
    color: colors.grey,
    marginTop: spacing.xs,
  },
});

export default DoctorsScreen;