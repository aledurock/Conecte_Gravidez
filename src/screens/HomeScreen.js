import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { calculateGestationDetails } from '../utils/gestationCalculator';
import { BABY_SIZES } from '../constants/babyData';

const HomeScreen = () => {
  const { userProfile } = useAuth();
  const displayName = userProfile?.name || 'Usuário';

  const gestationInfo = calculateGestationDetails(userProfile);

  let babySizeInfo = null;
  if (gestationInfo) {
    // LÓGICA CORRIGIDA: Encontra o último tamanho válido que seja menor ou igual à semana atual.
    const possibleSizes = BABY_SIZES.filter(
      item => item.week <= gestationInfo.currentWeek
    );
    // Pega o último item da lista filtrada, que é a correspondência mais próxima.
    if (possibleSizes.length > 0) {
      babySizeInfo = possibleSizes[possibleSizes.length - 1];
    }
  }

  return (
    <View style={styles.container}>
      <Text>Bem-Vindo(a) {displayName}</Text> 
      
      {gestationInfo ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Você está na Semana {gestationInfo.currentWeek}</Text>
          
          {babySizeInfo ? (
            <Text style={styles.cardSubtitle}>
              Seu bebê tem o tamanho de{' '}
              <Text style={{fontWeight: 'bold'}}>{babySizeInfo.size}</Text>
            </Text>
          ) : (
            <Text style={styles.cardSubtitle}>O desenvolvimento está só começando!</Text>
          )}
          
          <Text style={styles.cardCountdown}>
            Faltam aproximadamente {gestationInfo.daysRemaining} dias!
          </Text>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Complete seu perfil</Text>
          <Text style={styles.cardSubtitle}>
            Adicione as informações da sua gestação no seu perfil para começar o acompanhamento!
          </Text>
        </View>
      )}

      <Text>Categorias</Text>
      {/* ... */}
    </View>
  );
};

// Seus estilos (sem alteração)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#EBF5FF',
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005A9C',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  cardCountdown: {
    fontSize: 14,
    color: '#555',
    marginTop: 12,
  },
});

export default HomeScreen;

