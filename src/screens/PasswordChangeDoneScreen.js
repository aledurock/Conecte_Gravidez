import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles, COLORS } from '../components/commonStyles';

export default function PasswordChangeDoneScreen({ navigation }) {
  
  const handleOk = () => {
    // Volta para a tela anterior na pilha (que deve ser o Perfil, 
    // já que usamos .replace na tela anterior)
    navigation.goBack();
  };

  return (
    <View style={commonStyles.container}>
      <View style={{ alignItems: 'center', width: '100%' }}>
        
        {}
        <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />
        
        <Text style={[commonStyles.title, { marginTop: 20, marginBottom: 10 }]}>
          Senha Alterada!
        </Text>
        
        <Text style={styles.subText}>
          Sua senha de acesso foi atualizada com sucesso.
        </Text>

        {}
        <TouchableOpacity 
          style={[commonStyles.button, { backgroundColor: COLORS.success, marginTop: 30 }]} 
          onPress={handleOk}
        >
          <Text style={commonStyles.buttonText}>Continuar</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} style={{marginLeft: 10}} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  subText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24
  }
});