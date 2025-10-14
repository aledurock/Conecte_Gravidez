import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext'; 
import { commonStyles, COLORS } from '../components/commonStyles';

export default function SignUpScreen({ navigation }) {
    // 1. ESTADO PARA O NOME REMOVIDO
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // A função signUp do contexto pode ser usada futuramente para o Firebase
    const { signUp } = useAuth(); 

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
            // Futuramente, esta linha fará o cadastro no Firebase
            // await signUp(email, password); 
            console.log('Simulando cadastro do usuário...');
            
            // 2. A CORREÇÃO PRINCIPAL: Navegar para a próxima tela
            // Após o cadastro, o app vai para a tela de decisão.
            navigation.navigate('PostSignUp');

        } catch (error) {
            Alert.alert("Erro no Cadastro", "Não foi possível criar a conta.");
            console.error(error);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={commonStyles.container}
        >
            <Text style={commonStyles.title}>Criar uma conta</Text>
            
            {/* 3. CAMPO DE INPUT DO NOME REMOVIDO DO VISUAL */}
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
        </KeyboardAvoidingView>
    );
}
