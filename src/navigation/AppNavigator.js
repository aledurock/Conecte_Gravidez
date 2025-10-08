// src/navigation/AppNavigator.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext'; // Importamos o nosso hook

// Importe suas telas
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import PostSignUpScreen from '../screens/PostSignUpScreen';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

// Grupo de telas de Autenticação
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="PostSignUp" component={PostSignUpScreen} />
  </Stack.Navigator>
);

// Grupo de telas Principais do App
const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    {/* Adicione outras telas do seu app aqui (Profile, Agenda, etc.) */}
  </Stack.Navigator>
);

export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  // Enquanto o app verifica se existe um usuário logado, mostramos um loading
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
      {/* A linha mágica acima: SE 'user' existe, mostra AppStack, SENÃO, mostra AuthStack */}
    </NavigationContainer>
  );
}