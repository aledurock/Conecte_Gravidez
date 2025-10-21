import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, COLORS } from '../components/commonStyles';
import { Ionicons } from '@expo/vector-icons';

const initialAppointments = [
    { id: '1', date: '2025-10-01', title: 'Consulta Pré-Natal', doctor: 'Dr. Silva', time: '14:30', type: 'consulta' },
    { id: '2', date: '2025-10-17', title: 'Ultrassom Morfológico', doctor: 'Clínica Imagem', time: '09:00', type: 'exame' },
];

const AgendaScreen = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1));
    const [isYearPickerVisible, setYearPickerVisible] = useState(false);
    const [isMonthPickerVisible, setMonthPickerVisible] = useState(false);
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [isTimePickerVisible, setTimePickerVisible] = useState(false);
    const [isOptionsModalVisible, setOptionsModalVisible] = useState(false);
    
    const [appointments, setAppointments] = useState(initialAppointments);
    const [days, setDays] = useState([]);
    const [appointmentsForMonth, setAppointmentsForMonth] = useState([]);

    const [newReminder, setNewReminder] = useState({ title: '', description: '', date: new Date(), time: '10:45' });
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [pickerDate, setPickerDate] = useState(new Date(2025, 9, 1));

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const shortDayNames = ["D", "S", "T", "Q", "Q", "S", "S"];
    const shortMonthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

    useEffect(() => {
        generateCalendar(currentDate);
        filterAppointments(currentDate);
    }, [currentDate, appointments]);

    const generateCalendar = (date, forPicker = false) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const calendarDays = [];
        for (let i = 0; i < firstDayOfMonth; i++) { calendarDays.push({ key: `blank-${i}`, day: '' }); }
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDate = new Date(year, month, i);
            const isoDate = dayDate.toISOString().split('T')[0];
            // Verifica se existe ALGUM lembrete para este dia, não apenas o primeiro
            const hasReminder = appointments.some(app => app.date === isoDate && app.type === 'lembrete');
            calendarDays.push({ key: `day-${i}`, day: i, hasReminder });
        }
        if (forPicker) return calendarDays;
        setDays(calendarDays);
    };

    const filterAppointments = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const monthString = month < 10 ? `0${month}` : month;
        const filtered = appointments.filter(app => app.date.startsWith(`${year}-${monthString}`)).sort((a, b) => new Date(a.date) - new Date(b.date));
        setAppointmentsForMonth(filtered);
    };
    
    const getDayOfWeek = (dateString) => {
        const date = new Date(dateString + 'T00:00:00');
        return dayNames[date.getDay()].toUpperCase();
    };

    const toggleYearPicker = () => setYearPickerVisible(prevState => !prevState);
    const handleYearSelect = (year) => setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    const generateYearRange = (year) => {
        const years = [];
        for (let i = year - 2; i <= year + 2; i++) { years.push(i); }
        return years;
    };

    const toggleMonthPicker = () => setMonthPickerVisible(prevState => !prevState);
    const handleMonthSelect = (monthIndex) => {
        setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
        setMonthPickerVisible(false);
    };

    const toggleAddModal = (appointmentToEdit = null) => {
        if (appointmentToEdit) {
            setSelectedAppointment(appointmentToEdit);
            setNewReminder({
                title: appointmentToEdit.title,
                description: appointmentToEdit.description || '',
                date: new Date(appointmentToEdit.date + 'T00:00:00'),
                time: appointmentToEdit.time,
            });
        } else {
            setSelectedAppointment(null);
            setNewReminder({ title: '', description: '', date: new Date(), time: '10:45' });
        }
        setAddModalVisible(prevState => !prevState);
    };

    const handleSaveReminder = () => {
        if (!newReminder.title) {
            alert('Por favor, adicione um título ao lembrete.');
            return;
        }

        if (selectedAppointment) { // Modo de Edição
            const updatedAppointments = appointments.map(app => {
                if (app.id === selectedAppointment.id) {
                    return { ...app, title: newReminder.title, description: newReminder.description, date: newReminder.date.toISOString().split('T')[0], time: newReminder.time, };
                }
                return app;
            });
            setAppointments(updatedAppointments);
        } else { // Modo de Criação
            const newAppointment = {
                id: Date.now().toString(),
                date: newReminder.date.toISOString().split('T')[0],
                title: newReminder.title,
                description: newReminder.description,
                time: newReminder.time,
                type: 'lembrete',
            };
            setAppointments(prev => [...prev, newAppointment]);
        }
        setAddModalVisible(false);
    };

    // --- FUNÇÃO DE EXCLUIR CORRIGIDA ---
    const handleDeleteReminder = () => {
        if (!selectedAppointment) return;

        // Fecha o modal de opções imediatamente.
        setOptionsModalVisible(false);

        // Adiciona um pequeno atraso para a UI se atualizar antes do Alert.
        setTimeout(() => {
            Alert.alert(
                "Excluir Lembrete",
                `Você tem certeza que deseja excluir "${selectedAppointment.title}"?`,
                [
                    {
                        text: "Cancelar",
                        style: "cancel",
                    },
                    {
                        text: "Excluir",
                        style: "destructive",
                        onPress: () => {
                            // A lógica de exclusão propriamente dita.
                            setAppointments(prev => prev.filter(app => app.id !== selectedAppointment.id));
                        }
                    }
                ]
            );
        }, 150); 
    };

    const openOptionsModal = (appointment) => {
        setSelectedAppointment(appointment);
        setOptionsModalVisible(true);
    };

    const miniCalendarDays = generateCalendar(pickerDate, true);
    const changePickerMonth = (amount) => {
        setPickerDate(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));
    };
    const handleDaySelect = (day) => {
        const newDate = new Date(pickerDate.getFullYear(), pickerDate.getMonth(), day);
        setNewReminder(prev => ({ ...prev, date: newDate }));
        setDatePickerVisible(false);
    };

    const generateTimeSlots = () => {
        const slots = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 15) {
                const hour = h < 10 ? `0${h}` : h;
                const minute = m < 10 ? `0${m}` : m;
                slots.push(`${hour}:${minute}`);
            }
        }
        return slots;
    };
    const timeSlots = generateTimeSlots();

    return (
        <SafeAreaView style={styles.safeArea}>
            <Modal transparent={true} visible={isMonthPickerVisible} animationType="fade" onRequestClose={toggleMonthPicker}>
                <TouchableOpacity style={styles.modalOverlay} onPress={toggleMonthPicker}>
                    <View style={styles.monthPickerContainer}>
                        {monthNames.map((month, index) => (
                            <TouchableOpacity key={month} style={styles.monthItem} onPress={() => handleMonthSelect(index)}>
                                <Text style={[styles.monthItemText, index === currentDate.getMonth() && styles.selectedMonthItemText]}>{month.toUpperCase()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
            
            <Modal transparent={true} visible={isAddModalVisible} animationType="slide">
                <View style={styles.addModalOverlay}>
                    <View style={styles.addModalContainer}>
                        <View style={styles.addModalHeader}>
                            <TouchableOpacity onPress={() => setAddModalVisible(false)}><Ionicons name="close" size={30} color={COLORS.white} /></TouchableOpacity>
                            <Text style={styles.addModalHeaderText}>{selectedAppointment ? "Modificar Lembrete" : "Novo Lembrete"}</Text>
                            <TouchableOpacity onPress={handleSaveReminder}><Ionicons name="checkmark" size={30} color={COLORS.white} /></TouchableOpacity>
                        </View>
                        <View style={styles.addModalContent}>
                            <TextInput style={styles.addModalInputTitle} placeholder="Adicionar Título" placeholderTextColor={COLORS.gray} value={newReminder.title} onChangeText={text => setNewReminder(prev => ({ ...prev, title: text }))} />
                            <View style={styles.addModalRow}>
                                <Ionicons name="time-outline" size={24} color={COLORS.text} />
                                <TouchableOpacity onPress={() => { setPickerDate(newReminder.date); setDatePickerVisible(true); }}>
                                    <Text style={styles.addModalText}>{`${newReminder.date.getDate()} ${shortMonthNames[newReminder.date.getMonth()]}. ${newReminder.date.getFullYear()}`}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setTimePickerVisible(true)}>
                                    <Text style={[styles.addModalText, { marginLeft: 'auto', color: COLORS.primary }]}>{newReminder.time}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.addModalRow}>
                                <Ionicons name="menu-outline" size={24} color={COLORS.text} />
                                <TextInput style={[styles.addModalText, { flex: 1, marginLeft: 15 }]} placeholder="Adicionar uma Descrição" placeholderTextColor={COLORS.gray} value={newReminder.description} onChangeText={text => setNewReminder(prev => ({ ...prev, description: text }))} />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

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
                                        <View style={[styles.miniCalendarDay, d.day === newReminder.date.getDate() && pickerDate.getMonth() === newReminder.date.getMonth() && styles.selectedDay]}>
                                            <Text style={[styles.miniCalendarDayText, d.day === newReminder.date.getDate() && pickerDate.getMonth() === newReminder.date.getMonth() && styles.selectedDayText]}>{d.day}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <Modal transparent={true} visible={isTimePickerVisible} animationType="fade">
                <TouchableOpacity style={styles.pickerOverlay} onPress={() => setTimePickerVisible(false)}>
                     <View style={styles.timePickerContainer}>
                         <FlatList data={timeSlots} keyExtractor={item => item} renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => { setNewReminder(prev => ({ ...prev, time: item })); setTimePickerVisible(false); }}>
                                <Text style={styles.timeSlotText}>{item}</Text>
                            </TouchableOpacity>
                         )}/>
                    </View>
                </TouchableOpacity>
            </Modal>

            <Modal transparent={true} visible={isOptionsModalVisible} animationType="fade">
                <TouchableOpacity style={styles.pickerOverlay} onPress={() => setOptionsModalVisible(false)}>
                    <View style={styles.optionsContainer}>
                        <TouchableOpacity style={styles.optionButton} onPress={() => { setOptionsModalVisible(false); toggleAddModal(selectedAppointment); }}>
                            <Ionicons name="create-outline" size={24} color={COLORS.primary} />
                            <Text style={styles.optionText}>Modificar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionButton} onPress={handleDeleteReminder}>
                            <Ionicons name="trash-outline" size={24} color={'#E53935'} />
                            <Text style={[styles.optionText, { color: '#E53935' }]}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            <View style={styles.header}>
                <TouchableOpacity onPress={toggleMonthPicker}><Ionicons name="menu" size={28} color={COLORS.primary} /></TouchableOpacity>
                <TouchableOpacity style={styles.monthSelector} onPress={toggleYearPicker}>
                    <Text style={styles.monthText}>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</Text>
                    <Ionicons name={isYearPickerVisible ? "chevron-up" : "chevron-down"} size={20} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            {isYearPickerVisible && (
                <View style={styles.yearPickerContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
                        {generateYearRange(currentDate.getFullYear()).map(year => (
                            <TouchableOpacity key={year} onPress={() => handleYearSelect(year)}><Text style={[styles.yearText, year === currentDate.getFullYear() && styles.selectedYearText]}>{year}</Text></TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            <ScrollView style={styles.container}>
                <View style={styles.calendar}>
                    <View style={styles.weekDays}>{dayNames.map(day => <Text key={day} style={styles.weekDayText}>{day}</Text>)}</View>
                    <View style={styles.daysGrid}>{days.map(d => (<View key={d.key} style={styles.dayContainer}><Text style={[styles.dayText, d.hasReminder && styles.reminderDayText]}>{d.day}</Text></View>))}</View>
                </View>

                <View style={styles.appointmentsList}>
                    {appointmentsForMonth.length > 0 && <Text style={styles.appointmentsTitle}>Compromissos em {monthNames[currentDate.getMonth()]}</Text>}
                    {appointmentsForMonth.map(app => {
                        let subtitle = app.type === 'lembrete' ? (app.description ? `${app.description} - ${app.time}` : app.time) : `${app.doctor} - ${app.time}`;
                        return (
                            <View key={app.id} style={styles.appointmentCard}>
                                <View style={[ styles.cardIndicator, { backgroundColor: app.type === 'consulta' ? COLORS.primary : app.type === 'exame' ? '#E53935' : '#E91E63' }]} />
                                <View style={styles.dateInfo}>
                                    <Text style={styles.appointmentDay}>{app.date.split('-')[2]}</Text>
                                    <Text style={styles.appointmentWeekDay}>{getDayOfWeek(app.date)}</Text>
                                </View>
                                <View style={styles.detailsInfo}>
                                    <Text style={styles.appointmentTitle}>{app.title}</Text>
                                    <Text style={styles.appointmentTime}>{subtitle}</Text>
                                </View>
                                {app.type === 'lembrete' && (
                                    <TouchableOpacity style={styles.optionsButton} onPress={() => openOptionsModal(app)}>
                                        <Ionicons name="ellipsis-vertical" size={24} color={COLORS.gray} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.fab} onPress={() => toggleAddModal()}>
                <Ionicons name="add" size={32} color={COLORS.white} />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.white },
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray },
    monthSelector: { flexDirection: 'row', alignItems: 'center' },
    monthText: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, marginRight: 5 },
    yearPickerContainer: { backgroundColor: COLORS.primary, paddingVertical: 10 },
    yearText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold', paddingHorizontal: 20, opacity: 0.7 },
    selectedYearText: { opacity: 1, textDecorationLine: 'underline' },
    calendar: { paddingHorizontal: 10 },
    weekDays: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
    weekDayText: { fontSize: 14, fontWeight: 'bold', color: COLORS.gray },
    daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    dayContainer: { width: `${100 / 7}%`, justifyContent: 'center', alignItems: 'center', height: 40 },
    dayText: { fontSize: 16, color: COLORS.text },
    reminderDayText: { color: '#E91E63', fontWeight: 'bold' },
    appointmentsTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', paddingHorizontal: 20, marginBottom: 10, borderTopWidth: 1, borderTopColor: COLORS.lightGray, paddingTop: 20 },
    appointmentsList: { paddingHorizontal: 20, paddingTop: 10 },
    appointmentCard: { backgroundColor: COLORS.lightGray, borderRadius: 10, padding: 15, marginBottom: 15, flexDirection: 'row', alignItems: 'center' },
    cardIndicator: { width: 4, height: 50, borderRadius: 2, marginRight: 15 },
    dateInfo: { alignItems: 'center', marginRight: 20 },
    appointmentDay: { fontSize: 28, fontWeight: 'bold', color: COLORS.text },
    appointmentWeekDay: { fontSize: 12, color: COLORS.gray, fontWeight: 'bold' },
    detailsInfo: { flex: 1 },
    appointmentTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
    appointmentTime: { fontSize: 14, color: COLORS.gray, marginTop: 4 },
    fab: {
        position: 'absolute', bottom: 25, right: 25, width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', elevation: 8,
    },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-start' },
    addModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
    monthPickerContainer: { backgroundColor: COLORS.white, position: 'absolute', top: 60, left: 10, borderRadius: 8, padding: 10, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 5 },
    monthItem: { paddingVertical: 12, paddingHorizontal: 20 },
    monthItemText: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
    selectedMonthItemText: { color: COLORS.primary },
    addModalContainer: { width: '90%', backgroundColor: COLORS.white, borderRadius: 15 },
    addModalHeader: { backgroundColor: COLORS.primary, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
    addModalHeaderText: { color: COLORS.white, fontSize: 20, fontWeight: 'bold' },
    addModalContent: { padding: 20 },
    addModalInputTitle: { fontSize: 22, paddingBottom: 10, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray },
    addModalRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
    addModalText: { fontSize: 16, marginLeft: 15, color: COLORS.text },
    pickerOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    miniCalendarContainer: { backgroundColor: 'white', padding: 15, borderRadius: 10, width: '90%', elevation: 20 },
    miniCalendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    miniCalendarMonthText: { fontWeight: 'bold', fontSize: 16, color: COLORS.primary },
    miniCalendarWeekDays: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 5 },
    miniCalendarWeekDayText: { fontSize: 12, color: COLORS.gray, fontWeight: 'bold', width: '14.2%', textAlign: 'center' },
    miniCalendarDaysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    miniCalendarDayContainer: { width: '14.2%', justifyContent: 'center', alignItems: 'center', height: 35 },
    miniCalendarDay: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 15 },
    miniCalendarDayText: { fontSize: 14, color: COLORS.text },
    selectedDay: { backgroundColor: COLORS.primary },
    selectedDayText: { color: COLORS.white, fontWeight: 'bold' },
    timePickerContainer: { backgroundColor: 'white', padding: 10, borderRadius: 10, width: '60%', maxHeight: 250 },
    timeSlotText: { fontSize: 18, paddingVertical: 12, textAlign: 'center' },
    optionsButton: { padding: 10, marginLeft: 'auto', },
    optionsContainer: { backgroundColor: 'white', borderRadius: 10, padding: 10, width: '60%', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, },
    optionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10, },
    optionText: { marginLeft: 15, fontSize: 18, color: COLORS.primary, },
});

export default AgendaScreen;

