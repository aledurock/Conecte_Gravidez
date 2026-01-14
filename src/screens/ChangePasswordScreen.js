import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles, COLORS } from '../components/commonStyles';

export default function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (currentPassword.length !== 6) {
       Alert.alert('Erro', 'A senha atual parece incorreta (deve ter 6 dígitos).');
       return;
    }

    if (newPassword.length !== 6) {
      Alert.alert('Erro', 'A nova senha deve conter exatamente 6 números.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'A nova senha e a confirmação não coincidem.');
      return;
    }

    if (currentPassword === newPassword) {
        Alert.alert('Atenção', 'A nova senha não pode ser igual à atual.');
        return;
    }

    // --- MUDANÇA AQUI ---
    // Substitui a tela atual (Alterar Senha) pela tela de Sucesso.
    // Assim, quando o usuário clicar em "Continuar" na próxima tela, ele volta para o Perfil.
    navigation.replace('PasswordChangeDone');
  };

  return (
    <View style={commonStyles.container}>
      
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <View style={styles.iconCircle}>
            <Ionicons name="key" size={40} color={COLORS.primary} />
        </View>
      </View>

      <Text style={[commonStyles.title, { marginBottom: 10, fontSize: 24 }]}>Alterar Senha</Text>
      <Text style={styles.subText}>
        Para sua segurança, confirme sua senha atual antes de criar uma nova.
      </Text>

      {}
      <Text style={styles.label}>Senha Atual</Text>
      <View style={commonStyles.inputWithIconContainer}>
        <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Digite sua senha atual"
          style={commonStyles.inputInside}
          secureTextEntry={!showCurrent}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          keyboardType="numeric"
          maxLength={6}
          placeholderTextColor={COLORS.gray}
        />
        <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
           <Ionicons name={showCurrent ? 'eye-off' : 'eye'} size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      {}
      <Text style={styles.label}>Nova Senha</Text>
      <View style={commonStyles.inputWithIconContainer}>
        <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Nova senha (6 números)"
          style={commonStyles.inputInside}
          secureTextEntry={!showNew}
          value={newPassword}
          onChangeText={setNewPassword}
          keyboardType="numeric"
          maxLength={6}
          placeholderTextColor={COLORS.gray}
        />
        <TouchableOpacity onPress={() => setShowNew(!showNew)}>
           <Ionicons name={showNew ? 'eye-off' : 'eye'} size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      {}
      <Text style={styles.label}>Confirmar Nova Senha</Text>
      <View style={commonStyles.inputWithIconContainer}>
        <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Repita a nova senha"
          style={commonStyles.inputInside}
          secureTextEntry={!showConfirm}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          keyboardType="numeric"
          maxLength={6}
          placeholderTextColor={COLORS.gray}
        />
        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
           <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={commonStyles.button} onPress={handleChangePassword}>
        <Text style={commonStyles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  subText: {
    color: COLORS.gray,
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 14,
    paddingHorizontal: 10
  },
  label: {
      alignSelf: 'flex-start',
      marginBottom: 5,
      color: COLORS.text,
      fontWeight: '600',
      marginLeft: 2
  },
  iconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#E6F0F8',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10
  }
});