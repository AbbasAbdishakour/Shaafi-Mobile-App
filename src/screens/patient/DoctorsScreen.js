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
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import { supabase } from '../../config/supabase';
import DoctorCardSmall from '../../components/DoctorCardSmall';
import SpecialtyChip from '../../components/SpecialtyChip';

const DoctorsScreen = ({ navigation }) => {
  const { theme } = useTheme();
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Ionicons name="search-outline" size={20} color={theme.grey} />
            <TextInput
              style={[styles.searchInput, { color: theme.dark }]}
              placeholder="Search Doctor or Specialty"
              placeholderTextColor={theme.grey}
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
              <Ionicons name="search-outline" size={48} color={theme.lightGrey} />
              <Text style={[styles.emptyText, { color: theme.grey }]}>No doctors found</Text>
              <Text style={[styles.emptySubtext, { color: theme.grey }]}>Try adjusting your search or filters</Text>
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
  },
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.full,
    height: 48,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
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
    marginTop: spacing.md,
  },
  emptySubtext: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
  },
});

export default DoctorsScreen;