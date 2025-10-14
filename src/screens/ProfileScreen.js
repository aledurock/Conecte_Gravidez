import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { commonStyles, COLORS } from '../components/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';


export default function ProfileScreen() {
    const { signOut } = useAuth();

  return (
    <ScrollView style={styles.container}>
        <View style={styles.header}>
            <Ionicons name="person-circle-outline" size={80} color={COLORS.primary} />
            <Text style={styles.userName}>Usuário</Text>
            <Text style={styles.userEmail}>email@exemplo.com</Text>
        </View>

        <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Configurações Gerais</Text>
            <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="moon-outline" size={24} color={COLORS.text}/>
                <Text style={styles.menuText}>Modo Escuro e Claro</Text>
                <Ionicons name="chevron-forward" size={24} color={COLORS.gray}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="lock-closed-outline" size={24} color={COLORS.text}/>
                <Text style={styles.menuText}>Alterar Senha</Text>
                <Ionicons name="chevron-forward" size={24} color={COLORS.gray}/>
            </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Informações</Text>
             <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="information-circle-outline" size={24} color={COLORS.text}/>
                <Text style={styles.menuText}>Sobre o App</Text>
                <Ionicons name="chevron-forward" size={24} color={COLORS.gray}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="share-social-outline" size={24} color={COLORS.text}/>
                <Text style={styles.menuText}>Compartilhar o App</Text>
                <Ionicons name="chevron-forward" size={24} color={COLORS.gray}/>
            </TouchableOpacity>
        </View>

        <TouchableOpacity style={commonStyles.button} onPress={signOut}>
            <Text style={commonStyles.buttonText}>Trocar Usuário (Sair)</Text>
        </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray,
    },
    header: {
        backgroundColor: COLORS.white,
        paddingVertical: 30,
        alignItems: 'center',
        marginBottom: 10,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
    },
    userEmail: {
        fontSize: 16,
        color: COLORS.gray,
    },
    menuSection: {
        backgroundColor: COLORS.white,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.gray,
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    menuText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
    }
});