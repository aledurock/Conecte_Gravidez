// INÍCIO DO ARQUIVO (CORRIGIDO)
import React, { createContext, useState, useContext } from 'react';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  const authContextValue = {
    userToken,
    isProfileComplete,
    signIn: () => {
      // Em um app real, você faria uma chamada de API aqui
      // e receberia um token de verdade.
      setUserToken('dummy-token');
    },
    signOut: () => {
      setUserToken(null);
      setIsProfileComplete(false);
    },
    signUp: () => {
      // Lógica para registrar um usuário
      // Aqui, apenas simulamos o sucesso.
      return true;
    },
    completeProfile: () => {
        // Lógica para marcar que o usuário preencheu o formulário
        setIsProfileComplete(true);
    }
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto facilmente
export const useAuth = () => {
  return useContext(AuthContext);
};