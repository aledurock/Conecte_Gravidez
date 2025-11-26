import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TextInput, 
    TouchableOpacity,
    Alert,
    StatusBar,
    Image // <--- IMPORTANTE: Adicionado Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../components/commonStyles';

const RelatosSintomasScreen = ({ navigation }) => {
    const { addSintoma } = useAuth();
    
    const [sintoma, setSintoma] = useState('');
    const [intensidade, setIntensidade] = useState(null); 
    const [notas, setNotas] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSaveSymptom = async () => {
        if (!sintoma || !intensidade) {
            Alert.alert('Campos Obrigatórios', 'Por favor, preencha o sintoma e a intensidade.');
            return;
        }

        setLoading(true);

        const novoRelato = {
            sintoma: sintoma,
            intensidade: intensidade,
            notas: notas,
        };

        addSintoma(novoRelato);
        
        setLoading(false);
        Alert.alert('Sucesso', 'Sintoma relatado com sucesso!');
        
        setSintoma('');
        setIntensidade(null);
        setNotas('');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Relatar Sintomas</Text>

                <TouchableOpacity 
                    onPress={() => navigation.navigate('HistoricoSintomas')} 
                    style={styles.historyButton}
                >
                    {/* --- MUDANÇA AQUI: Ícone de Imagem Customizado --- */}
                    <Image 
                        source={require('../../assets/icons/historico-icon.png')}
                        style={{ width: 26, height: 26, tintColor: COLORS.white }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            <ScrollView 
                style={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                {/* Card de Input do Sintoma */}
                <View style={styles.card}>
                    <Text style={styles.label}>Qual sintoma você está sentindo?</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Enjoo, Dor nas costas, Cansaço..."
                        placeholderTextColor="#999"
                        value={sintoma}
                        onChangeText={setSintoma}
                    />
                </View>

                {/* Card de Intensidade */}
                <View style={styles.card}>
                    <Text style={styles.label}>Qual a intensidade?</Text>
                    <View style={styles.intensityContainer}>
                        {['Leve', 'Moderado', 'Intenso'].map((level) => (
                            <TouchableOpacity
                                key={level}
                                style={[
                                    styles.intensityButton,
                                    intensidade === level.toLowerCase() && styles.intensityButtonSelected
                                ]}
                                onPress={() => setIntensidade(level.toLowerCase())}
                            >
                                <Text style={[
                                    styles.intensityText,
                                    intensidade === level.toLowerCase() && styles.intensityTextSelected
                                ]}>
                                    {level}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Card de Anotações */}
                <View style={styles.card}>
                    <Text style={styles.label}>Anotações adicionais (opcional)</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Descreva com mais detalhes o que você sentiu, o horário, etc."
                        placeholderTextColor="#999"
                        value={notas}
                        onChangeText={setNotas}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                {/* Botão de Salvar */}
                <TouchableOpacity 
                    style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
                    onPress={handleSaveSymptom}
                    disabled={loading}
                >
                    <Text style={styles.saveButtonText}>
                        {loading ? 'Salvando...' : 'Salvar Relato'}
                    </Text>
                </TouchableOpacity>

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
        justifyContent: 'space-between', 
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 15, 
        flex: 1, 
    },
    historyButton: {
        padding: 5,
        marginRight: 5,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
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
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 10,
    },
    input: {
        backgroundColor: COLORS.lightGray,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        color: COLORS.text,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
        paddingTop: 15,
    },
    intensityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    intensityButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.primary,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    intensityButtonSelected: {
        backgroundColor: COLORS.primary,
    },
    intensityText: {
        color: COLORS.primary,
        fontSize: 15,
        fontWeight: '600',
    },
    intensityTextSelected: {
        color: COLORS.white,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    saveButtonDisabled: {
        backgroundColor: '#A9A9A9',
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default RelatosSintomasScreen;