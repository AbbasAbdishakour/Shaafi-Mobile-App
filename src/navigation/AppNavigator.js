// src/navigation/AppNavigator.js
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import TabNavigator from './TabNavigator';
import DoctorTabNavigator from './DoctorTabNavigator';
import DoctorProfileScreen from '../screens/patient/DoctorProfileScreen';
import BookingScreen from '../screens/patient/BookingScreen';
import ConfirmBookingScreen from '../screens/patient/ConfirmBookingScreen';
import PaymentScreen from '../screens/patient/PaymentScreen';
import BookingSuccessScreen from '../screens/patient/BookingSuccessScreen';
import LoginScreen from '../auth/LoginScreen';
import RegisterScreen from '../auth/RegisterScreen';
import DoctorLoginScreen from '../auth/DoctorLoginScreen';
import DoctorRegisterScreen from '../screens/doctor/DoctorRegisterScreen';
import DoctorPendingScreen from '../screens/doctor/DoctorPendingScreen';
import DoctorApprovedScreen from '../screens/doctor/DoctorApprovedScreen';
import DoctorRejectedScreen from '../screens/doctor/DoctorRejectedScreen';
import DoctorRevokedScreen from '../screens/doctor/DoctorRevokedScreen';
import DoctorProfileEditScreen from '../screens/doctor/DoctorProfileEditScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, loading, isDoctor } = useAuth();
  const [doctorStatus, setDoctorStatus] = useState(null);

  useEffect(() => {
    if (user && isDoctor()) {
      checkDoctorStatus();
    } else {
      setDoctorStatus(null);
    }
  }, [user]);

  const checkDoctorStatus = async () => {
    const { data } = await supabase
      .from('doctors')
      .select('status')
      .eq('user_id', user.id)
      .single();
    setDoctorStatus(data?.status || 'pending');
  };

  if (loading || (user && isDoctor() && doctorStatus === null)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const getDoctorScreen = () => {
    switch (doctorStatus) {
      case 'approved':
        return (
          <>
            <Stack.Screen name="DoctorApproved" component={DoctorApprovedScreen} options={{ headerShown: false }} />
            <Stack.Screen name="DoctorTabs" component={DoctorTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="DoctorProfileEdit" component={DoctorProfileEditScreen} options={{ title: 'Edit Profile' }} />
          </>
        );
      case 'rejected':
        return <Stack.Screen name="DoctorRejected" component={DoctorRejectedScreen} options={{ headerShown: false }} />;
      case 'revoked':
        return <Stack.Screen name="DoctorRevoked" component={DoctorRevokedScreen} options={{ headerShown: false }} />;
      default:
        return <Stack.Screen name="DoctorPending" component={DoctorPendingScreen} options={{ headerShown: false }} />;
    }
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.tertiary },
        headerTintColor: colors.primary,
        headerTitleStyle: { ...typography.h3 },
        headerShadowVisible: false,
        animation: 'slide_from_right',
        animationDuration: 350,
        gestureEnabled: true,
      }}
    >
      {user ? (
        isDoctor() ? (
          getDoctorScreen()
        ) : (
          <>
            <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} options={{ title: 'Doctor Profile' }} />
            <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Book Appointment' }} />
            <Stack.Screen name="ConfirmBooking" component={ConfirmBookingScreen} options={{ title: 'Confirm' }} />
            <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Payment' }} />
            <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} options={{ headerShown: false, animation: 'slide_from_bottom', animationDuration: 450, gestureEnabled: false }} />
          </>
        )
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DoctorLogin" component={DoctorLoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DoctorRegister" component={DoctorRegisterScreen} options={{ title: 'Doctor Registration' }} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;