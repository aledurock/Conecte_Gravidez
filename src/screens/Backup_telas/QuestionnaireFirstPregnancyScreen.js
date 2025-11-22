import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { commonStyles, COLORS } from '../components/commonStyles';

export default function QuestionnaireFirstPregnancyScreen({ navigation }) {
    const { updateUserProfile } = useAuth(); // Removemos o signIn daqui

    // Função para salvar a resposta e ir para a próxima tela
    const handleSelection = (isFirst) => {
        updateUserProfile({ isFirstPregnancy: isFirst });
        navigation.navigate('QuestionnairePrenatal'); // Navega para a próxima pergunta
    };

    // O botão PULAR navega sem salvar a informação
    const handleSkip = () => {
        navigation.navigate('QuestionnairePrenatal');
    };

    return (
        <SafeAreaView style={commonStyles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Esta é sua primeira gestação?</Text>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.button, styles.buttonOption]} onPress={() => handleSelection(false)}>
                        <Text style={commonStyles.buttonText}>NÃO</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.buttonOption]} onPress={() => handleSelection(true)}>
                        <Text style={commonStyles.buttonText}>SIM</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={[styles.button, styles.skipButton]} onPress={handleSkip}>
                    <Text style={styles.skipButtonText}>PULAR</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
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
        marginBottom: 40,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    button: {
        ...commonStyles.button,
    },
    buttonOption: {
        width: '48%',
    },
    skipButton: {
        width: '100%',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    skipButtonText: {
        ...commonStyles.buttonText,
        color: COLORS.primary,
    }
});

