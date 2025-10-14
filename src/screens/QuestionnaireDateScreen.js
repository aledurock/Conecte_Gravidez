import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { commonStyles, COLORS } from '../components/commonStyles';

export default function QuestionnaireDateScreen({ navigation }) {
    const { userProfile } = useAuth();

    const handleSelectDUM = () => {
        // CORREÇÃO: O nome da rota deve ser exatamente igual ao do AppNavigator
        navigation.navigate('QuestionnaireDumScreen');
    };

    const handleSelectDPP = () => {
        // CORREÇÃO: O nome da rota deve ser exatamente igual ao do AppNavigator
        navigation.navigate('QuestionnaireDppScreen');
    };

    const displayName = userProfile?.name || 'Futura mamãe';

    return (
        <SafeAreaView style={commonStyles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>
                    Olá {displayName}, para calcularmos suas semanas de gestação e a data provável do parto, precisamos de uma informação.
                </Text>
                <Text style={styles.subtitle}>Qual delas você tem?</Text>
                
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleSelectDUM}>
                        <Text style={styles.buttonText}>A data do primeiro dia da sua última menstruação (DUM)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleSelectDPP}>
                        <Text style={styles.buttonText}>Já sei a data provável do parto (DPP) informada pelo meu médico</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 18,
        color: COLORS.primary,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 26,
    },
    subtitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.secondary || '#FF6347',
        marginBottom: 30,
    },
    buttonContainer: {
        width: '100%',
    },
    button: {
        ...commonStyles.button,
        height: 'auto',
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    buttonText: {
        ...commonStyles.buttonText,
        textAlign: 'center',
        lineHeight: 22,
    }
});

