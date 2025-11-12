import React, { createContext, useContext, useState, useEffect } from 'react';

// --- DADOS DE EXEMPLO (MOCK) ---
const DUMMY_SINTOMAS = [
  {
    id: '1',
    data: '10/11/2025',
    sintoma: 'Enjoo Matinal',
    intensidade: 'moderado',
    notas: 'Senti logo ao acordar, antes de comer.',
    feedback: 'Isso é muito comum. Tente comer 2 bolachas de água e sal antes de se levantar da cama. Beba líquidos frios em pequenos goles.'
  },
  {
    id: '2',
    data: '08/11/2025',
    sintoma: 'Dor nas Costas',
    intensidade: 'intenso',
    notas: 'Piorou no fim do dia, depois de ficar muito tempo sentada.',
    feedback: 'Tente usar sapatos mais confortáveis e fazer pausas para se alongar. Uma bolsa de água morna na lombar por 15 minutos pode ajudar.'
  }
];

const INITIAL_APPOINTMENTS = [];

// ---------------------------------
export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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

  // Funções de Perfil/Login
  const updateUserProfile = (profileData) => {
    setUserProfile(prevProfile => ({
      ...prevProfile,
      ...profileData
    }));
  };

  // Renomeado para evitar conflito de escopo
  const setUserToken_global = (token) => {
    setUserToken(token);
  };

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
      feedback: null
    };
    setSintomas(listaAnterior => [sintomaCompleto, ...listaAnterior]);
  };

  // Adiciona uma CONSULTA
  const addAppointment = (novaConsulta) => {
    const consultaFormatada = {
      id: Date.now().toString(),
      date: novaConsulta.date.toISOString().split('T')[0],
      title: novaConsulta.title,
      doctor: novaConsulta.doctor,
      time: novaConsulta.time,
      status: novaConsulta.status,
      type: 'consulta'
    };
    setAppointments(prev => [...prev, consultaFormatada]);
  };

  // Adiciona um LEMBRETE
  const addReminder = (novoLembrete) => {
    const lembreteFormatado = {
      id: Date.now().toString(),
      date: novoLembrete.date.toISOString().split('T')[0],
      title: novoLembrete.title,
      description: novoLembrete.description,
      time: novoLembrete.time,
      type: 'lembrete'
    };
    setAppointments(prev => [...prev, lembreteFormatado]);
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

  // Deleta QUALQUER item
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

  // Valor do contexto
  const value = {
    user,
    userToken,
    setUserToken: setUserToken_global,
    userProfile,
    setUserProfile,
    updateUserProfile,
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