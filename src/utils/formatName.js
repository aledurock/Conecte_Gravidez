/**
 * Formata o nome do usuário de acordo com regras específicas.
 * - Nomes únicos são capitalizados (ex: "aLE" -> "Ale").
 * - Nomes completos mostram o primeiro e o último, capitalizados (ex: "alessandro de lima barbosa" -> "Alessandro Barbosa").
 * @param {string} name - O nome bruto inserido pelo usuário.
 * @returns {string} - O nome formatado.
 */
export const formatUserName = (name) => {
  if (!name) return '';

  // Remove espaços extras e divide o nome em partes, filtrando partes vazias.
  const parts = name.trim().split(' ').filter(part => part.length > 0);

  if (parts.length === 0) {
    return '';
  }

  // Função interna para capitalizar uma palavra corretamente
  const capitalize = (word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1).toLowerCase(); // Força o resto para minúsculo
    return firstLetter + restOfWord;
  };

  if (parts.length === 1) {
    // Se for só um nome, apenas o capitaliza
    return capitalize(parts[0]);
  } else {
    // Se for nome completo, pega o primeiro e o último
    const firstName = capitalize(parts[0]);
    const lastName = capitalize(parts[parts.length - 1]);
    return `${firstName} ${lastName}`;
  }
};

