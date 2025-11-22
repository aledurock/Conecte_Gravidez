/**
 * Calcula a semana atual e dias restantes da gestação.
 * Recebe o perfil com dumDate ou dppDate (Strings no formato YYYY-MM-DD).
 */
export const calculateGestationDetails = (profile) => {
  // 1. Validação básica
  if (!profile) return null;
  
  // Verifica se tem pelo menos uma das datas
  if (!profile.dumDate && !profile.dppDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Zera horas para cálculo preciso de dias

  let totalDaysOfGestation = 0;

  // 2. Cálculo dos dias
  try {
    if (profile.dumDate) {
      // Se tiver DUM (Data da Última Menstruação)
      // Adiciona T00:00:00 para garantir que o fuso horário não altere o dia
      const dumDate = new Date(profile.dumDate.includes('T') ? profile.dumDate : profile.dumDate + 'T00:00:00');
      const diffTime = today.getTime() - dumDate.getTime();
      totalDaysOfGestation = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    } 
    else if (profile.dppDate) {
      // Se tiver DPP (Data Provável do Parto)
      const dppDate = new Date(profile.dppDate.includes('T') ? profile.dppDate : profile.dppDate + 'T00:00:00');
      const diffTime = dppDate.getTime() - today.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Gestação média é 280 dias (40 semanas)
      totalDaysOfGestation = 280 - daysRemaining;
    }
  } catch (error) {
    console.log("Erro ao calcular data:", error);
    return null;
  }

  // 3. Se a data for futura ou inválida
  if (isNaN(totalDaysOfGestation) || totalDaysOfGestation < 0) {
    return null;
  }

  // 4. Converte dias em semanas
  const currentWeek = Math.floor(totalDaysOfGestation / 7);
  const daysRemaining = 280 - totalDaysOfGestation;

  // Retorna objeto pronto
  return {
    currentWeek: currentWeek > 0 ? currentWeek : 1, // Garante pelo menos semana 1
    daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
  };
};