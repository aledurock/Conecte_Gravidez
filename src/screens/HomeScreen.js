import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { calculateGestationDetails } from '../utils/gestationCalculator';
import { BABY_SIZES } from '../constants/babyData';
import { DAILY_TIPS } from '../constants/dailyTips';
import { COLORS } from '../components/commonStyles';

const fruitImages = {
  'semente.png': require('../../assets/images/niveis_bebe/semente.png'),
  'azeitona.png': require('../../assets/images/niveis_bebe/azeitona.png'),
  'maca.png': require('../../assets/images/niveis_bebe/maca.png'),
  'manga.png': require('../../assets/images/niveis_bebe/manga.png'),
  'berinjela.png': require('../../assets/images/niveis_bebe/berinjela.png'),
  'repolho.png': require('../../assets/images/niveis_bebe/repolho.png'),
  'melao.png': require('../../assets/images/niveis_bebe/melao.png'),
  'melancia.png': require('../../assets/images/niveis_bebe/melancia.png'),
  'jaca.png': require('../../assets/images/niveis_bebe/jaca.png'),
};

const HomeScreen = ({ navigation }) => {
  const { userProfile } = useAuth();
  const [dailyTip, setDailyTip] = useState('');

  useEffect(() => {
    if (DAILY_TIPS && DAILY_TIPS.length > 0) {
      setDailyTip(DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)]);
    }
  }, []);

  const displayName = userProfile?.name || 'Nova Mãe';
  
  const currentAvatar = userProfile?.avatar || { type: 'icon', source: 'person-circle-outline' };

  let gestationInfo = null;
  if (userProfile?.currentWeek) {
     gestationInfo = { 
        currentWeek: userProfile.currentWeek, 
        daysRemaining: userProfile.daysRemaining 
     };
  } else {
     gestationInfo = calculateGestationDetails(userProfile);
  }

  let babySizeInfo = null;
  if (gestationInfo) {
    const currentWeek = gestationInfo.currentWeek;
    const possibleSizes = BABY_SIZES.filter(item => item.week <= currentWeek);
    
    if (possibleSizes.length > 0) {
      babySizeInfo = possibleSizes[possibleSizes.length - 1];
    } else {
      babySizeInfo = BABY_SIZES[0];
    }
  }

  const renderHeaderAvatar = () => {
    if (currentAvatar.type === 'image') {
       return <Image source={currentAvatar.source} style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' }} />;
    }
    return <Ionicons name={currentAvatar.source} size={45} color={COLORS.white} />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            
            <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
               {renderHeaderAvatar()}
            </TouchableOpacity>

            <View style={{ marginLeft: 12 }}>
              <Text style={styles.headerText}>Olá, {displayName}!</Text>
              {gestationInfo ? (
                 <Text style={styles.headerSubtext}>Semana {gestationInfo.currentWeek} da sua jornada</Text>
              ) : (
                 <Text style={styles.headerSubtext}>Bem-vinda!</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {gestationInfo && babySizeInfo ? (
            <View style={styles.mainCard}>
              <View style={styles.imageContainer}>
                 {fruitImages[babySizeInfo.image] ? (
                    <Image
                      source={fruitImages[babySizeInfo.image]}
                      style={styles.fruitImage}
                    />
                 ) : (
                    <View style={{ width: '100%', height: '100%', backgroundColor: '#eee' }} />
                 )}
              </View>
              
              <View style={styles.mainCardContent}>
                <Text style={styles.mainCardTitle}>Seu bebê tem o tamanho de:</Text>
                <Text style={styles.fruitName}>
                   {babySizeInfo.size.replace(/^(uma?)\s/, '')}
                </Text>
                <Text style={styles.countdownText}>
                  Faltam aproximadamente {gestationInfo.daysRemaining} dias.
                </Text>
              </View>
            </View>
          ) : (
            <View style={[styles.mainCard, { justifyContent: 'center', paddingVertical: 30 }]}>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.mainCardTitle}>Complete seu perfil</Text>
                <Text style={[styles.countdownText, { textAlign: 'center', marginTop: 5 }]}>
                  Para ver o desenvolvimento do bebê.
                </Text>
              </View>
            </View>
          )}

          <View style={styles.gridContainer}>
            <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('Consultas')}>
              <Text style={styles.gridButtonText}>Consultas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('RelatosSintomas')}>
              <Text style={styles.gridButtonText}>Relatar Sintomas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('HistoricoSintomas')}>
              <Text style={styles.gridButtonText}>Histórico</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('Mais')}>
              <Text style={styles.gridButtonText}>Mais...</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tipCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Ionicons name="bulb-outline" size={24} color={COLORS.primary} />
              <Text style={styles.tipTitle}> Dica do Dia</Text>
            </View>
            <Text style={styles.tipText}>{dailyTip || "Hidrate-se bem hoje!"}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.lightGray },
  header: { 
    backgroundColor: COLORS.primary, 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 30, // Reduzi um pouco o padding bottom já que o card vai descer
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30 
  },
  headerText: { 
    color: COLORS.white, 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  headerSubtext: { 
    color: COLORS.white, // MUDANÇA: Agora é branco (antes era amarelo/dourado)
    fontSize: 14, 
    fontWeight: '600', 
    marginTop: 2 
  },
  contentContainer: { 
    paddingHorizontal: 20, 
    marginTop: 20 // MUDANÇA: Margem positiva para descer o card e sair de cima do azul
  },
  mainCard: { backgroundColor: COLORS.white, borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, marginBottom: 25 },
  imageContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', marginRight: 15, overflow: 'hidden' },
  fruitImage: { width: '80%', height: '80%', resizeMode: 'contain' },
  mainCardContent: { flex: 1 },
  mainCardTitle: { fontSize: 14, color: '#666', fontWeight: '600' },
  fruitName: { fontSize: 22, color: COLORS.primary, fontWeight: 'bold', textTransform: 'capitalize', marginVertical: 2 },
  countdownText: { fontSize: 12, color: '#888' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  gridButton: { width: '48%', backgroundColor: COLORS.white, paddingVertical: 18, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  gridButtonText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 15 },
  tipCard: { backgroundColor: '#E3F2FD', borderRadius: 15, padding: 20, borderLeftWidth: 5, borderLeftColor: COLORS.primary },
  tipTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  tipText: { fontSize: 14, color: '#333', lineHeight: 22 },
});

export default HomeScreen;