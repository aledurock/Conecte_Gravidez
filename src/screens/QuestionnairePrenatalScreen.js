import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext'; // 👈 Importa o useAuth
import { commonStyles, COLORS } from '../components/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QuestionnairePrenatalScreen({ navigation }) {

    // --- MUDANÇA AQUI ---
    // Trocamos 'setUserToken' por 'completeOnboarding'
    const { updateUserProfile, completeOnboarding } = useAuth();

    const handleSelection = (hasConsultation) => {
        updateUserProfile({ hasPrenatalConsultation: hasConsultation });
        
        // --- MUDANÇA AQUI ---
        // Agora chamamos a função correta
        completeOnboarding(); 
    };

    const handleSkip = () => {
        // --- MUDANÇA AQUI ---
        // Agora chamamos a função correta
        completeOnboarding();
    };

    return (
        <SafeAreaView style={commonStyles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Você já realizou a primeira consulta de pré-natal?</Text>
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