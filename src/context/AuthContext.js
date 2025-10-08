// src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../FireBaseConfig'; // Verifique se o caminho está correto

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Guarda o usuário logado
  const [isLoading, setIsLoading] = useState(true); // Controla o loading inicial

  // Este useEffect é o "vigia" do Firebase
  useEffect(() => {
    // onAuthStateChanged fica ouvindo em tempo real se alguém logou ou deslogou
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser); // Atualiza nosso estado com o usuário
      setIsLoading(false); // Termina o loading
    });

    // Limpa o "vigia" quando o componente é desmontado
    return () => unsubscribe();
  }, []);

  // O valor que será compartilhado com todo o app
  const value = {
    user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext);
};