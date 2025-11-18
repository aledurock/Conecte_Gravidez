import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../components/commonStyles';
import { Ionicons } from '@expo/vector-icons';

// Lista de itens do menu
// Nós vamos navegar para os nomes de tela definidos no seu AppNavigator.js
const menuItems = [
    {
        title: 'Minhas Consultas',
        icon: 'medkit-outline',
        screen: 'Consultas', // Nome da tela no HomeStack
    },
    {
        title: 'Relatar Sintomas',
        icon: 'pulse-outline',
        screen: 'RelatosSintomas', // Nome da tela no HomeStack
    },
    {
        title: 'Histórico de Sintomas',
        icon: 'journal-outline',
        screen: 'HistoricoSintomas', // Nome da tela no HomeStack
    },
    {
        title: 'Agenda',
        icon: 'calendar-outline',
        screen: 'Agenda', // Nome da TAB no MainApp
    },
    {
        title: 'Perfil',
        icon: 'person-circle-outline',
        screen: 'Perfil', // Nome da TAB no MainApp
    },
];

const MaisScreen = ({ navigation }) => {

    const handleNavigation = (screenName) => {
        // O navigation.navigate é inteligente. 
        // Se for 'Agenda' ou 'Perfil', ele vai para a Tab.
        // Se for 'Consultas', etc., ele vai empilhar a tela.
        navigation.navigate(screenName);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            {/* Header Customizado */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mais Opções</Text>
            </View>

            <ScrollView style={styles.container}>
                {menuItems.map((item) => (
                    <TouchableOpacity 
                        key={item.title} 
                        style={styles.menuButton}
                        onPress={() => handleNavigation(item.screen)}
                    >
                        <View style={styles.menuIcon}>
                            <Ionicons name={item.icon} size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.menuButtonText}>{item.title}</Text>
                        <Ionicons name="chevron-forward-outline" size={22} color={COLORS.gray || '#888'} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.lightGray,
    },
    header: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 15,
        paddingTop: 30, // Ajuste para o topo do seu celular
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 5,
        marginRight: 15,
    },
    headerTitle: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        paddingTop: 20,
    },
    menuButton: {
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    menuIcon: {
        width: 40, // Largura fixa para alinhar o texto
        alignItems: 'flex-start',
    },
    menuButtonText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
        marginLeft: 10,
    }
});

export default MaisScreen;