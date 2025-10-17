import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, COLORS } from '../components/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';


export default function ProfileScreen() {
    const { signOut, userProfile } = useAuth();

    return (
        // 1. Adicionado SafeAreaView para consistência de layout
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                // 2. Adicionadas as propriedades para o efeito "esticado"
                bounces={true}
                overScrollMode="always"
            >
                <View style={styles.header}>
                    <Ionicons name="person-circle-outline" size={80} color={COLORS.primary} />
                    {/* 3. Nome e email agora são dinâmicos, como na HomeScreen */}
                    <Text style={styles.userName}>{userProfile?.name || 'Usuário'}</Text>
                    <Text style={styles.userEmail}>email@exemplo.com</Text>
                </View>

                {/* Adicionado um container para o conteúdo ter espaçamento */}
                <View style={styles.contentContainer}>
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

                    <TouchableOpacity style={[commonStyles.button, { marginTop: 20 }]} onPress={signOut}>
                        <Text style={commonStyles.buttonText}>Trocar Usuário (Sair)</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.lightGray,
    },
    header: {
        backgroundColor: COLORS.white,
        paddingVertical: 30,
        alignItems: 'center',
    },
    contentContainer: {
        padding: 20,
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
        marginBottom: 20,
        borderRadius: 10,
        overflow: 'hidden', // Garante que as bordas arredondadas sejam aplicadas
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.gray,
        paddingHorizontal: 15,
        paddingVertical: 10,
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

