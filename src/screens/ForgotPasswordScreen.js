import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles, COLORS } from '../components/commonStyles';
import { generateVerificationCode } from '../constants/authUtils'; 

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [timer, setTimer] = useState(null);
  
  // Usamos useRef para a animação de deslize (Slide)
  // Começa em -200 (fora da tela, lá em cima)
  const slideAnim = useRef(new Animated.Value(-200)).current;

  const handleSendCode = () => {
    if (!email) {
      Alert.alert('Atenção', 'Por favor, digite seu e-mail.');
      return;
    }
    const code = generateVerificationCode();
    setGeneratedCode(code);
    setIsCodeSent(true);
    setInputCode('');
    
    // 1. Ativa a renderização do balão
    setShowNotification(true);

    // 2. Animação: Desliza de cima (-200) para a posição final (10)
    Animated.spring(slideAnim, {
      toValue: 10, // Posição final (margem do topo)
      speed: 12,
      bounciness: 8, // Um leve efeito de "pulo" ao chegar
      useNativeDriver: true
    }).start();

    // 3. Temporizador para sumir
    if (timer) clearTimeout(timer);
    const newTimer = setTimeout(() => {
        // Animação de saída: Sobe de volta para -200
        Animated.timing(slideAnim, {
            toValue: -200,
            duration: 500,
            useNativeDriver: true
        }).start(() => setShowNotification(false));
    }, 6000);
    setTimer(newTimer);
  };

  const handleVerifyCode = () => {
    const cleanInput = inputCode.trim();
    const cleanGenerated = generatedCode.toString().trim();

    if (cleanInput === cleanGenerated) {
      navigation.replace('NewPassword'); 
    } else {
      Alert.alert('Erro', 'Código incorreto. Verifique se digitou os 6 números corretamente.');
    }
  };

  useEffect(() => {
    return () => { if (timer) clearTimeout(timer); };
  }, [timer]);

  return (
    <View style={commonStyles.container}>
      
      {/* BALÃO DE NOTIFICAÇÃO ANIMADO */}
      {showNotification && (
        <Animated.View 
          style={[
            styles.notificationBubble, 
            { transform: [{ translateY: slideAnim }] } // Aplica a animação de movimento
          ]}
        >
          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <Ionicons name="notifications" size={20} color={COLORS.white} />
              <Text style={styles.notificationTitle}>Nova Mensagem</Text>
            </View>
            <Text style={styles.notificationText}>Seu código de verificação é:</Text>
            <Text style={styles.notificationCode}>{generatedCode}</Text>
            <Text style={styles.notificationTimer}>Desaparece em 6s...</Text>
          </View>
        </Animated.View>
      )}

      <Text style={[commonStyles.title, { marginBottom: 10 }]}>Recuperar Senha</Text>
      <Text style={styles.subText}>Informe o e-mail cadastrado para receber o código.</Text>

      {/* INPUT EMAIL */}
      <View style={commonStyles.inputWithIconContainer}>
        <Ionicons name="mail-outline" size={20} color={COLORS.gray} style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Seu e-mail"
          style={commonStyles.inputInside}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={COLORS.gray}
        />
      </View>

      <TouchableOpacity style={commonStyles.button} onPress={handleSendCode}>
        <Text style={commonStyles.buttonText}>{isCodeSent ? 'Reenviar Código' : 'Enviar Código'}</Text>
      </TouchableOpacity>

      {/* INPUT CÓDIGO */}
      {isCodeSent && (
        <View style={{ width: '100%', marginTop: 25 }}>
            <Text style={styles.subText}>Digite o código recebido:</Text>
            <View style={commonStyles.inputWithIconContainer}>
                <Ionicons name="key-outline" size={20} color={COLORS.gray} style={{ marginRight: 10 }} />
                <TextInput
                placeholder="000000"
                style={[commonStyles.inputInside, { fontSize: 20, letterSpacing: 3 }]}
                value={inputCode}
                onChangeText={setInputCode}
                keyboardType="numeric"
                maxLength={6}
                placeholderTextColor={COLORS.gray}
                />
            </View>
            <TouchableOpacity 
                style={[commonStyles.button, { backgroundColor: COLORS.secondary }]} 
                onPress={handleVerifyCode}
            >
                <Text style={commonStyles.buttonText}>Verificar</Text>
            </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
        <Text style={{ color: COLORS.gray }}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  subText: {
    color: COLORS.gray,
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 15
  },
  // ESTILOS ATUALIZADOS DO BALÃO
  notificationBubble: {
    position: 'absolute',
    top: 0, // Posiciona no topo relativo (será ajustado pelo translateY)
    alignSelf: 'center', // Centraliza horizontalmente
    width: '90%',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 15,
    zIndex: 9999, // Garante que fique na frente de tudo
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  notificationContent: { alignItems: 'center' },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    opacity: 0.9
  },
  notificationTitle: { 
    color: COLORS.white, 
    fontWeight: '600', 
    marginLeft: 8,
    fontSize: 14
  },
  notificationText: { color: '#CCC', fontSize: 13, marginTop: 2 },
  notificationCode: { 
    color: COLORS.success, // Usa a cor verde definida no commonStyles
    fontSize: 36, 
    fontWeight: 'bold', 
    marginVertical: 8,
    letterSpacing: 2
  },
  notificationTimer: { color: '#888', fontSize: 11, fontStyle: 'italic' }
});