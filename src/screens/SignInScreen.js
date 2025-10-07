import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { commonStyles, COLORS } from '../components/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../FireBaseConfig'; // Confio que este caminho está correto como você confirmou

const STORAGE_KEY_USER = '@save_user';
const STORAGE_KEY_PASS = '@save_pass';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userPlaceholder, setUserPlaceholder] = useState('E-mail');
  const [passPlaceholder, setPassPlaceholder] = useState('Senha');

  // --- NOVO ESTADO ADICIONADO ---
  const [isLoading, setIsLoading] = useState(false); // Para mostrar feedback de carregamento

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedUser = await AsyncStorage.getItem(STORAGE_KEY_USER);
        const savedPass = await AsyncStorage.getItem(STORAGE_KEY_PASS);

        if (savedUser !== null && savedPass !== null) {
          setEmail(savedUser);
          setPassword(savedPass);
          setRememberMe(true);
        }
      } catch (e) {
        Alert.alert("Erro", "Não foi possível carregar os dados salvos.");
      }
    };
    loadCredentials();
  }, []);

  // --- FUNÇÃO DE LOGIN TOTALMENTE ATUALIZADA ---
  const handleSignIn = async () => {
    console.log("[LOGIN] 1. Função handleSignIn iniciada.");
    if (email === '' || password === '') {
      setErrorMessage('Por favor, preencha e-mail e senha.');
      return;
    }

    setIsLoading(true); // Inicia o carregamento
    setErrorMessage(''); // Limpa erros antigos

    try {
      console.log("[LOGIN] 2. Entrou no bloco TRY. Tentando autenticar com Firebase...");
      await signInWithEmailAndPassword(auth, email, password);
      
      console.log("[LOGIN] 3. SUCESSO! Autenticação no Firebase concluída.");

      if (rememberMe) {
        await AsyncStorage.setItem(STORAGE_KEY_USER, email);
        await AsyncStorage.setItem(STORAGE_KEY_PASS, password);
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY_USER);
        await AsyncStorage.removeItem(STORAGE_KEY_PASS);
      }
      
      console.log("[LOGIN] 4. Navegando para a tela 'Home'...");
      navigation.navigate('Home');

    } catch (error) {
      console.error("[LOGIN] 5. ERRO! Caiu no bloco CATCH. O erro completo é:", error);
      
      if (error.code === 'auth/invalid-credential') {
        setErrorMessage('Login/Senha Inválidos');
      } else if (error.code === 'auth/network-request-failed') {
        setErrorMessage('Erro de conexão. Verifique sua internet.');
      } else {
        setErrorMessage('Ocorreu um erro inesperado.');
        console.log(`[LOGIN] Código do erro não tratado: ${error.code}`);
      }
    } finally {
      // Este bloco SEMPRE será executado, não importa se deu certo ou errado
      console.log("[LOGIN] 6. Entrou no bloco FINALLY. Finalizando o processo.");
      setIsLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <View style={commonStyles.container}>
      <Image 
        source={require('../../assets/images/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color={COLORS.gray} style={styles.icon} />
        <TextInput
          placeholder={userPlaceholder}
          onFocus={() => setUserPlaceholder('')}
          onBlur={() => { if (!email) setUserPlaceholder('E-mail') }}
          style={styles.textInput}
          placeholderTextColor={COLORS.gray}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          cursorColor="black"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={styles.icon} />
        <TextInput
          placeholder={passPlaceholder}
          onFocus={() => setPassPlaceholder('')}
          onBlur={() => { if (!password) setPassPlaceholder('Senha') }}
          style={styles.textInput}
          secureTextEntry={!passwordVisible}
          placeholderTextColor={COLORS.gray}
          value={password}
          onChangeText={setPassword}
          cursorColor="black"
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </View>
      
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.rememberContainer} onPress={() => setRememberMe(!rememberMe)}>
          <Ionicons 
            name={rememberMe ? 'checkbox' : 'square-outline'} 
            size={20}
            color={rememberMe ? COLORS.darkBlue : COLORS.gray} 
          />
          <Text style={styles.rememberText}>Lembrar Senha</Text>
        </TouchableOpacity>
        
        <TouchableOpacity>
            <Text style={{color: COLORS.darkBlue, fontWeight: 'bold'}}>Esqueceu a Senha?</Text>
        </TouchableOpacity>
      </View>

      {/* --- BOTÃO ATUALIZADO --- */}
      <TouchableOpacity 
        style={[commonStyles.button, isLoading && styles.buttonDisabled]} // Estilo de desabilitado
        onPress={handleSignIn} 
        disabled={isLoading} // Desabilita o botão enquanto carrega
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" /> // Mostra um ícone de carregamento
        ) : (
          <Text style={commonStyles.buttonText}>OK</Text> // Mostra o texto normal
        )}
      </TouchableOpacity>
      
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>ou </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupLink}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- ESTILOS ATUALIZADOS ---
const styles = StyleSheet.create({
  logo: {
    width: 320,
    aspectRatio: 1 / 1.2,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
      flex: 1,
      height: 50,
      fontSize: 16,
  },
  optionsContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 25,
      paddingHorizontal: 5,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: 8,
    color: COLORS.text,
    fontSize: 13.5,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  signupText: {
    color: 'black',
    fontSize: 16,
  },
  signupLink: {
    color: '#6A5ACD',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  // --- NOVO ESTILO ADICIONADO ---
  buttonDisabled: {
    backgroundColor: '#999', // Cor do botão quando desabilitado
  },
});