import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { commonStyles, COLORS } from '../components/commonStyles';
import { Ionicons } from '@expo/vector-icons';

export default function SignInScreen({ navigation }) {
  const { signIn } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={commonStyles.container}>
      <Image 
        source={require('../../assets/images/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      
      <TextInput
        placeholder="Usuário"
        style={commonStyles.input}
        placeholderTextColor={COLORS.gray}
      />
      
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Senha"
          style={styles.inputIcon}
          secureTextEntry={!passwordVisible}
          placeholderTextColor={COLORS.gray}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.optionsContainer}>
        <Text style={{color: COLORS.text}}>Lembrar Senha</Text>
        <TouchableOpacity>
           <Text style={{color: COLORS.darkBlue, fontWeight: 'bold'}}>Esqueceu a Senha?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={commonStyles.button} onPress={() => signIn()}>
        <Text style={commonStyles.buttonText}>Ok</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={commonStyles.linkText}>ou Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 250,
    height: 150,
    marginBottom: 40,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
      flex: 1,
      height: 50,
      fontSize: 16,
  },
  optionsContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      paddingHorizontal: 5,
  }
});