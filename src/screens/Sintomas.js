import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    TouchableOpacity,
    StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../components/commonStyles';
import { useAuth } from '../context/AuthContext'; // <<< NOVO IMPORT

// --- DADOS DE EXEMPLO (MOCK) ---
// NÃO PRECISAMOS MAIS DISSO AQUI!
// const DUMMY_SINTOMAS = [ ... ];
// ---------------------------------


// Componente para renderizar cada item da lista
// (Nenhuma mudança necessária neste componente)
const SintomaItem = ({ item }) => {
    
    const getIntensityColor = () => {
        if (item.intensidade === 'leve') return '#28a745'; 
        if (item.intensidade === 'moderado') return '#ffc107'; 
        if (item.intensidade === 'intenso') return '#dc3545'; 
        return COLORS.text;
    };

    return (
        <View style={styles.card}>
            <View style={styles.symptomHeader}>
                <Text style={styles.symptomTitle}>{item.sintoma}</Text>
                <Text style={styles.symptomDate}>{item.data}</Text>
            </View>
            <Text style={styles.symptomNotes}>
                <Text style={{fontWeight: 'bold'}}>Intensidade: </Text>
                <Text style={{ color: getIntensityColor(), fontWeight: 'bold' }}>
                    {item.intensidade.toUpperCase()}
                </Text>
            </Text>
            {item.notas && (
                <Text style={styles.symptomNotes}>
                    <Text style={{fontWeight: 'bold'}}>Anotações: </Text>{item.notas}
                </Text>
            )}

            <View style={styles.feedbackContainer}>
                <View style={styles.feedbackHeader}>
                    <Ionicons name="medkit-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.feedbackTitle}>Feedback do Doutor</Text>
                </View>
                
                {item.feedback ? (
                    <Text style={styles.feedbackText}>{item.feedback}</Text>
                ) : (
                    <Text style={styles.feedbackEmpty}>Aguardando feedback...</Text>
                )}
            </View>
        </View>
    );
};


const SintomasScreen = ({ navigation }) => {
    // *** LINHA ATUALIZADA ***
    const { sintomas } = useAuth(); // Pegamos a lista real do Context

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Histórico de Sintomas</Text>
            </View>

            {}
            <FlatList
                data={sintomas} // Usando a lista do Context
                renderItem={SintomaItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Você ainda não relatou nenhum sintoma.</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

// ... (SEUS ESTILOS PERMANECEM IGUAIS) ...
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
    listContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 4,
    },
    symptomHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    symptomTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        flex: 1, 
    },
    symptomDate: {
        fontSize: 14,
        color: '#666',
        marginLeft: 10,
    },
    symptomNotes: {
        fontSize: 15,
        color: COLORS.text,
        lineHeight: 22,
        marginBottom: 5,
    },
    feedbackContainer: {
        backgroundColor: '#F0F5FF', 
        borderRadius: 10,
        padding: 15,
        marginTop: 15,
        borderWidth: 1,
        borderColor: '#D6E4FF'
    },
    feedbackHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    feedbackTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginLeft: 8,
    },
    feedbackText: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
    },
    feedbackEmpty: {
        fontSize: 15,
        color: '#777',
        fontStyle: 'italic',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#777',
    }
});

export default SintomasScreen;