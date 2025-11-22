import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    TouchableOpacity,
    StatusBar,
    Modal,
    TextInput,
    Alert,
    ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../components/commonStyles';
import { useAuth } from '../context/AuthContext';

const CONSULTA_TIPOS_LISTA = [
    'Consulta de Rotina',
    'Ultrassom (1º Trimestre)',
    'Ultrassom Morfológico',
    'Exames de Sangue',
    'Exame de Glicose',
];
const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const shortDayNames = ["D", "S", "T", "Q", "Q", "S", "S"];

// Componente de Status
const StatusTag = ({ status }) => {
    let corFundo = '#eee', corTexto = '#333', texto = status;
    switch (status) {
        case 'finalizada': corFundo = '#E6F4EA'; corTexto = '#006422'; texto = 'Finalizada'; break;
        case 'andamento': corFundo = '#E6F0F8'; corTexto = '#00529B'; texto = 'Próxima'; break;
        case 'remarcada': corFundo = '#FFF4E6'; corTexto = '#B75500'; texto = 'Remarcada'; break;
        case 'cancelada_medico': corFundo = '#FDEBEB'; corTexto = '#A30000'; texto = 'Cancelada (Médico)'; break;
        case 'cancelada_usuario': corFundo = '#FDEBEB'; corTexto = '#A30000'; texto = 'Cancelada (Você)'; break;
    }
    return (
        <View style={[styles.statusTag, { backgroundColor: corFundo }]}>
            <Text style={[styles.statusTagText, { color: corTexto }]}>{texto}</Text>
        </View>
    );
};

