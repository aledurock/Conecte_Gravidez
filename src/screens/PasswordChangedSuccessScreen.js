import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles, COLORS } from '../components/commonStyles';

export default function PasswordChangedSuccessScreen({ navigation }) {
  
  const handleOk = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
  };

  return (
    <View style={commonStyles.container}>
      <View style={{ alignItems: 'center', width: '100%' }}>
        
        {}
        <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />
        
        <Text style={[commonStyles.title, { marginTop: 20, marginBottom: 10 }]}>
          Senha Atualizada!
        </Text>
        
        <Text style={styles.subText}>
          Sua nova senha foi definida com sucesso.{'\n'}Faça login para continuar.
        </Text>

        {}
        <TouchableOpacity 
          style={[commonStyles.button, { backgroundColor: COLORS.success, marginTop: 30 }]} 
          onPress={handleOk}
        >
          <Text style={commonStyles.buttonText}>Ir para Login</Text>
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