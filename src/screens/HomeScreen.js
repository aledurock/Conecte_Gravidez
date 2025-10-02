import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../components/commonStyles'; // Verifique se este caminho está certo para seu projeto

const categories = [
    { name: 'Consultas', icon: 'pulse', isVector: true },
    // AQUI ESTÁ A LINHA CORRIGIDA
    { name: 'Dentes', icon: require('../../assets/icons/cara-feliz.png'), isVector: false }, 
    { name: 'Vacinas', icon: 'eyedrop', isVector: true },
    { name: 'Caderneta', icon: 'book', isVector: true },
    { name: 'Emergência', icon: 'medkit', isVector: true },
    { name: 'Exames', icon: 'flask', isVector: true },
];

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="person-circle" size={50} color={COLORS.white} />
                <Text style={styles.welcomeText}>Bem-Vindo(a) Usuário</Text>
            </View>

            <View style={styles.searchContainer}>
                <TextInput style={styles.searchInput} placeholder="Procurar..." />
                <Ionicons name="search" size={24} color={COLORS.gray} />
            </View>

            <View style={styles.categoriesSection}>
                <Text style={styles.sectionTitle}>Categorias</Text>
                <View style={styles.categoriesGrid}>
                    {categories.map((cat) => (
                        <TouchableOpacity 
                            key={cat.name} 
                            style={styles.categoryCard}
                            onPress={() => cat.name === 'Caderneta' && navigation.navigate('Caderneta')}
                        >
                            {cat.isVector ? (
                                <Ionicons name={cat.icon} size={40} color={COLORS.primary} />
                            ) : (
                                <Image source={cat.icon} style={styles.categoryIcon} />
                            )}
                            <Text style={styles.categoryText}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Últimas Consultas</Text>
                <Text style={styles.placeholderText}>Nenhuma consulta recente.</Text>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.primary },
    container: { flex: 1, backgroundColor: COLORS.lightGray },
    header: {
        backgroundColor: COLORS.primary,
        padding: 20,
        paddingTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
    },
    welcomeText: { color: COLORS.white, fontSize: 18, marginLeft: 15 },
    searchContainer: {
        backgroundColor: COLORS.primary,
        padding: 20,
        paddingTop: 0,
    },
    searchInput: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
    },
    categoriesSection: { padding: 20 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: COLORS.text },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryCard: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: COLORS.white,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    categoryIcon: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    categoryText: { marginTop: 5, fontWeight: '500', color: COLORS.text },
    section: { padding: 20, paddingTop: 0 },
    placeholderText: { color: COLORS.gray, fontStyle: 'italic' },
});