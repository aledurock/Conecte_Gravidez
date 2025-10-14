import React, { createContext, useState, useContext } from 'react';

// 1. Crie o Contexto
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null); // Estado para controlar o login
    const [userProfile, setUserProfile] = useState(null); // Estado para guardar os dados do perfil

    // Funções de Autenticação
    const signIn = () => {
        // No futuro, isso virá do Firebase após login
        // Por agora, apenas definimos um token para simular o login
        setUserToken('dummy-token');
    };

    const signOut = () => {
        setUserToken(null);
        setUserProfile(null); // Limpa o perfil ao sair
    };

    const signUp = () => {
        // Lógica de cadastro (não precisa mudar agora)
    };

    // Função para atualizar os dados do perfil (Nome, DUM, etc.)
    const updateUserProfile = (profileData) => {
        setUserProfile(prevProfile => ({ ...prevProfile, ...profileData }));
        console.log("Perfil atualizado:", { ...userProfile, ...profileData });
    };

    return (
        <AuthContext.Provider value={{ 
            userToken, // Adicionado para seu AppNavigator funcionar
            userProfile, 
            signIn, 
            signOut, 
            signUp,
            updateUserProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// 2. Crie o Hook customizado para facilitar o uso
export const useAuth = () => {
    return useContext(AuthContext);
};