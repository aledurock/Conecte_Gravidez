import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { commonStyles, COLORS } from '../components/commonStyles';

export default function SignUpScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return;
        }
        if (email.trim() === '' || password.trim() === '') {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }
        try {
            console.log('Usuário cadastrado com sucesso (simulado).');
            // --- MUDANÇA PRINCIPAL AQUI ---
            // Navega diretamente para a primeira pergunta do questionário.
            navigation.navigate('QuestionnaireName');
        } catch (error) {
            Alert.alert("Erro no Cadastro", "Não foi possível criar a conta.");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    overScrollMode="always"
                >
                    <View style={commonStyles.container}>
                        <Text style={commonStyles.title}>Criar uma conta</Text>
                        <TextInput
                            style={commonStyles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={commonStyles.input}
                            placeholder="Senha"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <TextInput
                            style={commonStyles.input}
                            placeholder="Confirmar Senha"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                        <TouchableOpacity style={commonStyles.button} onPress={handleSignUp}>
                            <Text style={commonStyles.buttonText}>Ok</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                            <Text style={commonStyles.linkText}>Já tenho uma conta</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
});

