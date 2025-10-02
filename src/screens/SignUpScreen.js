import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { commonStyles, COLORS } from '../components/commonStyles';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen({ navigation }) {
  const { signUp } = useAuth();

  const handleSignUp = () => {
    if(signUp()) {
        navigation.navigate('PostSignUp');
    }
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Criar uma conta</Text>
      
      <TextInput placeholder="Usuário" style={commonStyles.input} />
      <TextInput placeholder="E-mail" style={commonStyles.input} keyboardType="email-address"/>
      <TextInput placeholder="Senha" style={commonStyles.input} secureTextEntry />
      <TextInput placeholder="Confirmar Senha" style={commonStyles.input} secureTextEntry />

      <TouchableOpacity style={commonStyles.button} onPress={handleSignUp}>
        <Text style={commonStyles.buttonText}>Ok</Text>
      </TouchableOpacity>

       <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={commonStyles.linkText}>Já tenho uma conta</Text>
      </TouchableOpacity>
    </View>
  );
}