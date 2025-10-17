import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { calculateGestationDetails } from '../utils/gestationCalculator';
import { BABY_SIZES } from '../constants/babyData';
import { DAILY_TIPS } from '../constants/dailyTips';
import { commonStyles, COLORS } from '../components/commonStyles';
import { Ionicons } from '@expo/vector-icons';

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
        const randomIndex = Math.floor(Math.random() * DAILY_TIPS.length);
        setDailyTip(DAILY_TIPS[randomIndex]);
    }, []);

    const displayName = userProfile?.name || 'Usuário';
    const gestationInfo = calculateGestationDetails(userProfile);

    let babySizeInfo = null;
    if (gestationInfo) {
        const possibleSizes = BABY_SIZES.filter(
            item => item.week <= gestationInfo.currentWeek
        );
        if (possibleSizes.length > 0) {
            babySizeInfo = possibleSizes[possibleSizes.length - 1];
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="never"
                // --- ATIVAÇÃO DO EFEITO DE "ESTICAR" (OVERSCROLL) ---
                bounces={true} // Garante o efeito "bounce" no iOS.
                overScrollMode="always" // Ativa o efeito "esticar" no Android.
            >
                <View style={styles.header}>
                    <Ionicons name="person-circle-outline" size={32} color={COLORS.white} />
                    <View>
                        <Text style={styles.headerText}>Olá, {displayName}!</Text>
                        {gestationInfo && (
                            <Text style={styles.headerSubtext}>Semana {gestationInfo.currentWeek} da sua jornada</Text>
                        )}
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    {gestationInfo && babySizeInfo ? (
                        <View style={styles.mainCard}>
                            <Image source={fruitImages[babySizeInfo.image]} style={styles.fruitImage} />
                            <View style={styles.mainCardContent}>
                                <Text style={styles.mainCardText}>
                                    Seu bebê tem o tamanho de um{' '}
                                    <Text style={{ fontWeight: 'bold' }}>{babySizeInfo.size.replace('uma ', '').replace('um ', '')}</Text>
                                </Text>
                                <Text style={styles.countdownText}>
                                    Faltam aproximadamente {gestationInfo.daysRemaining} dias para o grande encontro!
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View style={[styles.mainCard, { paddingVertical: 30, alignItems: 'center' }]}>
                            <Text style={[styles.mainCardText, { textAlign: 'center' }]}>Complete seu perfil</Text>
                            <Text style={[styles.countdownText, { textAlign: 'center', marginTop: 8 }]}>Para iniciar o acompanhamento da sua gestação.</Text>
                        </View>
                    )}

                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionButtonText}>Consultas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionButtonText}>Relatar Sintomas</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tipCard}>
                        <Text style={styles.tipTitle}>Dica do Dia</Text>
                        <Text style={styles.tipText}>{dailyTip}</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// O StyleSheet permanece exatamente o mesmo do seu código "estável".
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.lightGray,
    },
    header: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingTop: 57,
        paddingBottom: 25,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 15,
        alignItems: 'cen'
    },
    headerSubtext: {
        color: COLORS.white,
        fontSize: 14,
        marginLeft: 15,
    },
    contentContainer: {
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 20,
    },
    mainCard: {
        backgroundColor: COLORS.white,
        borderRadius: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    mainCardContent: {
        flex: 1,
        marginLeft: 15,
    },
    fruitImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    mainCardText: {
        fontSize: 20,
        color: COLORS.text,
        lineHeight: 28,
    },
    countdownText: {
        fontSize: 15,
        color: '#5B7DB1',
        fontWeight: '500',
        marginTop: 8,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    actionButton: {
        backgroundColor: COLORS.white,
        width: '48%',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 4,
    },
    actionButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    tipCard: {
        backgroundColor: COLORS.white,
        marginTop: 20,
        borderRadius: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 4,
    },
    tipTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 10,
    },
    tipText: {
        fontSize: 16,
        color: COLORS.text,
        lineHeight: 24,
    }
});

export default HomeScreen;

