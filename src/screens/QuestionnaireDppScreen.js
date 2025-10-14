import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { commonStyles, COLORS } from '../components/commonStyles';
import { formatDateInput } from '../utils/formatDateInput';

export default function QuestionnaireDppScreen({ navigation }) {
    const [dppDate, setDppDate] = useState('');
    const { updateUserProfile } = useAuth(); // Removemos o signIn daqui

    const handleDateChange = (text) => {
        const formattedDate = formatDateInput(text);
        setDppDate(formattedDate);
    };

    const handleNext = () => { // Renomeado de handleFinish para handleNext
        if (dppDate.length === 10) {
            const parts = dppDate.split('/');
            const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
            
            updateUserProfile({ dppDate: isoDate });
            // Em vez de finalizar, navega para a próxima pergunta
            navigation.navigate('QuestionnaireFirstPregnancy');
        } else {
            Alert.alert('Atenção', 'Por favor, informe uma data válida no formato DD/MM/AAAA.');
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={commonStyles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Data provável do parto</Text>
                <TextInput
                    style={commonStyles.input}
                    placeholder="DD/MM/AAAA"
                    value={dppDate}
                    onChangeText={handleDateChange}
                    keyboardType="numeric"
                    maxLength={10}
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
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 30,
        textAlign: 'center',
    },
    button: {
        ...commonStyles.button,
        width: '100%',
        marginTop: 20,
    }
});

