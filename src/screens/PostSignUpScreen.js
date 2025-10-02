import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { commonStyles, COLORS } from '../components/commonStyles';
import { Ionicons } from '@expo/vector-icons';


export default function PostSignUpScreen() {
    const { signIn, completeProfile } = useAuth();
    
    const handleCompleteProfile = () => {
        // Navegaria para um questionário aqui
        alert("Navegando para o questionário completo! (tela a ser criada)");
        completeProfile();
        signIn();
    }
    
  return (
    <View style={commonStyles.container}>
        <Ionicons name="person-add-sharp" size={100} color={COLORS.primary} />
        <Text style={[commonStyles.title, {marginTop: 20}]}>Usuário Cadastrado com Sucesso!</Text>
        <Text style={styles.subtitle}>Deseja Completar o Cadastro?</Text>

        <TouchableOpacity style={styles.buttonSim} onPress={handleCompleteProfile}>
            <Text style={commonStyles.buttonText}>SIM</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonNao} onPress={() => signIn()}>
            <Text style={styles.buttonTextNao}>AGORA NÃO</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    subtitle: {
        fontSize: 18,
        color: COLORS.text,
        marginBottom: 30,
        textAlign: 'center',
    },
    buttonSim: {
        ...commonStyles.button,
        width: '80%',
    },
    buttonNao: {
        ...commonStyles.button,
        width: '80%',
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    buttonTextNao: {
        ...commonStyles.buttonText,
        color: COLORS.primary,
    }
});