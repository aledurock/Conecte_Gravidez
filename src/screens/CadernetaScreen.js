import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { commonStyles, COLORS } from '../components/commonStyles';

export default function CadernetaScreen() {
  const { isProfileComplete } = useAuth();

  return (
    <View style={commonStyles.container}>
      {isProfileComplete ? (
        <ScrollView style={{width: '100%'}}>
            <Text style={styles.title}>Identificação</Text>
            <View style={styles.card}>
                <Text style={styles.field}><Text style={styles.label}>Número do cartão SUS:</Text> XXX</Text>
                <Text style={styles.field}><Text style={styles.label}>Nome:</Text> Maria da Silva</Text>
                <Text style={styles.field}><Text style={styles.label}>Data de Nascimento:</Text> XX/XX/XXXX</Text>
                <Text style={styles.field}><Text style={styles.label}>Raça:</Text> Parda</Text>
                {/* ...outros campos aqui */}
            </View>
        </ScrollView>
      ) : (
        <View style={styles.centered}>
            <Text style={styles.warningText}>
                Por favor, complete o cadastro para mostrar a identificação da caderneta.
            </Text>
            <Button title="Completar Cadastro Agora" onPress={() => alert('Navegar para a tela de perfil/edição')} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 20,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 20,
        width: '100%',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    field: {
        fontSize: 16,
        marginBottom: 10,
        color: COLORS.text,
    },
    label: {
        fontWeight: 'bold',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    warningText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        color: COLORS.text,
    }
});