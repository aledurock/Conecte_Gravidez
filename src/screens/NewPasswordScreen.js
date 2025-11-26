import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles, COLORS } from '../components/commonStyles';

export default function NewPasswordScreen({ navigation }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    if (newPassword.length !== 6) {
      Alert.alert('Erro', 'A senha deve conter exatamente 6 números.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    navigation.replace('PasswordChangedSuccess');
  };

  return (
    <View style={commonStyles.container}>
      <Text style={[commonStyles.title, { marginBottom: 10 }]}>Criar Nova Senha</Text>
      <Text style={styles.subText}>
        Crie uma nova senha numérica de 6 dígitos.
      </Text>

      {/* NOVA SENHA */}
      <View style={commonStyles.inputWithIconContainer}>
        <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Nova Senha (6 números)"
          style={commonStyles.inputInside}
          secureTextEntry={secureText}
          value={newPassword}
          onChangeText={setNewPassword}
          keyboardType="numeric"
          maxLength={6}
          placeholderTextColor={COLORS.gray}
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
           <Ionicons name={secureText ? 'eye-off' : 'eye'} size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      {/* CONFIRMAR SENHA */}
      <View style={commonStyles.inputWithIconContainer}>
        <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Confirme Nova Senha"
          style={commonStyles.inputInside}
          secureTextEntry={secureText}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          keyboardType="numeric"
          maxLength={6}
          placeholderTextColor={COLORS.gray}
        />
      </View>

      <TouchableOpacity style={commonStyles.button} onPress={handleResetPassword}>
        <Text style={commonStyles.buttonText}>Redefinir Senha</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  subText: {
    color: COLORS.gray,
    marginBottom: 30,
    textAlign: 'center',
    fontSize: 15
  }
});