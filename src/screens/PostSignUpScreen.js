import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { commonStyles, COLORS } from '../components/commonStyles';
import { Ionicons } from '@expo/vector-icons';

export default function PostSignUpScreen({ navigation }) { 
    // Pegue a função signIn do seu contexto
    const { signIn } = useAuth();
    
    const handleCompleteProfile = () => {
        // Isso está perfeito, navega para o questionário
        navigation.navigate('QuestionnaireName');
    }
    
    return (
        <View style={commonStyles.container}>
            <Ionicons name="person-add-sharp" size={100} color={COLORS.primary} />
            <Text style={[commonStyles.title, {marginTop: 20}]}>Usuário Cadastrado com Sucesso!</Text>
            <Text style={styles.subtitle}>Deseja Completar o Cadastro?</Text>

            <TouchableOpacity style={styles.buttonSim} onPress={handleCompleteProfile}>
                <Text style={commonStyles.buttonText}>SIM</Text>
            </TouchableOpacity>

            {/* AQUI ESTÁ A CORREÇÃO PRINCIPAL */}
            {/* Ao clicar, ele chama signIn(), que define o userToken e leva para MainApp */}
            <TouchableOpacity style={styles.buttonNao} onPress={signIn}>
                <Text style={styles.buttonTextNao}>AGORA NÃO</Text>
            </TouchableOpacity>
        </View>
    );
}

// Seus estilos (adicione os que faltam se precisar)
const styles = StyleSheet.create({
    subtitle: {
        fontSize: 18,
        color: COLORS.text,
        marginBottom: 30,
        textAlign: 'center',
    },
    buttonSim: {
        ...commonStyles.button,
        width: '80%', // Ajuste conforme seu design
    },
    buttonNao: {
        ...commonStyles.button,
        width: '80%', // Ajuste conforme seu design
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    buttonTextNao: {
        ...commonStyles.buttonText,
        color: COLORS.primary,
    }
});