import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// --- TELAS DE AUTENTICAÇÃO ---
import SignInScreen from '../screens/SignInScreen';
import RegistrationChatScreen from '../screens/RegistrationChatScreen'; 
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'; 
import NewPasswordScreen from '../screens/NewPasswordScreen'; 
import PasswordChangedSuccessScreen from '../screens/PasswordChangedSuccessScreen'; 

// --- TELAS DO APP PRINCIPAL ---
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AgendaScreen from '../screens/AgendaScreen';
import RelatosSintomasScreen from '../screens/RelatosSintomas';
import SintomasScreen from '../screens/Sintomas';
import ConsultasScreen from '../screens/ConsultasScreen';
import MaisScreen from '../screens/MaisScreen';
import AboutScreen from '../screens/AboutScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen'; 
import PasswordChangeDoneScreen from '../screens/PasswordChangeDoneScreen'; // <--- IMPORTADO AQUI

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

// --- NAVEGADOR DA HOME ---
function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="RelatosSintomas" component={RelatosSintomasScreen} />
      <HomeStack.Screen name="HistoricoSintomas" component={SintomasScreen} />
      <HomeStack.Screen name="Consultas" component={ConsultasScreen} />
      <HomeStack.Screen name="Mais" component={MaisScreen} />
    </HomeStack.Navigator>
  );
}

// --- NAVEGADOR PRINCIPAL (Abas) ---
function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Agenda') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'Perfil') iconName = focused ? 'person-circle' : 'person-circle-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B5998',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Agenda" component={AgendaScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// --- NAVEGADOR RAIZ ---
export default function AppNavigator() {
  const { userToken } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken == null ? (
        // 🔒 SE NÃO ESTIVER LOGADO
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={RegistrationChatScreen} options={{ headerShown: false }} />
          
          <Stack.Screen 
            name="ForgotPassword" 
            component={ForgotPasswordScreen} 
            options={{ headerShown: true, title: 'Recuperar Senha' }}
          />

          <Stack.Screen 
            name="NewPassword" 
            component={NewPasswordScreen} 
            options={{ headerShown: true, title: 'Nova Senha' }}
          />

          <Stack.Screen 
            name="PasswordChangedSuccess" 
            component={PasswordChangedSuccessScreen} 
            options={{ headerShown: false }} 
          />
        </>
      ) : (
        // 🔓 SE ESTIVER LOGADO
        <>
          <Stack.Screen name="MainApp" component={MainApp} />
          <Stack.Screen name="AboutScreen" component={AboutScreen} options={{ headerShown: true, title: 'Sobre o App' }} />
          
          {/* --- NOVA ROTA DE TROCA DE SENHA --- */}
          <Stack.Screen 
            name="ChangePassword" 
            component={ChangePasswordScreen} 
            options={{ headerShown: true, title: 'Alterar Senha' }} 
          />
          
           {/* --- NOVA ROTA DE CONFIRMAÇÃO --- */}
          <Stack.Screen 
            name="PasswordChangeDone" 
            component={PasswordChangeDoneScreen} 
            options={{ headerShown: false }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
}