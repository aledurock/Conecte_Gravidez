/**
 * Calcula os detalhes da gestação a partir do perfil do usuário (DUM ou DPP).
 * @param {object} profile - O objeto de perfil do usuário, contendo dumDate ou dppDate.
 * @returns {object | null} - Um objeto com currentWeek e daysRemaining, ou null se não houver dados.
 */
export const calculateGestationDetails = (profile) => {
  // Retorna nulo se não houver perfil ou nenhuma data para calcular
  if (!profile || (!profile.dumDate && !profile.dppDate)) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Zera o tempo para comparações de data precisas

  let totalDaysOfGestation = 0;

  if (profile.dumDate) {
    // Lógica se a DUM foi fornecida
    const dumDate = new Date(profile.dumDate + 'T00:00:00');
    const diffTime = today - dumDate;
    totalDaysOfGestation = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  } else if (profile.dppDate) {
    // Lógica se a DPP foi fornecida
    const dppDate = new Date(profile.dppDate + 'T00:00:00');
    const totalDuration = 280; // Duração média da gestação em dias
    const daysRemaining = Math.ceil((dppDate - today) / (1000 * 60 * 60 * 24));
    totalDaysOfGestation = totalDuration - daysRemaining;
  }

  // Se o cálculo resultar em um número negativo (data no futuro), retorna nulo
  if (totalDaysOfGestation < 0) {
    return null;
  }

  const currentWeek = Math.floor(totalDaysOfGestation / 7);
  const daysRemaining = 280 - totalDaysOfGestation;

  return {
    currentWeek,
    daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
  };
};

