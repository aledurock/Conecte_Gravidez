import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { commonStyles, COLORS } from '../components/commonStyles';
import { Ionicons } from '@expo/vector-icons';

// Chaves para salvar os dados no armazenamento do celular
const STORAGE_KEY_USER = '@save_user';
const STORAGE_KEY_PASS = '@save_pass';

export default function SignInScreen({ navigation }) {
  const { signIn } = useAuth();

  // Estados para os inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // CORRIGIDO AQUI
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Efeito para carregar os dados salvos quando a tela abrir
  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedUser = await AsyncStorage.getItem(STORAGE_KEY_USER);
        const savedPass = await AsyncStorage.getItem(STORAGE_KEY_PASS);

        if (savedUser !== null && savedPass !== null) {
          setUsername(savedUser);
          setPassword(savedPass);
          setRememberMe(true);
        }
      } catch (e) {
        Alert.alert("Erro", "Não foi possível carregar os dados salvos.");
      }
    };
    loadCredentials();
  }, []);


  // Função de login
  const handleSignIn = async () => {
    if (rememberMe) {
      // Se "Lembrar Senha" estiver marcado, SALVE os dados
      try {
        await AsyncStorage.setItem(STORAGE_KEY_USER, username);
        await AsyncStorage.setItem(STORAGE_KEY_PASS, password);
      } catch (e) {
        Alert.alert("Erro", "Não foi possível salvar seus dados.");
      }
    } else {
      // Se NÃO estiver marcado, REMOVA os dados salvos
      try {
        await AsyncStorage.removeItem(STORAGE_KEY_USER);
        await AsyncStorage.removeItem(STORAGE_KEY_PASS);
      } catch (e) {
        Alert.alert("Erro", "Não foi possível remover os dados salvos.");
      }
    }
    // Chama a função de login do seu contexto
    signIn({ username, password });
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
          placeholder="Usuário"
          style={styles.textInput}
          placeholderTextColor={COLORS.gray}
          value={username}
          onChangeText={setUsername}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={styles.icon} />
        <TextInput
          placeholder="Senha"
          style={styles.textInput}
          secureTextEntry={!passwordVisible}
          placeholderTextColor={COLORS.gray}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.rememberContainer} onPress={() => setRememberMe(!rememberMe)}>
          <Ionicons 
            name={rememberMe ? 'checkbox' : 'square-outline'} 
            size={24} 
            color={rememberMe ? COLORS.darkBlue : COLORS.gray} 
          />
          <Text style={styles.rememberText}>Lembrar Senha</Text>
        </TouchableOpacity>
        
        <TouchableOpacity>
            <Text style={{color: COLORS.darkBlue, fontWeight: 'bold'}}>Esqueceu a Senha?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={commonStyles.button} onPress={handleSignIn}>
        <Text style={commonStyles.buttonText}>Ok</Text>
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

// ESTILOS (sem alterações)
const styles = StyleSheet.create({
  logo: {
    width: 320,
    aspectRatio: 1 / 1.2,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 12,
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
    fontSize: 14,
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
  }
});