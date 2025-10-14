import 'react-native-gesture-handler'; // Importante: deve ser a primeira linha
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

// Opcional: Se você estiver usando Firebase, as inicializações ficam aqui.
// import { initializeApp } from 'firebase/app';
// import { firebaseConfig } from './config.js';
// initializeApp(firebaseConfig);

export default function App() {
  return (
    // 1. O AuthProvider deve "envelopar" tudo. Está correto.
    <AuthProvider>
      {/* 2. O NavigationContainer também deve "envelopar" o navegador. */}
      <NavigationContainer>
        <StatusBar style="auto" />
        {/* 3. O AppNavigator é o componente que gerencia todas as telas. */}
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
