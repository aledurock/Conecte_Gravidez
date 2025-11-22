/**
 * Formata o nome digitado pelo usuário.
 * Regra: Capitaliza a primeira letra de cada nome.
 * Se tiver sobrenome, retorna "Primeiro Sobrenome".
 * Se for nome único, retorna "Primeiro".
 * @param {string} name - O nome bruto.
 */
export const formatUserName = (name) => {
  if (!name) return '';
  
  // Remove espaços extras e divide
  const parts = name.trim().split(/\s+/).filter(part => part.length > 0);
  
  if (parts.length === 0) return '';

  const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  };

  if (parts.length === 1) {
    return capitalize(parts[0]);
  } else {
    const firstName = capitalize(parts[0]);
    const lastName = capitalize(parts[parts.length - 1]);
    return `${firstName} ${lastName}`;
  }
};

/**
 * [NOVA FUNÇÃO] Recupera o nome de exibição do usuário a partir do perfil.
 * Use esta função em qualquer tela (Home, Perfil, etc) para puxar o nome.
 * * Exemplo de uso:
 * import { getDisplayName } from '../utils/formatName';
 * const nome = getDisplayName(userProfile);
 * * @param {object} userProfile - O objeto de perfil vindo do AuthContext.
 * @returns {string} - O nome formatado ou 'Nova Mãe' se não encontrar.
 */
export const getDisplayName = (userProfile) => {
  if (!userProfile) return 'Nova Mãe';
  
  // Tenta pegar o nome na raiz ou dentro de um sub-objeto user (caso a estrutura varie)
  const name = userProfile.name || userProfile.user?.name;
  
  if (name && name.trim() !== '') {
    return formatUserName(name); // Garante que esteja formatado
  }
  
  return 'Nova Mãe';
};