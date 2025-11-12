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

const StatusTag = ({ status }) => {
    let corFundo, corTexto, texto;
    switch (status) {
        case 'finalizada': corFundo = '#E6F4EA'; corTexto = '#006422'; texto = 'Finalizada'; break;
        case 'andamento': corFundo = '#E6F0F8'; corTexto = '#00529B'; texto = 'Próxima'; break;
        case 'remarcada': corFundo = '#FFF4E6'; corTexto = '#B75500'; texto = 'Remarcada'; break;
        case 'cancelada_medico': corFundo = '#FDEBEB'; corTexto = '#A30000'; texto = 'Cancelada (Doutor)'; break;
        case 'cancelada_usuario': corFundo = '#FDEBEB'; corTexto = '#A30000'; texto = 'Cancelada (Você)'; break;
        default: return null;
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
    const [isCancelModalVisible, setCancelModalVisible] = useState(false);
    const [selectedConsulta, setSelectedConsulta] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [isRequestModalVisible, setRequestModalVisible] = useState(false);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [isTimePickerVisible, setTimePickerVisible] = useState(false);
    const [isConsultaPickerVisible, setConsultaPickerVisible] = useState(false);
    const [consultaTipo, setConsultaTipo] = useState(null);
    const [consultaTipoOutro, setConsultaTipoOutro] = useState('');
    const [consultaData, setConsultaData] = useState(new Date());
    const [consultaHora, setConsultaHora] = useState(null);
    const [pickerDate, setPickerDate] = useState(new Date());

    useEffect(() => {
        const f = appointments.filter(app => app.type === 'consulta' || app.type === 'exame');
        f.sort((a, b) => new Date(a.date) - new Date(b.date));
        setFilteredConsultas(f);
    }, [appointments]);

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

    const changePickerMonth = (amount) => {
        setPickerDate(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));
    };

    const handleDaySelect = (day) => {
        const newDate = new Date(pickerDate.getFullYear(), pickerDate.getMonth(), day);
        setConsultaData(newDate);
        setDatePickerVisible(false);
    };

    const handleTimeSelect = (time) => {
        setConsultaHora(time);
        setTimePickerVisible(false);
    };

    const handleConsultaTipoSelect = (tipo) => {
        setConsultaTipo(tipo);
        setConsultaPickerVisible(false);
    };

    const handleSelectOutro = () => {
        setConsultaTipo('Outro');
        setConsultaTipoOutro('');
    };

    const openRequestModal = () => {
        setConsultaTipo(null);
        setConsultaTipoOutro('');
        setConsultaData(new Date());
        setConsultaHora(null);
        setPickerDate(new Date());
        setRequestModalVisible(true);
    };

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
            Alert.alert('Campos Incompletos', 'Por favor, selecione o tipo, a data e a hora desejados.');
            return;
        }
        const novaConsulta = {
            title: tipoFinal,
            date: consultaData,
            time: consultaHora,
            doctor: 'A confirmar', 
            status: 'andamento'
        };
        addAppointment(novaConsulta);
        setRequestModalVisible(false);
        Alert.alert(
            'Solicitação Enviada', 
            `Sua consulta foi adicionada à sua agenda.\n\nTipo: ${tipoFinal}\nData: ${consultaData.toLocaleDateString('pt-BR')}\nHora: ${consultaHora}`
        );
    };
    
    const openCancelModal = (consulta) => {
        setSelectedConsulta(consulta);
        setCancelModalVisible(true);
        setCancelReason('');
    };

    const handleCancelAppointment = () => {
        if (!cancelReason) {
            Alert.alert('Atenção', 'Por favor, selecione um motivo para o cancelamento.');
            return;
        }
        updateAppointmentStatus(selectedConsulta.id, 'cancelada_usuario', cancelReason);
        setCancelModalVisible(false);
        Alert.alert('Consulta Cancelada', 'A sua consulta foi cancelada com sucesso.');
    };

    const renderConsultaItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <StatusTag status={item.status} />
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.cardText}><Ionicons name="calendar-outline" size={16} /> {new Date(item.date + 'T00:00:00').toLocaleDateString('pt-BR')}</Text>
                <Text style={styles.cardText}><Ionicons name="medkit-outline" size={16} /> {item.doctor}</Text>
                {item.status === 'remarcada' && (<Text style={styles.cardInfoText}>Data original: {item.dataOriginal}</Text>)}
                {item.status === 'cancelada_medico' && (<Text style={styles.cardInfoText}>Motivo: {item.motivoCancelamento}</Text>)}
            </View>
            {item.status === 'andamento' && (
                <TouchableOpacity style={styles.cancelButton} onPress={() => openCancelModal(item)}>
                    <Text style={styles.cancelButtonText}>Cancelar Consulta</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Minhas Consultas</Text>
            </View>
            <FlatList
                data={filteredConsultas}
                renderItem={renderConsultaItem}
                keyExtractor={(item) => item.id}
                style={styles.list}
                ListHeaderComponent={
                    <TouchableOpacity style={styles.requestButton} onPress={openRequestModal}>
                        <Ionicons name="add-circle-outline" size={20} color={COLORS.white} />
                        <Text style={styles.requestButtonText}>Solicitar Nova Consulta</Text>
                    </TouchableOpacity>
                }
                ListEmptyComponent={() => (<Text style={styles.emptyText}>Nenhuma consulta encontrada.</Text>)}
            />
            {/* Modal de Solicitar Consulta */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isRequestModalVisible}
                onRequestClose={() => setRequestModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <ScrollView style={styles.modalScrollView} contentContainerStyle={styles.modalScrollContent}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Solicitar Consulta</Text>
                            <Text style={styles.label}>1. Tipo de Consulta</Text>
                            <TouchableOpacity 
                                style={styles.datePickerButton} 
                                onPress={() => setConsultaPickerVisible(true)}
                            >
                                <Ionicons name="list-outline" size={20} color={COLORS.primary} />
                                <Text 
                                    style={[
                                        styles.datePickerButtonText,
                                        (consultaTipo === 'Outro' || !consultaTipo) && { color: '#999' }
                                    ]}
                                >
                                    {consultaTipo && consultaTipo !== 'Outro' ? consultaTipo : 'Consultas Disponíveis'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.reasonButton, consultaTipo === 'Outro' && styles.reasonButtonSelected]}
                                onPress={handleSelectOutro}
                            >
                                <Text style={[styles.reasonText, consultaTipo === 'Outro' && styles.reasonTextSelected]}>Outro</Text>
                            </TouchableOpacity>
                            {consultaTipo === 'Outro' && (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Descreva a consulta desejada"
                                    placeholderTextColor="#999"
                                    value={consultaTipoOutro}
                                    onChangeText={setConsultaTipoOutro}
                                />
                            )}
                            <Text style={styles.label}>2. Data e Hora de Preferência</Text>
                            <TouchableOpacity 
                                style={styles.datePickerButton} 
                                onPress={() => setDatePickerVisible(true)}
                            >
                                <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
                                <Text style={styles.datePickerButtonText}>
                                    {consultaData.toLocaleDateString('pt-BR')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.datePickerButton} 
                                onPress={() => setTimePickerVisible(true)}
                            >
                                <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                                <Text style={[styles.datePickerButtonText, !consultaHora && { color: '#999' }]}>
                                    {consultaHora || 'Selecionar horário'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButtonPrimary} onPress={handleRequestAppointment}>
                                <Text style={styles.modalButtonText}>Enviar Solicitação</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButtonSecondary} onPress={() => setRequestModalVisible(false)}>
                                <Text style={styles.modalButtonTextSecondary}>Voltar</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {/* Modal de Cancelar Consulta */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isCancelModalVisible}
                onRequestClose={() => setCancelModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Cancelar Consulta</Text>
                        <Text style={styles.modalSubtitle}>Consulta: {selectedConsulta?.title}</Text>
                        <Text style={styles.modalSubtitle}>Data: {selectedConsulta?.date ? new Date(selectedConsulta.date + 'T00:00:00').toLocaleDateString('pt-BR') : ''}</Text>
                        <Text style={styles.label}>Por favor, informe o motivo:</Text>
                        {['Conflito de agenda', 'Emergência pessoal', 'Outro'].map((reason) => (
                            <TouchableOpacity 
                                key={reason}
                                style={[styles.reasonButton, cancelReason === reason && styles.reasonButtonSelected]}
                                onPress={() => setCancelReason(reason)}
                            >
                                <Text style={[styles.reasonText, cancelReason === reason && styles.reasonTextSelected]}>{reason}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.modalButtonDanger} onPress={handleCancelAppointment}>
                            <Text style={styles.modalButtonText}>Confirmar Cancelamento</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButtonSecondary} onPress={() => setCancelModalVisible(false)}>
                            <Text style={styles.modalButtonTextSecondary}>Voltar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de DatePicker */}
            <Modal transparent={true} visible={isDatePickerVisible} animationType="fade">
                <TouchableOpacity style={styles.pickerOverlay} onPress={() => setDatePickerVisible(false)}>
                    <TouchableOpacity activeOpacity={1}>
                        <View style={styles.miniCalendarContainer}>
                            <View style={styles.miniCalendarHeader}>
                                <TouchableOpacity onPress={() => changePickerMonth(-1)}><Ionicons name="chevron-back" size={24} color={COLORS.primary} /></TouchableOpacity>
                                <Text style={styles.miniCalendarMonthText}>{`${monthNames[pickerDate.getMonth()]} de ${pickerDate.getFullYear()}`}</Text>
                                <TouchableOpacity onPress={() => changePickerMonth(1)}><Ionicons name="chevron-forward" size={24} color={COLORS.primary} /></TouchableOpacity>
                            </View>
                            <View style={styles.miniCalendarWeekDays}>{shortDayNames.map((day, index) => <Text key={index} style={styles.miniCalendarWeekDayText}>{day}</Text>)}</View>
                            <View style={styles.miniCalendarDaysGrid}>
                                {miniCalendarDays.map(d => (
                                    <TouchableOpacity key={d.key} style={styles.miniCalendarDayContainer} onPress={() => d.day && handleDaySelect(d.day)}>
                                        <View style={[styles.miniCalendarDay, d.day === consultaData.getDate() && pickerDate.getMonth() === consultaData.getMonth() && styles.selectedDay]}>
                                            <Text style={[styles.miniCalendarDayText, d.day === consultaData.getDate() && pickerDate.getMonth() === consultaData.getMonth() && styles.selectedDayText]}>{d.day}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Modal de TimePicker */}
            <Modal transparent={true} visible={isTimePickerVisible} animationType="fade">
                <TouchableOpacity style={styles.pickerOverlay} onPress={() => setTimePickerVisible(false)}>
                    <View style={styles.timePickerContainer}>
                        <FlatList 
                            data={timeSlots} 
                            keyExtractor={item => item} 
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleTimeSelect(item)}>
                                    <Text style={[styles.timeSlotText, consultaHora === item && styles.timeSlotTextSelected]}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Modal de Lista de Consultas */}
            <Modal transparent={true} visible={isConsultaPickerVisible} animationType="fade">
                <TouchableOpacity style={styles.pickerOverlay} onPress={() => setConsultaPickerVisible(false)}>
                    <View style={styles.timePickerContainer}>
                        <FlatList 
                            data={CONSULTA_TIPOS_LISTA}
                            keyExtractor={item => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleConsultaTipoSelect(item)}>
                                    <Text style={[styles.timeSlotText, consultaTipo === item && styles.timeSlotTextSelected]}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.lightGray },
    header: { backgroundColor: COLORS.primary, paddingHorizontal: 15, paddingTop: 30, paddingBottom: 20, flexDirection: 'row', alignItems: 'center' },
    backButton: { padding: 5, marginRight: 15 },
    headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: 'bold' },
    list: { flex: 1 },
    requestButton: { backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, margin: 20, borderRadius: 10, elevation: 4, shadowOpacity: 0.15, shadowRadius: 5, shadowOffset: { width: 0, height: 3 } },
    requestButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#777' },
    card: { backgroundColor: COLORS.white, borderRadius: 15, padding: 20, marginHorizontal: 20, marginBottom: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 5, elevation: 4 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, flex: 1, marginRight: 10 },
    cardBody: { marginBottom: 10 },
    cardText: { fontSize: 15, color: '#555', lineHeight: 22 },
    cardInfoText: { fontSize: 14, color: '#A30000', fontStyle: 'italic', marginTop: 5 },
    statusTag: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20 },
    statusTagText: { fontSize: 12, fontWeight: 'bold' },
    cancelButton: { backgroundColor: '#FDEBEB', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    cancelButtonText: { color: '#A30000', fontWeight: 'bold', fontSize: 14 },
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalScrollView: { width: '100%', flexGrow: 0 },
    modalScrollContent: { justifyContent: 'center', paddingVertical: 20 }, 
    modalContent: { backgroundColor: COLORS.white, borderRadius: 15, padding: 25, width: '100%', elevation: 10 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', marginBottom: 10 },
    modalSubtitle: { fontSize: 16, color: COLORS.text, textAlign: 'center', marginBottom: 20 },
    label: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 10, marginTop: 10 },
    input: { backgroundColor: COLORS.lightGray, borderRadius: 10, padding: 15, fontSize: 16, color: COLORS.text, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 15, marginTop: 5 },
    modalButtonPrimary:{ backgroundColor :COLORS.primary ,padding :15,borderRadius :10 ,alignItems :'center',marginTop :15},
    modalButtonDanger:{ backgroundColor :'#A30000',padding :15,borderRadius :10 ,alignItems :'center',marginTop :15},
    modalButtonText:{ color :COLORS.white ,fontSize :16,fontWeight :'bold'},
    modalButtonSecondary:{ backgroundColor :'transparent',padding :15,borderRadius :10 ,alignItems :'center',marginTop :5},
    modalButtonTextSecondary:{ color :COLORS.primary ,fontSize :16,fontWeight :'bold'},
    reasonButton:{ backgroundColor :COLORS.lightGray ,padding :12,borderRadius :8 ,borderWidth :1 ,borderColor :'#E0E0E0',marginBottom :10},
    reasonButtonSelected:{ backgroundColor :'#E6F0F8',borderColor :COLORS.primary},
    reasonText:{ color :COLORS.text ,textAlign :'center',fontSize :15,fontWeight :'500'},
    reasonTextSelected:{ color :COLORS.primary ,fontWeight :'bold'},
    datePickerButton:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor :COLORS.white,
        borderWidth :1,
        borderColor :'#E0E0E0',
        padding :15,
        borderRadius :10,
        marginBottom :15
    },
    datePickerButtonText:{
        fontSize :16,
        color :COLORS.text,
        marginLeft :10
    },
    pickerOverlay:{ flex :1 ,justifyContent :'center',alignItems :'center' ,backgroundColor :'rgba(0,0,0,0.5)' },
    miniCalendarContainer:{ backgroundColor :'white' ,padding :15 ,borderRadius :10 ,width :'90%' ,elevation :20 },
    miniCalendarHeader:{ flexDirection :'row' ,justifyContent :'space-between' ,alignItems :'center' ,marginBottom :10 },
    miniCalendarMonthText:{ fontWeight :'bold' ,fontSize :16 ,color :COLORS.primary},
    miniCalendarWeekDays:{ flexDirection :'row' ,justifyContent :'space-around' ,marginBottom :5},
    miniCalendarWeekDayText:{ fontSize :12 ,color :COLORS.gray ,fontWeight :'bold' ,width :'14.2%' ,textAlign :'center'},
    miniCalendarDaysGrid:{ flexDirection :'row' ,flexWrap :'wrap'},
    miniCalendarDayContainer:{ width :'14.2%' ,justifyContent :'center' ,alignItems :'center' ,height :35},
    miniCalendarDay:{ width :30 ,height :30 ,justifyContent :'center' ,alignItems :'center' ,borderRadius :15},
    miniCalendarDayText:{ fontSize :14 ,color :COLORS.text},
    selectedDay:{ backgroundColor :COLORS.primary},
    selectedDayText:{ color :COLORS.white ,fontWeight :'bold'},
    timePickerContainer:{
        backgroundColor:'white',
        padding :10,
        borderRadius :10,
        width:'80%',
        maxHeight :350
    },
    timeSlotText:{
        fontSize :16,
        paddingVertical :14,
        textAlign:'center',
        color :COLORS.text
    },
    timeSlotTextSelected:{
        fontSize :16,
        paddingVertical :14,
        textAlign:'center',
        color :COLORS.primary,
        fontWeight:'bold'
    }
});

export default ConsultasScreen;