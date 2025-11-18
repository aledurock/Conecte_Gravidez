import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native'; // Importar Alert

// --- DADOS DE EXEMPLO (MOCK) ---
const DUMMY_SINTOMAS = [
  // ... (seus sintomas)
];
const INITIAL_APPOINTMENTS = [];
// ---------------------------------

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados globais para os protótipos
  const [sintomas, setSintomas] = useState(DUMMY_SINTOMAS);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

  // Efeito de inicialização
  useEffect(() => {
    setLoading(false);
  }, []);

  // --- 🚀 FUNÇÕES DE LOGIN/CADASTRO 🚀 ---

  // Função de Login
  const signIn = async ({ email, password }) => {
    try {
      if (email.trim() !== '' && password.trim() !== '') {
        console.log("Login simulado com sucesso:", email);
        setUserToken('dummy-auth-token'); 
        setUserProfile({ email: email, name: 'Usuário' }); 
      } else {
        throw new Error("Email ou senha inválidos.");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Erro no Login", "Email ou senha inválidos.");
      throw e;
    }
  };

  // Função de Cadastro
  const signUp = async ({ email, password }) => {
    try {
      if (email.trim() !== '' && password.trim() !== '') {
        console.log("Cadastro simulado:", email);
        setUserProfile({ email: email, name: 'Nova Mãe' }); 
      } else {
        throw new Error("Dados de cadastro inválidos.");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Erro no Cadastro", "Não foi possível criar a conta.");
      throw e; 
    }
  };

  // Função de Sair (Logout)
  const signOut = () => {
    console.log("Usuário deslogado.");
    setUserToken(null);
    setUserProfile(null);
  };
  
  // Função para completar o questionário e logar
  const completeOnboarding = () => {
    console.log("Questionário completado, logando usuário.");
    setUserToken('dummy-auth-token'); // Define o token
  };

  // ----------------------------------------------------

  // Funções de Perfil
  const updateUserProfile = (profileData) => {
    setUserProfile(prevProfile => ({
      ...prevProfile,
      ...profileData
    }));
  };

  // --- 🌟 FUNÇÕES DE SINTOMAS E AGENDA (PREENCHIDAS) 🌟 ---

  // Funções de Sintomas
  const addSintoma = (novoRelato) => {
    const hoje = new Date();
    const dia = hoje.getDate().toString().padStart(2, '0');
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
    const ano = hoje.getFullYear();
    const sintomaCompleto = {
      ...novoRelato,
      id: Date.now().toString(),
      data: `${dia}/${mes}/${ano}`,
      feedback: null // Ou alguma lógica de feedback
    };
    setSintomas(listaAnterior => [sintomaCompleto, ...listaAnterior]);
  };

  // Adiciona uma CONSULTA
  const addAppointment = (novaConsulta) => {
    const consultaFormatada = {
      id: Date.now().toString(),
      // Converte o objeto Data para string YYYY-MM-DD
      date: novaConsulta.date.toISOString().split('T')[0], 
      title: novaConsulta.title,
      doctor: novaConsulta.doctor,
      time: novaConsulta.time,
      status: novaConsulta.status,
      type: 'consulta' // Define o tipo
    };
    // Adiciona a nova consulta à lista
    setAppointments(prev => [...prev, consultaFormatada]);
    console.log('Consulta Adicionada:', consultaFormatada);
  };

  // Adiciona um LEMBRETE
  const addReminder = (novoLembrete) => {
    const lembreteFormatado = {
      id: Date.now().toString(),
      // Converte o objeto Data para string YYYY-MM-DD
      date: novoLembrete.date.toISOString().split('T')[0], 
      title: novoLembrete.title,
      description: novoLembrete.description,
      time: novoLembrete.time,
      type: 'lembrete' // Define o tipo
    };
    // Adiciona o novo lembrete à lista
    setAppointments(prev => [...prev, lembreteFormatado]);
    console.log('Lembrete Adicionado:', lembreteFormatado);
  };

  // Edita um LEMBRETE
  const editReminder = (id, lembreteAtualizado) => {
    setAppointments(prev =>
      prev.map(app => {
        if (app.id === id) {
          return {
            ...app,
            title: lembreteAtualizado.title,
            description: lembreteAtualizado.description,
            date: lembreteAtualizado.date.toISOString().split('T')[0],
            time: lembreteAtualizado.time,
          };
        }
        return app;
      })
    );
  };

  // Deleta QUALQUER item (Lembrete ou Consulta)
  const deleteReminder = (id) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
  };

  // Atualiza o STATUS de uma consulta
  const updateAppointmentStatus = (id, newStatus, reason = '') => {
    setAppointments(prev =>
      prev.map(app => {
        if (app.id === id) {
          return { ...app, status: newStatus, motivoCancelamento: reason };
        }
        return app;
      })
    );
  };
  
  // ----------------------------------------------------

  // Valor do contexto
  const value = {
    userToken,
    userProfile,
    signIn,
    signUp,
    signOut,
    completeOnboarding, 
    updateUserProfile,
    
    // Funções de Sintomas e Agenda (agora preenchidas)
    sintomas,
    addSintoma,
    appointments,
    addAppointment,
    addReminder,
    editReminder,
    deleteReminder,
    updateAppointmentStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};