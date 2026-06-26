// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';

const AppContent = () => {
  const { theme } = useTheme();
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleOnboardingDone = () => {
    setShowOnboarding(false);
  };

  return (
    <>
      <StatusBar style={theme.statusBar} />
      {showOnboarding ? (
        <NavigationContainer>
          <OnboardingScreen onFinish={handleOnboardingDone} />
        </NavigationContainer>
      ) : (
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      )}
    </>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}