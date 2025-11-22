import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// --- IMPORTS ---
import { COLORS } from '../components/commonStyles';
import { useAuth } from '../context/AuthContext';
import { formatDateInput } from '../utils/formatDateInput';
import { formatUserName } from '../utils/formatName'; 
import { calculateGestationDetails } from '../utils/gestationCalculator';

// --- CONSTANTES DO CALENDÁRIO ---
const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const dayNames = ["D", "S", "T", "Q", "Q", "S", "S"];

const RegistrationChatScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  
  // IMPORTANTE: Pegamos a função signIn para logar o usuário no final
  const { signUp, signIn } = useAuth(); 
  
  // --- ESTADOS ---
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    hasDpp: null,
    dateValue: '',
    firstPregnancy: null,
    startedPrenatal: null,
    calculatedGestation: null 
  });
  
  const [isTyping, setIsTyping] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); 
  
  // Estado para mostrar os requisitos da senha (Toggle)
  const [showPasswordReqs, setShowPasswordReqs] = useState(false);

  // Estados do Calendário
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());
  const [showYearPicker, setShowYearPicker] = useState(false);

  // Animação
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // --- CONFIGURAÇÃO DOS PASSOS ---
  const STEPS = [
    {
      id: 'name',
      botText: 'Olá! Sou o Theo, seu assistente virtual. Para começarmos, como você gostaria de ser chamada?',
      type: 'text',
      placeholder: 'Digite seu nome',
      icon: 'person-outline',
      buttonLabel: 'Enviar Nome'
    },
    {
      id: 'email',
      botText: (data) => `Prazer, ${data.name}! Agora, digite seu melhor e-mail para acessarmos a conta.`,
      type: 'email-address',
      placeholder: 'exemplo@email.com',
      icon: 'mail-outline',
      buttonLabel: 'Salvar E-mail'
    },
    {
      id: 'password',
      botText: 'Agora precisamos de segurança. Crie uma senha numérica para entrar no aplicativo.',
      type: 'double-password',
      icon: 'lock-closed-outline',
      buttonLabel: 'Definir Senha'
    },
    {
      id: 'dpp_question',
      botText: 'Sobre a gestação: O médico já te informou a Data Provável do Parto (DPP)?',
      type: 'boolean',
      yesLabel: 'Sim, eu sei a data',
      noLabel: 'Não, ainda não sei'
    },
    {
      id: 'date_input',
      botText: (data) => data.hasDpp 
        ? 'Ótimo! Qual é a Data Provável do Parto (DPP) que o médico informou?' 
        : 'Sem problemas. Qual foi o dia da sua Última Menstruação (DUM)?',
      type: 'date',
      placeholder: 'DD/MM/AAAA',
      icon: 'calendar-outline',
      buttonLabel: 'Confirmar Data'
    },
    {
      id: 'first_pregnancy',
      botText: 'Essa é a sua primeira gestação?',
      type: 'boolean',
      yesLabel: 'Sim, é a primeira',
      noLabel: 'Não, já estive grávida'
    },
    {
      id: 'prenatal',
      botText: 'Você já realizou a primeira consulta do pré-natal?',
      type: 'boolean',
      yesLabel: 'Sim, já iniciei',
      noLabel: 'Ainda não'
    },
    {
      id: 'finish',
      botText: 'Perfeito! Estou analisando seus dados e finalizando seu cadastro...',
      type: 'loading'
    }
  ];

  const currentStep = STEPS[currentStepIndex];

  // --- LÓGICA DE TRANSIÇÃO ---
  const goToNextStep = () => {
    Keyboard.dismiss();
    setIsTyping(true);
    setShowPasswordReqs(false); // Fecha a dica de senha ao avançar
    
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setCurrentStepIndex(prev => prev + 1);
      
      setTimeout(() => {
        setIsTyping(false);
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
        
        if (currentStepIndex + 1 === STEPS.length - 1) {
          finishRegistration();
        }
      }, 600);
    });
  };

  const goToPreviousStep = () => {
    Keyboard.dismiss();
    if (currentStepIndex > 0) {
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setCurrentStepIndex(prev => prev - 1);
        setTimeout(() => {
          Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
        }, 100);
      });
    } else {
      navigation.goBack();
    }
  };

  // --- HANDLERS E VALIDAÇÕES ---
  const handleAnswer = (key, value) => {
    // Se for senha, garantir que só aceite números
    if (key === 'password' || key === 'confirmPassword') {
        // Remove tudo que não for número
        const numericValue = value.replace(/[^0-9]/g, '');
        setAnswers(prev => ({ ...prev, [key]: numericValue }));
    } else {
        setAnswers(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleNext = () => {
    if (currentStep.id === 'name') {
      if (answers.name.trim().length < 2) return Alert.alert('Atenção', 'Digite um nome válido.');
      const formatted = formatUserName(answers.name);
      handleAnswer('name', formatted);
      setAnswers(prev => ({ ...prev, name: formatted })); 
    }

    if (currentStep.id === 'email') {
      // Apenas verifica se tem @
      if (!answers.email.includes('@')) return Alert.alert('E-mail Inválido', 'Por favor, verifique o e-mail digitado.');
    }
    
    if (currentStep.id === 'password') {
      // Validação Estrita: Apenas números e exatamente 6 dígitos
      const isNumeric = /^\d+$/.test(answers.password);
      
      if (!isNumeric || answers.password.length !== 6) {
          return Alert.alert('Senha Inválida', 'A senha deve conter exatamente 6 números.');
      }
      
      if (answers.password !== answers.confirmPassword) {
          return Alert.alert('Atenção', 'As senhas não coincidem.');
      }
    }

    if (currentStep.id === 'date_input') {
      if (answers.dateValue.length < 10) return Alert.alert('Data Inválida', 'Preencha a data completa DD/MM/AAAA');
      const [day, month, year] = answers.dateValue.split('/').map(Number);
      if (month < 1 || month > 12 || day < 1 || day > 31) {
         return Alert.alert('Data Inválida', 'Essa data não existe.');
      }
    }

    goToNextStep();
  };

  const handleBoolean = (value) => {
    if (currentStep.id === 'dpp_question') setAnswers(prev => ({ ...prev, hasDpp: value }));
    else if (currentStep.id === 'first_pregnancy') setAnswers(prev => ({ ...prev, firstPregnancy: value }));
    else if (currentStep.id === 'prenatal') setAnswers(prev => ({ ...prev, startedPrenatal: value }));
    goToNextStep();
  };

  // --- LÓGICA DO CALENDÁRIO ---
  const generateCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) { calendarDays.push({ key: `blank-${i}`, day: '' }); }
    for (let i = 1; i <= daysInMonth; i++) { calendarDays.push({ key: `day-${i}`, day: i }); }
    return calendarDays;
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 50; i <= currentYear + 2; i++) { years.push(i); }
    return years.reverse(); 
  };

  const handleYearSelect = (year) => {
    setPickerDate(new Date(year, pickerDate.getMonth(), 1));
    setShowYearPicker(false);
  };

  const changePickerMonth = (amount) => {
    setPickerDate(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));
  };

  const handleDaySelect = (day) => {
    const dayStr = day.toString().padStart(2, '0');
    const monthStr = (pickerDate.getMonth() + 1).toString().padStart(2, '0');
    const yearStr = pickerDate.getFullYear();
    const formatted = `${dayStr}/${monthStr}/${yearStr}`;
    
    handleAnswer('dateValue', formatted);
    setCalendarVisible(false);
  };

  // --- FINALIZAÇÃO ---
  const finishRegistration = async () => {
    try {
      let formattedDate = null;
      if (answers.dateValue && answers.dateValue.includes('/')) {
          const [day, month, year] = answers.dateValue.split('/');
          formattedDate = `${year}-${month}-${day}`;
      } else {
          formattedDate = new Date().toISOString().split('T')[0];
      }

      const profileData = {
        dumDate: !answers.hasDpp ? formattedDate : null,
        dppDate: answers.hasDpp ? formattedDate : null
      };

      const gestationDetails = calculateGestationDetails(profileData);
      
      const finalUserData = {
        name: answers.name,
        email: answers.email,
        password: answers.password,
        firstPregnancy: answers.firstPregnancy,
        startedPrenatal: answers.startedPrenatal,
        ...profileData,
        ...gestationDetails 
      };

      await signUp(finalUserData);
      setTimeout(() => {
        setIsRegistered(true);
      }, 1500);

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível finalizar o cadastro.');
      setCurrentStepIndex(prev => prev - 1); 
    }
  };

  const handleGoToHome = async () => {
    try {
        await signIn({ email: answers.email, password: answers.password });
    } catch (error) {
        console.log("Erro no login automático:", error);
        Alert.alert("Erro", "Faça login manualmente.");
        navigation.navigate('SignIn'); 
    }
  };

  // --- TELA DE SUCESSO ---
  if (isRegistered) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successCard}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
          <Text style={styles.successTitle}>Cadastramento Concluído!</Text>
          <Text style={styles.successSubtitle}>Tudo pronto para você usar o app.</Text>
          <TouchableOpacity style={styles.successButton} onPress={handleGoToHome}>
            <Text style={styles.successButtonText}>Ir para tela inicial</Text>
            <Ionicons name="arrow-forward" size={20} color="white" style={{marginLeft: 10}} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- RENDERIZADORES ---
  const renderBotText = () => {
    if (typeof currentStep.botText === 'function') {
      return currentStep.botText(answers);
    }
    return currentStep.botText;
  };

  const renderInputArea = () => {
    if (isTyping) return null;

    switch (currentStep.type) {
      case 'text':
      case 'email-address':
      case 'date':
        const isDate = currentStep.type === 'date';
        return (
          <>
            <View style={styles.inputWrapper}>
              <TouchableOpacity disabled={!isDate} onPress={() => isDate && setCalendarVisible(true)}>
                 <Ionicons name={currentStep.icon} size={24} color={COLORS.gray} style={{ marginRight: 10 }} />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder={currentStep.placeholder}
                placeholderTextColor="#999"
                value={currentStep.id === 'name' ? answers.name : currentStep.id === 'email' ? answers.email : answers.dateValue}
                onChangeText={(text) => {
                   if (isDate) handleAnswer('dateValue', formatDateInput(text));
                   else handleAnswer(currentStep.id, text);
                }}
                keyboardType={isDate ? 'numeric' : currentStep.type === 'email-address' ? 'email-address' : 'default'}
                autoCapitalize={currentStep.type === 'email-address' ? 'none' : 'sentences'}
                maxLength={isDate ? 10 : 50}
                onSubmitEditing={handleNext}
              />
            </View>
            <ButtonNext onPress={handleNext} label={currentStep.buttonLabel || "Continuar"} />
          </>
        );

      case 'double-password':
        return (
          <View style={{ width: '100%' }}>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={24} color={COLORS.gray} style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha (6 números)"
                secureTextEntry
                keyboardType="numeric" // Força teclado numérico
                value={answers.password}
                onChangeText={(t) => handleAnswer('password', t)}
                maxLength={6} // Limita visualmente
              />
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={24} color={COLORS.gray} style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                placeholder="Confirme sua senha"
                secureTextEntry
                keyboardType="numeric" // Força teclado numérico
                value={answers.confirmPassword}
                onChangeText={(t) => handleAnswer('confirmPassword', t)}
                onSubmitEditing={handleNext}
                maxLength={6}
              />
            </View>
            
            {/* BOTÃO DE TOGGLE INFO (Expandir/Recolher) */}
            <TouchableOpacity style={styles.infoButton} onPress={() => setShowPasswordReqs(!showPasswordReqs)}>
                <Ionicons name="information-circle" size={20} color={COLORS.primary} />
                <Text style={styles.infoText}>Requisitos da senha</Text>
                <Ionicons name={showPasswordReqs ? "chevron-up" : "chevron-down"} size={16} color={COLORS.primary} />
             </TouchableOpacity>
             
             {/* CAIXA DE INFORMAÇÃO QUE ABRE */}
             {showPasswordReqs && (
               <View style={styles.passwordReqBox}>
                 <Text style={styles.reqText}>• Exatamente 6 números</Text>
                 <Text style={styles.reqText}>• Apenas números são permitidos</Text>
                 <Text style={styles.reqText}>• As senhas devem ser iguais</Text>
               </View>
             )}

            <ButtonNext onPress={handleNext} label={currentStep.buttonLabel} />
          </View>
        );

      case 'boolean':
        return (
          <View style={{ width: '100%', gap: 15 }}>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleBoolean(true)}>
              <Text style={styles.optionText}>{currentStep.yesLabel}</Text>
              <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleBoolean(false)}>
              <Text style={styles.optionText}>{currentStep.noLabel}</Text>
              <Ionicons name="close-circle-outline" size={24} color={COLORS.gray} />
            </TouchableOpacity>
          </View>
        );

      case 'loading':
        return (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ marginTop: 10, color: COLORS.gray, fontStyle: 'italic' }}>Finalizando cadastro...</Text>
            </View>
        );
      default: return null;
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={{ height: insets.top, backgroundColor: COLORS.primary }} />
      
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={goToPreviousStep} style={{marginRight: 15}}>
             <Ionicons name="arrow-back" size={28} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
             <Ionicons name="person-circle" size={50} color={COLORS.white} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Theo</Text>
            <Text style={styles.headerSubtitle}>Cadastro Inteligente</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.contentContainer}>
        <View style={styles.cardContainer}>
          <Animated.View style={[styles.botBubble, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }]}>
            {isTyping ? (
              <View style={styles.typingContainer}>
                 <ActivityIndicator color={COLORS.white} size="small" />
                 <Text style={styles.typingText}>Theo está digitando...</Text>
              </View>
            ) : (
              <Text style={styles.botText}>{renderBotText()}</Text>
            )}
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim, width: '100%', alignItems: 'center' }}>
             {renderInputArea()}
          </Animated.View>
        </View>
        
        <View style={styles.progressContainer}>
          {STEPS.map((_, index) => (
             <View key={index} style={[styles.dot, index === currentStepIndex && styles.activeDot]} />
          ))}
        </View>
      </KeyboardAvoidingView>

      <Modal transparent={true} visible={isCalendarVisible} animationType="fade" onRequestClose={() => setCalendarVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setCalendarVisible(false)} activeOpacity={1}>
           <View style={styles.calendarContainer} onStartShouldSetResponder={() => true}>
              <View style={styles.calendarHeader}>
                 {!showYearPicker && <TouchableOpacity onPress={() => changePickerMonth(-1)}><Ionicons name="chevron-back" size={24} color={COLORS.primary} /></TouchableOpacity>}
                 <TouchableOpacity onPress={() => setShowYearPicker(!showYearPicker)} style={{flexDirection:'row', alignItems:'center'}}><Text style={styles.calendarMonthText}>{monthNames[pickerDate.getMonth()]} {pickerDate.getFullYear()}</Text><Ionicons name={showYearPicker ? "caret-up" : "caret-down"} size={16} color={COLORS.primary} style={{marginLeft: 5}}/></TouchableOpacity>
                 {!showYearPicker && <TouchableOpacity onPress={() => changePickerMonth(1)}><Ionicons name="chevron-forward" size={24} color={COLORS.primary} /></TouchableOpacity>}
              </View>
              {showYearPicker ? (
                 <ScrollView style={{ maxHeight: 250 }}>{generateYears().map(year => (<TouchableOpacity key={year} style={styles.yearItem} onPress={() => handleYearSelect(year)}><Text style={[styles.yearText, year === pickerDate.getFullYear() && styles.selectedYearText]}>{year}</Text></TouchableOpacity>))}</ScrollView>
              ) : (
                 <>
                   <View style={styles.weekDaysContainer}>{dayNames.map((day, i) => <Text key={i} style={styles.weekDayText}>{day}</Text>)}</View>
                   <View style={styles.daysGrid}>{generateCalendar(pickerDate).map((d, i) => (<TouchableOpacity key={i} style={[styles.dayCell, d.day === '' && styles.emptyCell]} disabled={d.day === ''} onPress={() => handleDaySelect(d.day)}><Text style={styles.dayText}>{d.day}</Text></TouchableOpacity>))}</View>
                 </>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={() => { setCalendarVisible(false); setShowYearPicker(false); }}><Text style={styles.closeButtonText}>Cancelar</Text></TouchableOpacity>
           </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const ButtonNext = ({ onPress, label }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Text style={styles.actionButtonText}>{label}</Text>
    <Ionicons name="arrow-forward" size={20} color={COLORS.white} style={{ marginLeft: 10 }} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.lightGray },
  header: { backgroundColor: COLORS.primary, padding: 20, flexDirection: 'row', alignItems: 'center', elevation: 4 },
  avatarContainer: { marginRight: 15 },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: 'bold' },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  contentContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  cardContainer: { width: '100%', maxWidth: 400, alignItems: 'center' },
  botBubble: { backgroundColor: COLORS.primary, padding: 25, borderRadius: 20, borderBottomLeftRadius: 4, marginBottom: 30, width: '100%', elevation: 5, minHeight: 100, justifyContent: 'center' },
  botText: { color: COLORS.white, fontSize: 18, lineHeight: 26, textAlign: 'center', fontWeight: '600' },
  typingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  typingText: { color: COLORS.white, marginLeft: 10, fontStyle: 'italic' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, width: '100%', height: 55, borderRadius: 12, paddingHorizontal: 15, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 15 },
  input: { flex: 1, fontSize: 16, color: '#333', height: '100%' },
  
  // Botão de informações
  infoButton: { flexDirection: 'row', alignSelf: 'center', marginTop: 5, marginBottom: 10, alignItems: 'center' },
  infoText: { color: COLORS.primary, marginLeft: 5, marginRight: 5, fontSize: 14, fontWeight: '500', textDecorationLine: 'underline' },
  
  // Caixa de Requisitos
  passwordReqBox: { width: '100%', backgroundColor: '#E8F0FE', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#B3D7FF' },
  reqText: { fontSize: 13, color: '#004085', marginBottom: 4 },

  actionButton: { backgroundColor: COLORS.darkBlue || '#2D4373', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, width: '100%', elevation: 3, marginTop: 10 },
  actionButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  optionButton: { backgroundColor: COLORS.white, padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', elevation: 2 },
  optionText: { fontSize: 16, color: COLORS.text, fontWeight: '500' },
  progressContainer: { flexDirection: 'row', marginTop: 40 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#CCC', marginHorizontal: 4 },
  activeDot: { backgroundColor: COLORS.primary, width: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  calendarContainer: { width: '85%', backgroundColor: 'white', borderRadius: 15, padding: 20, elevation: 10 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  calendarMonthText: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  weekDaysContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  weekDayText: { width: '14%', textAlign: 'center', fontWeight: 'bold', color: COLORS.gray },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 2 },
  emptyCell: { backgroundColor: 'transparent' },
  dayText: { fontSize: 16, color: COLORS.text },
  closeButton: { marginTop: 15, padding: 10, alignItems: 'center' },
  closeButtonText: { color: COLORS.gray, fontWeight: 'bold' },
  yearItem: { padding: 15, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
  yearText: { fontSize: 18, color: COLORS.text },
  selectedYearText: { color: COLORS.primary, fontWeight: 'bold' },
  successContainer: { flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', padding: 20 },
  successCard: { alignItems: 'center', width: '100%' },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginTop: 20, marginBottom: 10 },
  successSubtitle: { fontSize: 16, color: COLORS.gray, textAlign: 'center', marginBottom: 40 },
  successButton: { backgroundColor: '#4CAF50', flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, alignItems: 'center', elevation: 5 },
  successButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});

export default RegistrationChatScreen;