const ConsultasScreen = ({ navigation }) => {
    const { addAppointment, appointments, updateAppointmentStatus } = useAuth();
    
    const [filteredConsultas, setFilteredConsultas] = useState([]);
    
    // Modais
    const [isRequestModalVisible, setRequestModalVisible] = useState(false);
    const [isCancelModalVisible, setCancelModalVisible] = useState(false);
    
    // Pickers
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [isTimePickerVisible, setTimePickerVisible] = useState(false);
    const [isConsultaPickerVisible, setConsultaPickerVisible] = useState(false);
    
    // Estados de Seleção
    const [selectedConsulta, setSelectedConsulta] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    
    // Estados de Nova Consulta
    const [consultaTipo, setConsultaTipo] = useState(null);
    const [consultaTipoOutro, setConsultaTipoOutro] = useState('');
    const [consultaData, setConsultaData] = useState(new Date());
    const [consultaHora, setConsultaHora] = useState(null);
    
    // Calendário Auxiliar
    const [pickerDate, setPickerDate] = useState(new Date());

    // Atualiza lista quando appointments muda
    useEffect(() => {
        // Filtra apenas o que é consulta ou exame (ignora lembretes puros se houver)
        // Se quiser mostrar tudo, remova o filter
        const f = appointments.filter(app => !app.type || app.type === 'consulta' || app.type === 'exame');
        
        // Ordena por data
        f.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
        });
        
        setFilteredConsultas(f);
    }, [appointments]);

    // --- Geração de Dados ---
    const generateTimeSlots = () => {
        const slots = [];
        for (let h = 7; h < 20; h++) {
            for (let m = 0; m < 60; m += 30) {
                const hour = h < 10 ? `0${h}` : h;
                const minute = m < 10 ? `0${m}` : m;
                slots.push(`${hour}:${minute}`);
            }
        }
        return slots;
    };
    const timeSlots = generateTimeSlots();

    const generateCalendar = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const calendarDays = [];
        for (let i = 0; i < firstDayOfMonth; i++) { calendarDays.push({ key: `blank-${i}`, day: '' }); }
        for (let i = 1; i <= daysInMonth; i++) {
            calendarDays.push({ key: `day-${i}`, day: i });
        }
        return calendarDays;
    };
    const miniCalendarDays = generateCalendar(pickerDate);

    // --- Handlers ---
    const handleRequestAppointment = () => {
        let tipoFinal = consultaTipo;
        if (consultaTipo === 'Outro') {
            if (!consultaTipoOutro.trim()) {
                Alert.alert('Atenção', 'Por favor, descreva o tipo de consulta.');
                return;
            }
            tipoFinal = consultaTipoOutro.trim();
        }
        
        if (!tipoFinal || !consultaData || !consultaHora) {
            Alert.alert('Campos Incompletos', 'Por favor, selecione o tipo, a data e a hora.');
            return;
        }
        
        const novaConsulta = {
            title: tipoFinal,
            date: consultaData, // O AuthContext vai converter pra string
            time: consultaHora,
            doctor: 'A confirmar', 
            status: 'andamento',
            type: 'consulta'
        };
        
        addAppointment(novaConsulta);
        setRequestModalVisible(false);
        Alert.alert('Sucesso', 'Consulta adicionada à sua agenda!');
    };
    
    const handleCancelAppointment = () => {
        if (!cancelReason) {
            Alert.alert('Atenção', 'Selecione um motivo.');
            return;
        }
        updateAppointmentStatus(selectedConsulta.id, 'cancelada_usuario', cancelReason);
        setCancelModalVisible(false);
    };

    const openCancelModal = (consulta) => {
        setSelectedConsulta(consulta);
        setCancelReason('');
        setCancelModalVisible(true);
    };
    
    const openRequestModal = () => {
        setConsultaTipo(null);
        setConsultaTipoOutro('');
        setConsultaData(new Date());
        setConsultaHora(null);
        setPickerDate(new Date());
        setRequestModalVisible(true);
    };

    // --- Renderizadores ---
    const renderConsultaItem = ({ item }) => {
        // Tratamento de data seguro para evitar tela branca
        let dateDisplay = 'Data inválida';
        try {
            // Tenta criar data se vier como string YYYY-MM-DD
            const dateObj = new Date(item.date + 'T00:00:00'); 
            if (!isNaN(dateObj.getTime())) {
                dateDisplay = dateObj.toLocaleDateString('pt-BR');
            } else {
                // Fallback
                dateDisplay = item.date; 
            }
        } catch (e) { dateDisplay = item.date }

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <StatusTag status={item.status} />
                </View>
                <View style={styles.cardBody}>
                    <Text style={styles.cardText}><Ionicons name="calendar-outline" size={16} /> {dateDisplay}</Text>
                    <Text style={styles.cardText}><Ionicons name="time-outline" size={16} /> {item.time}</Text>
                    <Text style={styles.cardText}><Ionicons name="medkit-outline" size={16} /> {item.doctor}</Text>
                    
                    {item.status === 'cancelada_usuario' && (
                        <Text style={styles.cardInfoText}>Motivo: {item.motivoCancelamento}</Text>
                    )}
                </View>
                
                {item.status === 'andamento' && (
                    <TouchableOpacity style={styles.cancelButton} onPress={() => openCancelModal(item)}>
                        <Text style={styles.cancelButtonText}>Cancelar Consulta</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Minhas Consultas</Text>
            </View>
            
            {/* Lista */}
            <FlatList
                data={filteredConsultas}
                renderItem={renderConsultaItem}
                keyExtractor={(item) => item.id}
                style={styles.list}
                contentContainerStyle={{ paddingBottom: 80 }}
                ListEmptyComponent={() => (
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Ionicons name="calendar-outline" size={50} color="#ccc" />
                        <Text style={styles.emptyText}>Nenhuma consulta agendada.</Text>
                    </View>
                )}
            />
            
            {/* FAB (Botão Flutuante) */}
            <TouchableOpacity style={styles.fab} onPress={openRequestModal}>
                <Ionicons name="add" size={32} color={COLORS.white} />
            </TouchableOpacity>

            {/* --- MODAIS --- */}
            
            {/* Modal Solicitar */}
            <Modal animationType="slide" transparent={true} visible={isRequestModalVisible} onRequestClose={() => setRequestModalVisible(false)}>
                <View style={styles.modalBackdrop}>
                    <ScrollView style={styles.modalScrollView} contentContainerStyle={styles.modalScrollContent}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Nova Consulta</Text>
                            
                            <Text style={styles.label}>Tipo</Text>
                            <TouchableOpacity style={styles.inputButton} onPress={() => setConsultaPickerVisible(true)}>
                                <Text style={{ color: consultaTipo ? COLORS.text : '#999' }}>
                                    {consultaTipo || 'Selecione o tipo'}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#999" />
                            </TouchableOpacity>
                            
                            {consultaTipo === 'Outro' && (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Descreva a consulta"
                                    value={consultaTipoOutro}
                                    onChangeText={setConsultaTipoOutro}
                                />
                            )}
                            
                            <Text style={styles.label}>Data</Text>
                            <TouchableOpacity style={styles.inputButton} onPress={() => setDatePickerVisible(true)}>
                                <Text>{consultaData.toLocaleDateString('pt-BR')}</Text>
                                <Ionicons name="calendar" size={20} color={COLORS.primary} />
                            </TouchableOpacity>

                            <Text style={styles.label}>Hora</Text>
                            <TouchableOpacity style={styles.inputButton} onPress={() => setTimePickerVisible(true)}>
                                <Text>{consultaHora || 'Selecione a hora'}</Text>
                                <Ionicons name="time" size={20} color={COLORS.primary} />
                            </TouchableOpacity>

                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#ddd', marginRight: 10 }]} onPress={() => setRequestModalVisible(false)}>
                                    <Text style={{ color: '#333' }}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalButton, { backgroundColor: COLORS.primary }]} onPress={handleRequestAppointment}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Salvar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {/* Modal DatePicker Customizado */}
            <Modal transparent={true} visible={isDatePickerVisible} animationType="fade" onRequestClose={() => setDatePickerVisible(false)}>
                <TouchableOpacity style={styles.pickerOverlay} onPress={() => setDatePickerVisible(false)}>
                    <View style={styles.miniCalendarContainer} onStartShouldSetResponder={() => true}>
                        <View style={styles.miniCalendarHeader}>
                             <TouchableOpacity onPress={() => setPickerDate(new Date(pickerDate.setMonth(pickerDate.getMonth() - 1)))}>
                                <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
                             </TouchableOpacity>
                             <Text style={styles.miniCalendarMonthText}>{monthNames[pickerDate.getMonth()]} {pickerDate.getFullYear()}</Text>
                             <TouchableOpacity onPress={() => setPickerDate(new Date(pickerDate.setMonth(pickerDate.getMonth() + 1)))}>
                                <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
                             </TouchableOpacity>
                        </View>
                        <View style={styles.miniCalendarDaysGrid}>
                             {miniCalendarDays.map((d, i) => (
                                 <TouchableOpacity 
                                    key={i} 
                                    style={[styles.miniCalendarDay, d.day === '' && { backgroundColor: 'transparent' }]} 
                                    disabled={d.day === ''}
                                    onPress={() => {
                                        const newDate = new Date(pickerDate.getFullYear(), pickerDate.getMonth(), d.day);
                                        setConsultaData(newDate);
                                        setDatePickerVisible(false);
                                    }}
                                 >
                                     <Text style={styles.miniCalendarDayText}>{d.day}</Text>
                                 </TouchableOpacity>
                             ))}
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Modal TimePicker */}
            <Modal transparent={true} visible={isTimePickerVisible} animationType="fade" onRequestClose={() => setTimePickerVisible(false)}>
                 <TouchableOpacity style={styles.pickerOverlay} onPress={() => setTimePickerVisible(false)}>
                     <View style={styles.timePickerContainer}>
                         <FlatList 
                             data={timeSlots}
                             keyExtractor={item => item}
                             renderItem={({ item }) => (
                                 <TouchableOpacity style={styles.timeSlot} onPress={() => { setConsultaHora(item); setTimePickerVisible(false); }}>
                                     <Text style={styles.timeSlotText}>{item}</Text>
                                 </TouchableOpacity>
                             )}
                         />
                     </View>
                 </TouchableOpacity>
            </Modal>

             {/* Modal Tipo Consulta */}
             <Modal transparent={true} visible={isConsultaPickerVisible} animationType="fade" onRequestClose={() => setConsultaPickerVisible(false)}>
                 <TouchableOpacity style={styles.pickerOverlay} onPress={() => setConsultaPickerVisible(false)}>
                     <View style={styles.timePickerContainer}>
                         <FlatList 
                             data={[...CONSULTA_TIPOS_LISTA, 'Outro']}
                             keyExtractor={item => item}
                             renderItem={({ item }) => (
                                 <TouchableOpacity style={styles.timeSlot} onPress={() => { 
                                     setConsultaTipo(item); 
                                     if(item !== 'Outro') setConsultaTipoOutro('');
                                     setConsultaPickerVisible(false); 
                                  }}>
                                     <Text style={styles.timeSlotText}>{item}</Text>
                                 </TouchableOpacity>
                             )}
                         />
                     </View>
                 </TouchableOpacity>
            </Modal>
            
            {/* Modal Cancelar */}
            <Modal transparent={true} visible={isCancelModalVisible} animationType="fade" onRequestClose={() => setCancelModalVisible(false)}>
                <TouchableOpacity style={styles.pickerOverlay} onPress={() => setCancelModalVisible(false)} activeOpacity={1}>
                    <View style={styles.modalContent}>
                        <Text style={[styles.modalTitle, { color: '#D32F2F' }]}>Cancelar Consulta?</Text>
                        <Text style={{ marginBottom: 15 }}>Selecione o motivo:</Text>
                        {['Imprevisto', 'Melhora dos sintomas', 'Outro'].map(reason => (
                            <TouchableOpacity key={reason} onPress={() => setCancelReason(reason)} style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name={cancelReason === reason ? "radio-button-on" : "radio-button-off"} size={20} color={COLORS.primary} />
                                <Text style={{ marginLeft: 10 }}>{reason}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity 
                            style={[styles.modalButton, { backgroundColor: '#D32F2F', marginTop: 20 }]} 
                            onPress={handleCancelAppointment}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Confirmar Cancelamento</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.lightGray },
    header: { backgroundColor: COLORS.primary, paddingHorizontal: 15, paddingTop: 20, paddingBottom: 20, flexDirection: 'row', alignItems: 'center' },
    backButton: { padding: 5, marginRight: 15 },
    headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: 'bold' },
    list: { flex: 1 },
    emptyText: { color: '#888', marginTop: 10, fontSize: 16 },
    
    // Cards
    card: { backgroundColor: COLORS.white, borderRadius: 12, padding: 15, marginHorizontal: 20, marginBottom: 15, elevation: 3 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, flex: 1 },
    cardBody: { marginBottom: 10 },
    cardText: { fontSize: 14, color: '#555', marginBottom: 4 },
    cardInfoText: { fontSize: 12, color: '#D32F2F', fontStyle: 'italic' },
    
    statusTag: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12 },
    statusTagText: { fontSize: 10, fontWeight: 'bold' },
    
    cancelButton: { alignSelf: 'flex-start', paddingVertical: 5 },
    cancelButtonText: { color: '#D32F2F', fontSize: 12, fontWeight: '600' },

    // FAB
    fab: { position: 'absolute', bottom: 25, right: 25, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', elevation: 6 },
    
    // Modais
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: 'white', borderRadius: 15, padding: 20, width: '90%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginBottom: 15, textAlign: 'center' },
    label: { fontSize: 14, color: '#666', marginBottom: 5, marginTop: 10 },
    inputButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, backgroundColor: '#f9f9f9' },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, backgroundColor: '#f9f9f9', fontSize: 16 },
    modalButton: { padding: 15, borderRadius: 8, alignItems: 'center', flex: 1, justifyContent: 'center' },
    
    // Pickers
    pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    miniCalendarContainer: { backgroundColor: 'white', width: '85%', borderRadius: 15, padding: 15, elevation: 5 },
    miniCalendarHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' },
    miniCalendarMonthText: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
    miniCalendarDaysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    miniCalendarDay: { width: '14.2%', height: 35, justifyContent: 'center', alignItems: 'center' },
    miniCalendarDayText: { color: '#333' },
    
    timePickerContainer: { backgroundColor: 'white', width: '70%', maxHeight: 300, borderRadius: 10 },
    timeSlot: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
    timeSlotText: { fontSize: 16, color: '#333' }
});

export default ConsultasScreen;