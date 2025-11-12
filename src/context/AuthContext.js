import React, { createContext, useContext, useState, useEffect } from 'react';
// --- TODOS OS IMPORTS DE FIREBASE FORAM REMOVIDOS ---


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
    },
];
// ---------------------------------

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null); // <-- Começa como null
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true); 

  // --- NOSSA NOVA LISTA DE SINTOMAS ---
  const [sintomas, setSintomas] = useState(DUMMY_SINTOMAS);

  // --- CORREÇÃO PARA TELA BRANCA (Versão Deslogado) ---
  useEffect(() => {
    setLoading(false);
  }, []); 

  // --- NOSSA NOVA FUNÇÃO PARA ADICIONAR SINTOMAS ---
  const addSintoma = (novoRelato) => {
    // ... (código existente e correto)
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

  // Funções de Firebase "vazias" (para o protótipo)
  const login = () => console.log('Login desativado no protótipo');
  const signup = () => console.log('Signup desativado no protótipo');
  const logout = () => console.log('Logout desativado no protótipo');

  // *** INÍCIO DA CORREÇÃO ***
  // Esta é a função que o seu QuestionnaireNameScreen.js espera.
  // Ela pega os dados antigos (profileAnterior) e junta com os
  // dados novos (updatedFields) que vêm da tela.
  const updateUserProfile = (updatedFields) => {
    setUserProfile(profileAnterior => ({
        ...profileAnterior,
        ...updatedFields
    }));
  };
  // *** FIM DA CORREÇÃO ***


  // Adicione 'sintomas' e 'addSintoma' ao value
  const value = {
    user,
    userToken,
    setUserToken, // Mantém para o login funcionar
    userProfile, 
    updateUserProfile, // <<< CORRIGIDO (era setUserProfile)
    login,
    signup,
    logout,
    sintomas,
    addSintoma
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};