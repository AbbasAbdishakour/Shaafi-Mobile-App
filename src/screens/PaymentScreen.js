// src/screens/PaymentScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import ShaafiAlert from '../components/ShaafiAlert';

const paymentMethods = [
  { id: 'card', label: 'Credit / Debit Card', icon: 'card-outline' },
  { id: 'mobile', label: 'Mobile Payment', icon: 'phone-portrait-outline' },
  { id: 'bank', label: 'Bank Transfer', icon: 'business-outline' },
];

const PaymentScreen = ({ route, navigation }) => {
  const { user } = useAuth();
  const { doctor, selectedDay, selectedTime } = route.params;

  const displayDoctor = {
    ...doctor,
    pricePerSession: doctor.price_per_session || doctor.pricePerSession,
  };

  const [selectedMethod, setSelectedMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', icon: '', iconColor: '' });

  const showAlert = (title, message, icon = 'close-circle', iconColor = colors.danger) => {
    setAlert({ visible: true, title, message, icon, iconColor });
  };

  const hideAlert = () => {
    setAlert({ ...alert, visible: false });
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('appointments').insert({
        user_id: user.id,
        doctor_id: displayDoctor.id,
        doctor_name: displayDoctor.name,
        specialty: displayDoctor.specialty,
        date: selectedDay,
        time: selectedTime,
        status: 'confirmed',
      });

      if (error) throw error;

      navigation.navigate('BookingSuccess', {
        doctor: displayDoctor,
        selectedDay,
        selectedTime,
      });
    } catch (error) {
      showAlert('Payment Failed', error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Payment</Text>

          {/* Amount Display */}
          <View style={styles.amountContainer}>
            <Text style={styles.amount}>${displayDoctor.pricePerSession}</Text>
            <Text style={styles.amountLabel}>Session Fee</Text>
          </View>

          {/* Payment Method Selection */}
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          {paymentMethods.map((method) => (
            <Pressable
              key={method.id}
              style={[
                styles.methodRow,
                selectedMethod === method.id && styles.methodRowSelected,
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <Ionicons
                name={method.icon}
                size={22}
                color={selectedMethod === method.id ? colors.primary : colors.secondary}
              />
              <Text style={styles.methodLabel}>{method.label}</Text>
              <View
                style={[
                  styles.radio,
                  selectedMethod === method.id && styles.radioSelected,
                ]}
              >
                {selectedMethod === method.id && (
                  <View style={styles.radioDot} />
                )}
              </View>
            </Pressable>
          ))}

          {/* Card Details */}
          {selectedMethod === 'card' && (
            <View style={styles.cardDetails}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="**** **** **** 1234"
                placeholderTextColor={colors.grey}
                keyboardType="number-pad"
              />

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    placeholderTextColor={colors.grey}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="***"
                    placeholderTextColor={colors.grey}
                    keyboardType="number-pad"
                  />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Pay Button */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.payButton, loading && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.payButtonText}>Pay ${displayDoctor.pricePerSession} Now</Text>
            )}
          </Pressable>
        </View>
      </View>

      {/* Payment Error Alert */}
      <ShaafiAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        icon={alert.icon}
        iconColor={alert.iconColor}
        confirmText="OK"
        onConfirm={hideAlert}
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
  title: {
    ...typography.h2,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },
  amountContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  amount: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.primary,
  },
  amountLabel: {
    ...typography.bodySmall,
    color: colors.grey,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    ...typography.h3,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.lightGrey,
    gap: spacing.sm,
  },
  methodRowSelected: {
    borderColor: colors.primary,
  },
  methodLabel: {
    ...typography.body,
    color: colors.dark,
    flex: 1,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  cardDetails: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  inputLabel: {
    ...typography.label,
    color: colors.secondary,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.tertiary,
    height: 48,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    ...typography.body,
    color: colors.dark,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  buttonContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  payButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: {
    ...typography.button,
  },
});

export default PaymentScreen;