import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Share,
  Modal,
  Image,
  SectionList 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, COLORS } from '../components/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getDisplayName } from '../utils/formatName';

// --- CONFIGURAÇÃO DOS AVATARES ---
const AVATAR_SECTIONS = [
  {
    title: 'Animais Fofos',
    data: [
      { id: 'ani_1', type: 'image', source: require('../../assets/images/avatares/avatar_animais/bicho_com_cabelo.jpg') },
      { id: 'ani_2', type: 'image', source: require('../../assets/images/avatares/avatar_animais/gato.jpg') },
      { id: 'ani_3', type: 'image', source: require('../../assets/images/avatares/avatar_animais/raposa.jpg') },
      { id: 'ani_5', type: 'image', source: require('../../assets/images/avatares/avatar_animais/jacare.jpg') },
      { id: 'ani_6', type: 'image', source: require('../../assets/images/avatares/avatar_animais/koala.jpg') },
    ]
  },
  {
    title: 'Frutinhas do Bebê',
    data: [
      { id: 'fruta_1', type: 'image', source: require('../../assets/images/avatares/avatar_frutas/azeitona.png') },
      { id: 'fruta_2', type: 'image', source: require('../../assets/images/avatares/avatar_frutas/berinjela.png') },
      { id: 'fruta_3', type: 'image', source: require('../../assets/images/avatares/avatar_frutas/jaca.png') },
      { id: 'fruta_4', type: 'image', source: require('../../assets/images/avatares/avatar_frutas/maca.png') },
      { id: 'fruta_5', type: 'image', source: require('../../assets/images/avatares/avatar_frutas/manga.png') },
      { id: 'fruta_6', type: 'image', source: require('../../assets/images/avatares/avatar_frutas/melancia.png') },
      { id: 'fruta_7', type: 'image', source: require('../../assets/images/avatares/avatar_frutas/melao.png') },
      { id: 'fruta_8', type: 'image', source: require('../../assets/images/avatares/avatar_frutas/repolho.png') },
      { id: 'fruta_9', type: 'image', source: require('../../assets/images/avatares/avatar_frutas/semente.png') },
    ]
  },
  {
    title: 'Ícones Padrão',
    data: [
      { id: 'icon_1', type: 'icon', source: 'person-circle-outline', color: COLORS.primary },
      { id: 'icon_2', type: 'icon', source: 'happy-outline', color: '#E91E63' },
      { id: 'icon_3', type: 'icon', source: 'heart-circle-outline', color: '#F44336' },
    ]
  }
];

