import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
// import { useAuth } from '../context/AuthContext'; // Comentado por enquanto
import { commonStyles } from '../components/commonStyles';

// --- ADICIONADO AQUI ---
// Importe o 'auth' do seu arquivo de configuração e a função de criar usuário
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../FireBaseConfig'; // Verifique se o caminho está correto!

export default function SignUpScreen({ navigation }) {
  // const { signUp } = useAuth(); // Comentado por enquanto

  // --- ADICIONADO AQUI ---
  // Estados para guardar os dados dos inputs e a mensagem de erro
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // O campo "Usuário" (nome de exibição) pode ser salvo depois, no perfil do usuário.
  // O cadastro inicial do Firebase foca em e-mail e senha.

  // --- FUNÇÃO DE CADASTRO MODIFICADA ---
  const handleSignUp = async () => {
    // 1. Validação dos dados
    if (!email || !password || !confirmPassword) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    // 2. Lógica para criar o usuário no Firebase
    try {
      setErrorMessage(''); // Limpa erros antigos
      
      // Chama a função do Firebase para criar um novo usuário
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      console.log('Conta criada com sucesso!', userCredential.user);
      Alert.alert('Sucesso!', 'Sua conta foi criada.');

      // Navega para a próxima tela após o cadastro
      navigation.navigate('PostSignUp');

    } catch (error) {
      console.error("Erro ao criar conta:", error.code);

      // 3. Tratamento de erros comuns do Firebase
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Este e-mail já está cadastrado.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('A senha precisa ter no mínimo 6 caracteres.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('O formato do e-mail é inválido.');
      } else {
        setErrorMessage('Ocorreu um erro ao criar a conta.');
      }
    }
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Criar uma conta</Text>
      
      {/* Inputs conectados aos estados */}
      <TextInput 
        placeholder="E-mail" 
        style={commonStyles.input} 
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput 
        placeholder="Senha" 
        style={commonStyles.input} 
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
      />
      <TextInput 
        placeholder="Confirmar Senha" 
        style={commonStyles.input} 
        secureTextEntry 
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* --- ADICIONADO AQUI --- */}
      {/* Exibe a mensagem de erro na tela, se houver */}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity style={commonStyles.button} onPress={handleSignUp}>
        <Text style={commonStyles.buttonText}>OK</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={commonStyles.linkText}>Já tenho uma conta</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- ADICIONADO AQUI ---
// Estilo para o texto de erro
const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
    fontWeight: 'bold',
  }
});