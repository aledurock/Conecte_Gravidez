import 'react-native-gesture-handler'; // Importante: deve ser a primeira linha
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// --- CORREÇÃO AQUI ---
// A linha 'import ./config.js' foi REMOVIDA
// pois não estamos mais usando o Firebase.


export default function App() {
  return (
    // O SafeAreaProvider deve ser o componente mais externo
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}