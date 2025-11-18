import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  // Alert, // 👈 1. REMOVIDO (não precisamos mais)
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, COLORS } from '../components/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';


// 👈 2. ADICIONADO 'navigation' PARA PODER NAVEGAR
export default function ProfileScreen({ navigation }) {
  const { signOut, userProfile } = useAuth(); 

  // 👈 3. REMOVIDA A FUNÇÃO 'showAbout' (não é mais usada)

  // --- Função "Compartilhar" (Continua igual) ---
  const onShare = async () => {
    const appLink = "https://play.google.com/store/apps/details?id=com.exemplo";
    try {
      await Share.share({
        title: 'Conheça o meu App de Gravidez!',
        message: `Estou usando este app para acompanhar minha gravidez! Baixe você também:\n\n${appLink}\n\n(*Exemplo* de link)`,
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível abrir o compartilhamento.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="always"
      >
        <View style={styles.header}>
          <Ionicons name="person-circle-outline" size={80} color={COLORS.primary} />
          <Text style={styles.userName}>{userProfile?.name || 'Usuário'}</Text>
          <Text style={styles.userEmail}>{userProfile?.email || 'email@carregando...'}</Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Configurações Gerais</Text>
            
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="lock-closed-outline" size={24} color={COLORS.text}/>
              <Text style={styles.menuText}>Alterar Senha</Text>
              <Ionicons name="chevron-forward" size={24} color={COLORS.gray}/>
            </TouchableOpacity>
          </View>

          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Informações</Text>
            
            {/* --- 4. "Sobre o App" (AGORA NAVEGA) --- */}
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigation.navigate('AboutScreen')} // 👈 MUDANÇA AQUI
            >
              <Ionicons name="information-circle-outline" size={24} color={COLORS.text}/>
              <Text style={styles.menuText}>Sobre o App</Text>
              <Ionicons name="chevron-forward" size={24} color={COLORS.gray}/>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={onShare}>
              <Ionicons name="share-social-outline" size={24} color={COLORS.text}/>
              <Text style={styles.menuText}>Compartilhar o App</Text>
              <Ionicons name="chevron-forward" size={24} color={COLORS.gray}/>
            </TouchableOpacity>
          </View>

          {/* --- Botão de Sair (Continua igual) --- */}
          <TouchableOpacity style={[commonStyles.button, { marginTop: 20 }]} onPress={signOut}>
            <Text style={commonStyles.buttonText}>Trocar Usuário (Sair)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos (mantidos do seu código)
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
    overflow: 'hidden', 
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