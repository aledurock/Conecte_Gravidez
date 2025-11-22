import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { commonStyles, COLORS } from '../components/commonStyles';
// 1. Importa a função de formatação do arquivo que a define
import { formatUserName } from '../utils/formatName';

export default function QuestionnaireNameScreen({ navigation }) {
    const [name, setName] = useState('');
    const { updateUserProfile } = useAuth();

    const handleNext = () => {
        if (name.trim().length > 1) {
            // 2. Formata o nome usando a função importada
            const formattedName = formatUserName(name);
            
            // 3. Salva o nome JÁ FORMATADO no contexto global do app
            updateUserProfile({ name: formattedName });
            
            // 4. Navega para a próxima tela do questionário
            navigation.navigate('QuestionnaireDate');

        } else {
            Alert.alert('Atenção', 'Por favor, informe o seu nome.');
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={commonStyles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Qual é o seu nome?</Text>
                <TextInput
                    style={commonStyles.input}
                    placeholder="Informe o seu nome"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                />
                <TouchableOpacity style={styles.button} onPress={handleNext}>
                    <Text style={commonStyles.buttonText}>PRÓXIMO</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    content: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 30,
    },
    button: {
        ...commonStyles.button,
        width: '100%',
        marginTop: 20,
    }
});