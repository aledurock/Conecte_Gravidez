import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../components/commonStyles';
import { Ionicons } from '@expo/vector-icons';

// Lista de itens do menu atualizada
const menuItems = [
    {
        title: 'Minhas Consultas',
        iconName: 'medkit-outline',
        type: 'ionicon',
        screen: 'Consultas', 
    },
    {
        title: 'Relatar Sintomas',
        iconName: 'pulse-outline',
        type: 'ionicon',
        screen: 'RelatosSintomas', 
    },
    {
        title: 'Histórico de Sintomas',
        // --- MUDANÇA AQUI: Tipo imagem e caminho do arquivo ---
        imageSource: require('../../assets/icons/historico-icon.png'),
        type: 'image',
        screen: 'HistoricoSintomas', 
    },
    {
        title: 'Agenda',
        iconName: 'calendar-outline',
        type: 'ionicon',
        screen: 'Agenda', 
    },
    {
        title: 'Perfil',
        iconName: 'person-circle-outline',
        type: 'ionicon',
        screen: 'Perfil', 
    },
];

const MaisScreen = ({ navigation }) => {

    const handleNavigation = (screenName) => {
        navigation.navigate(screenName);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
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
                            {}
                            {item.type === 'image' ? (
                                <Image 
                                    source={item.imageSource}
                                    style={{ width: 24, height: 24, tintColor: COLORS.primary }}
                                    resizeMode="contain"
                                />
                            ) : (
                                <Ionicons name={item.iconName} size={24} color={COLORS.primary} />
                            )}
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
        paddingTop: 30, 
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
        width: 40, 
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