import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';

const DUMMY_SINTOMAS = [];
const INITIAL_APPOINTMENTS = [];

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null); // Aqui fica o avatar
  const [loading, setLoading] = useState(true);
  
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

  // --- ATUALIZAR PERFIL (FOTO, NOME, ETC) ---
  const updateUserProfile = (newData) => {
    setUserProfile((prevProfile) => ({
      ...prevProfile, // Mantém o que já existe (nome, email, datas)
      ...newData      // Sobrescreve com o novo (ex: avatar)
    }));
  };

  // --- FUNÇÕES DE SINTOMAS E AGENDA (Mantidas) ---
  const addSintoma = (novo) => {
    const item = { ...novo, id: Date.now().toString() };
    setSintomas(prev => [item, ...prev]);
  };

  const addAppointment = (novaConsulta) => {
    let dateString = novaConsulta.date;
    if (novaConsulta.date instanceof Date) {
        dateString = novaConsulta.date.toISOString().split('T')[0];
    }
    const consultaFormatada = {
      ...novaConsulta,
      id: Date.now().toString(),
      date: dateString,
      status: novaConsulta.status || 'andamento'
    };
    setAppointments(prev => [...prev, consultaFormatada]);
  };

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

  const editReminder = (id, dadosNovos) => {
    setAppointments(prev =>
      prev.map(app => {
        if (app.id === id) {
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

  const deleteReminder = (id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

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
      updateUserProfile, // Exportamos essa função nova
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