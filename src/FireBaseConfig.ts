// src/FireBaseConfig.ts

import { initializeApp } from "firebase/app";
// 1. As importações corretas para React Native
import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Suas chaves do Firebase (estão corretas)
const firebaseConfig = {
  apiKey: "AIzaSyDdu-qsdhLNx8rn3YubCC_phSCr05Amtsc",
  authDomain: "conecte-gravidez.firebaseapp.com",
  projectId: "conecte-gravidez",
  storageBucket: "conecte-gravidez.appspot.com", // Corrigi o nome do storageBucket que estava diferente
  messagingSenderId: "517923423605",
  appId: "1:517923423605:web:ec736a6536a07691d1ff3c"
};

// Inicializa o Firebase App
export const app = initializeApp(firebaseConfig);

// 2. A forma correta de inicializar a autenticação para React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});