export default function ProfileScreen({ navigation }) {
  const { signOut, userProfile, updateUserProfile } = useAuth(); 
  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);

  const displayName = getDisplayName(userProfile);
  
  const currentAvatar = userProfile?.avatar || { type: 'icon', source: 'person-circle-outline', color: COLORS.primary };

  const onShare = async () => {
    const appLink = "https://play.google.com/store/apps/details?id=com.exemplo";
    try {
      await Share.share({
        title: 'Conheça o meu App de Gravidez!',
        message: `Estou usando este app para acompanhar minha gravidez! Baixe você também:\n\n${appLink}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectAvatar = (avatar) => {
    updateUserProfile({ avatar: avatar });
    setAvatarModalVisible(false);
  };

  const renderAvatar = (avatar, size = 80) => {
    if (avatar && avatar.type === 'image') {
       return <Image source={avatar.source} style={{ width: size, height: size, borderRadius: size/2, borderWidth: 2, borderColor: '#fff', backgroundColor: '#f0f0f0' }} resizeMode="cover" />;
    }
    const iconName = avatar?.source || 'person-circle-outline';
    const iconColor = avatar?.color || COLORS.primary;
    return <Ionicons name={iconName} size={size} color={iconColor} />;
  };

  const renderGridItem = ({ item }) => (
    <TouchableOpacity 
        style={[
          styles.avatarOption, 
          (currentAvatar.id === item.id) && styles.avatarOptionSelected
        ]} 
        onPress={() => handleSelectAvatar(item)}
    >
        {renderAvatar(item, 60)}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={true} overScrollMode="always">
        {}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
             {renderAvatar(currentAvatar, 100)}
             <TouchableOpacity style={styles.editIconBadge} onPress={() => setAvatarModalVisible(true)}>
                <Ionicons name="camera" size={18} color="white" />
             </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{userProfile?.email || 'email@carregando...'}</Text>
        </View>

        <View style={styles.contentContainer}>
          {}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Configurações Gerais</Text>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => setAvatarModalVisible(true)}>
              <Ionicons name="camera-outline" size={24} color={COLORS.text}/>
              <Text style={styles.menuText}>Alterar Foto de Perfil</Text>
              <Ionicons name="chevron-forward" size={24} color={COLORS.gray}/>
            </TouchableOpacity>

            {}
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ChangePassword')}>
              <Ionicons name="lock-closed-outline" size={24} color={COLORS.text}/>
              <Text style={styles.menuText}>Alterar Senha</Text>
              <Ionicons name="chevron-forward" size={24} color={COLORS.gray}/>
            </TouchableOpacity>
          </View>

          {}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Informações</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AboutScreen')}>
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

          <TouchableOpacity style={[commonStyles.button, { marginTop: 20, backgroundColor: '#D32F2F' }]} onPress={signOut}>
            <Text style={commonStyles.buttonText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {}
      <Modal animationType="slide" transparent={true} visible={isAvatarModalVisible} onRequestClose={() => setAvatarModalVisible(false)}>
        <View style={styles.modalOverlay}>
           <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                 <Text style={styles.modalTitle}>Escolha seu Avatar</Text>
                 <TouchableOpacity onPress={() => setAvatarModalVisible(false)}>
                    <Ionicons name="close" size={24} color={COLORS.gray} />
                 </TouchableOpacity>
              </View>
              
              <SectionList
                sections={AVATAR_SECTIONS}
                keyExtractor={(item, index) => item.id + index}
                renderItem={({ item, section, index }) => {
                  if (index % 3 === 0) {
                    const item1 = section.data[index];
                    const item2 = section.data[index + 1];
                    const item3 = section.data[index + 2];
                    return (
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        {item1 && renderGridItem({ item: item1 })}
                        {item2 && renderGridItem({ item: item2 })}
                        {item3 && renderGridItem({ item: item3 })}
                      </View>
                    );
                  }
                  return null;
                }}
                renderSectionHeader={({ section: { title } }) => (
                  <Text style={styles.modalSectionTitle}>{title}</Text>
                )}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
              />
           </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.lightGray },
  header: { backgroundColor: COLORS.white, paddingVertical: 30, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, marginBottom: 15 },
  avatarContainer: { position: 'relative', marginBottom: 15, padding: 5, backgroundColor: '#f0f0f0', borderRadius: 100 },
  editIconBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.primary, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'white' },
  contentContainer: { padding: 20 },
  userName: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  userEmail: { fontSize: 14, color: COLORS.gray, marginTop: 4 },
  menuSection: { backgroundColor: COLORS.white, marginBottom: 20, borderRadius: 16, overflow: 'hidden', paddingVertical: 5, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#999', paddingHorizontal: 20, paddingTop: 15, paddingBottom: 5, textTransform: 'uppercase', letterSpacing: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
  menuText: { flex: 1, marginLeft: 15, fontSize: 16, color: COLORS.text, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingHorizontal: 20, paddingTop: 20, height: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  modalSectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginTop: 15, marginBottom: 10, backgroundColor: 'white' },
  avatarOption: { width: '30%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', margin: '1.5%', borderRadius: 15, borderWidth: 2, borderColor: '#eee', backgroundColor: '#f8f8f8' },
  avatarOptionSelected: { borderColor: COLORS.primary, backgroundColor: '#eef6ff' },
});