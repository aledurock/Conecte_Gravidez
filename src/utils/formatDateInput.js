/**
 * Aplica uma máscara de data (DD/MM/AAAA) a uma string de números.
 * @param {string} text - O texto digitado pelo usuário.
 * @returns {string} - O texto formatado com as barras.
 */
export const formatDateInput = (text) => {
  // 1. Remove tudo que não for dígito
  const cleaned = text.replace(/[^\d]/g, '');
  
  // 2. Limita o tamanho para 8 dígitos (DDMMAAAA)
  const truncated = cleaned.slice(0, 8);

  // 3. Aplica a máscara com as barras
  if (truncated.length > 4) {
    return `${truncated.slice(0, 2)}/${truncated.slice(2, 4)}/${truncated.slice(4)}`;
  } else if (truncated.length > 2) {
    return `${truncated.slice(0, 2)}/${truncated.slice(2)}`;
  } else {
    return truncated;
  }
};
