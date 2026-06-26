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
import { useTheme } from '../context/ThemeContext';
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
  const { theme } = useTheme();
  const { user } = useAuth();
  const { doctor, selectedDay, selectedTime } = route.params;

  const displayDoctor = {
    ...doctor,
    pricePerSession: doctor.price_per_session || doctor.pricePerSession,
  };

  const [selectedMethod, setSelectedMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', icon: '', iconColor: '' });

  const showAlert = (title, message, icon = 'close-circle', iconColor = theme.danger) => {
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom']}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: theme.dark }]}>Payment</Text>

          <View style={styles.amountContainer}>
            <Text style={[styles.amount, { color: theme.primary }]}>${displayDoctor.pricePerSession}</Text>
            <Text style={[styles.amountLabel, { color: theme.grey }]}>Session Fee</Text>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.dark }]}>Select Payment Method</Text>
          {paymentMethods.map((method) => (
            <Pressable
              key={method.id}
              style={[
                styles.methodRow,
                { backgroundColor: theme.surface, borderColor: theme.border },
                selectedMethod === method.id && { borderColor: theme.primary },
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <Ionicons
                name={method.icon}
                size={22}
                color={selectedMethod === method.id ? theme.primary : theme.secondary}
              />
              <Text style={[styles.methodLabel, { color: theme.dark }]}>{method.label}</Text>
              <View
                style={[
                  styles.radio,
                  { borderColor: theme.border },
                  selectedMethod === method.id && { borderColor: theme.primary },
                ]}
              >
                {selectedMethod === method.id && (
                  <View style={[styles.radioDot, { backgroundColor: theme.primary }]} />
                )}
              </View>
            </Pressable>
          ))}

          {selectedMethod === 'card' && (
            <View style={styles.cardDetails}>
              <Text style={[styles.inputLabel, { color: theme.secondary }]}>Card Number</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, color: theme.dark }]}
                placeholder="**** **** **** 1234"
                placeholderTextColor={theme.grey}
                keyboardType="number-pad"
              />
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={[styles.inputLabel, { color: theme.secondary }]}>Expiry Date</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.inputBg, color: theme.dark }]}
                    placeholder="MM/YY"
                    placeholderTextColor={theme.grey}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={[styles.inputLabel, { color: theme.secondary }]}>CVV</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.inputBg, color: theme.dark }]}
                    placeholder="***"
                    placeholderTextColor={theme.grey}
                    keyboardType="number-pad"
                  />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.payButton, loading && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.payButtonText}>Pay ${displayDoctor.pricePerSession} Now</Text>
            )}
          </Pressable>
        </View>
      </View>

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
  },
  container: {
    flex: 1,
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
  },
  amountLabel: {
    ...typography.bodySmall,
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
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    gap: spacing.sm,
  },
  methodLabel: {
    ...typography.body,
    flex: 1,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  cardDetails: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  inputLabel: {
    ...typography.label,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    height: 48,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    ...typography.body,
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
    backgroundColor: '#2F80ED',
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