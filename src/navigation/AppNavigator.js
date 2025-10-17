import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// Importação das Telas
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
// A importação de PostSignUpScreen foi removida
import HomeScreen from '../screens/HomeScreen';
import CadernetaScreen from '../screens/CadernetaScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DoutoresScreen from '../screens/DoutoresScreen';
import AgendaScreen from '../screens/AgendaScreen';
import QuestionnaireNameScreen from '../screens/QuestionnaireNameScreen';
import QuestionnaireDateScreen from '../screens/QuestionnaireDateScreen';
import QuestionnaireDumScreen from '../screens/QuestionnaireDumScreen';
import QuestionnaireDppScreen from '../screens/QuestionnaireDppScreen';
import QuestionnaireFirstPregnancyScreen from '../screens/QuestionnaireFirstPregnancyScreen';
import QuestionnairePrenatalScreen from '../screens/QuestionnairePrenatalScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Caderneta" component={CadernetaScreen} />
    </HomeStack.Navigator>
  );
}


function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Doutores') iconName = focused ? 'medkit' : 'medkit-outline';
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
      <Tab.Screen name="Doutores" component={DoutoresScreen} />
      <Tab.Screen name="Agenda" component={AgendaScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { userToken } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken == null ? (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          {/* A tela PostSignUp foi removida desta lista */}
          <Stack.Screen
            name="QuestionnaireName"
            component={QuestionnaireNameScreen}
            options={{
              headerShown: true,
              title: 'Complete seu Cadastro'
            }}
          />
          <Stack.Screen
            name="QuestionnaireDate"
            component={QuestionnaireDateScreen}
            options={{
              headerShown: true,
              title: 'Informações da Gestação'
            }}
          />
          <Stack.Screen
            name="QuestionnaireDumScreen"
            component={QuestionnaireDumScreen}
            options={{
              headerShown: true,
              title: 'Última Menstruação (DUM)'
            }}
          />
          <Stack.Screen
            name="QuestionnaireDppScreen"
            component={QuestionnaireDppScreen}
            options={{
              headerShown: true,
              title: 'Data Provável do Parto (DPP)'
            }}
          />
          <Stack.Screen
            name="QuestionnaireFirstPregnancy"
            component={QuestionnaireFirstPregnancyScreen}
            options={{
              headerShown: true,
              title: 'Informações Adicionais'
            }}
          />
          <Stack.Screen
            name="QuestionnairePrenatal"
            component={QuestionnairePrenatalScreen}
            options={{
              headerShown: true,
              title: 'Consulta Pré-Natal'
            }}
          />
        </>
      ) : (
        <Stack.Screen name="MainApp" component={MainApp} />
      )}
    </Stack.Navigator>
  );
}

