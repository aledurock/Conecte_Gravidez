import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, COLORS } from '../components/commonStyles';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.section}>
          <Text style={styles.title}>Sobre este Projeto</Text>
          <Text style={styles.text}>
            Este aplicativo é um projeto da faculdade Estácio, do curso de Análise e Desenvolvimento de Sistemas.
          </Text>
          <Text style={styles.text}>
            Ele foi pensado e desenvolvido com o objetivo de aplicar nosso conhecimento acadêmico para criar uma ferramenta que possa, de alguma forma, ajudar a sociedade, oferecendo um companheiro digital para um momento tão especial como a gestação.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Equipe de Desenvolvimento</Text>
          
          <View style={styles.devRow}>
            <Ionicons name="person-circle-outline" size={28} color={COLORS.primary} />
            <View style={styles.devInfo}>
              <Text style={styles.devName}>Alessandro Barbosa</Text>
              <Text style={styles.devRole}>Desenvolvedor (DEV)</Text>
            </View>
          </View>
          
          <View style={styles.devRow}>
            <Ionicons name="person-circle-outline" size={28} color={COLORS.primary} />
            <View style={styles.devInfo}>
              <Text style={styles.devName}>Gabriela Sousa</Text>
              <Text style={styles.devRole}>Desenvolvedor (DEV)</Text>
            </View>
          </View>

          <View style={styles.devRow}>
            <Ionicons name="person-circle-outline" size={28} color={COLORS.primary} />
            <View style={styles.devInfo}>
              <Text style={styles.devName}>Vitoria Maelí</Text>
              <Text style={styles.devRole}>Documentação</Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightGray, // Fundo da tela
  },
  container: {
    padding: 20,
  },
  section: {
    backgroundColor: COLORS.white, // Fundo do card
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 10,
  },
  devRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  devInfo: {
    marginLeft: 15,
  },
  devName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  devRole: {
    fontSize: 14,
    color: COLORS.gray,
  }
});