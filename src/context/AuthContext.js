import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';

// Mock inicial de dados para não começar vazio
const DUMMY_SINTOMAS = [];
const INITIAL_APPOINTMENTS = [];

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para armazenar dados do usuário
  const [sintomas, setSintomas] = useState(DUMMY_SINTOMAS);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

  useEffect(() => {
    setLoading(false);
  }, []);

  // --- LOGIN ---
  const signIn = async (userData) => {
    try {
      setUserToken('dummy-token');
      
      if (userData && userData.name) {
        console.log("AuthContext: Login com perfil completo:", userData.name);
        setUserProfile(userData);
      } else if (!userProfile) {
        setUserProfile({ name: 'Usuária', email: userData?.email });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- CADASTRO ---
  const signUp = async (userData) => {
    try {
      console.log("AuthContext: Cadastro salvo:", userData);
      setUserProfile(userData);
      return true;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const signOut = () => {
    setUserToken(null);
    setUserProfile(null);
  };

  // --- FUNÇÕES DE SINTOMAS ---
  const addSintoma = (novo) => {
    const item = { ...novo, id: Date.now().toString() };
    setSintomas(prev => [item, ...prev]);
  };

  // --- FUNÇÕES DE AGENDA / CONSULTAS ---
  
  // Adicionar Consulta ou Exame
  const addAppointment = (novaConsulta) => {
    // Garante que a data seja string YYYY-MM-DD para consistência
    let dateString = novaConsulta.date;
    if (novaConsulta.date instanceof Date) {
        dateString = novaConsulta.date.toISOString().split('T')[0];
    }
    
    const consultaFormatada = {
      ...novaConsulta,
      id: Date.now().toString(),
      date: dateString, // Salva como string
      status: novaConsulta.status || 'andamento'
    };
    
    console.log("Adicionando consulta:", consultaFormatada);
    setAppointments(prev => [...prev, consultaFormatada]);
  };

  // Adicionar Lembrete (Genérico)
  const addReminder = (novoLembrete) => {
    let dateString = novoLembrete.date;
    if (novoLembrete.date instanceof Date) {
        dateString = novoLembrete.date.toISOString().split('T')[0];
    }

    const lembreteFormatado = {
      ...novoLembrete,
      id: Date.now().toString(),
      date: dateString,
      type: 'lembrete'
    };
    setAppointments(prev => [...prev, lembreteFormatado]);
  };

  // Editar
  const editReminder = (id, dadosNovos) => {
    setAppointments(prev =>
      prev.map(app => {
        if (app.id === id) {
           // Trata data se vier como objeto Date
           let dateString = dadosNovos.date;
           if (dadosNovos.date instanceof Date) {
               dateString = dadosNovos.date.toISOString().split('T')[0];
           }
           return { ...app, ...dadosNovos, date: dateString };
        }
        return app;
      })
    );
  };

  // Deletar
  const deleteReminder = (id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  // Atualizar Status (Cancelar, Finalizar)
  const updateAppointmentStatus = (id, status, reason = '') => {
    setAppointments(prev =>
      prev.map(app => {
        if (app.id === id) {
          return { ...app, status: status, motivoCancelamento: reason };
        }
        return app;
      })
    );
  };

  return (
    <AuthContext.Provider value={{
      userToken,
      userProfile,
      signIn,
      signUp,
      signOut,
      sintomas,
      appointments,
      addSintoma,
      addAppointment,
      addReminder,
      editReminder,
      deleteReminder,
      updateAppointmentStatus
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};