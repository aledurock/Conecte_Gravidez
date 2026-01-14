import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { ScrollView, StyleSheet, View } from 'react-native';
import { COLORS } from './commonStyles';

// Adicionei a prop 'withScroll' (padrão é true para não quebrar outras telas)
const ScreenWrapper = ({ children, withScroll = true, style }) => {
    
    // Componente interno: Decide se usa ScrollView ou View comum
    const Container = withScroll ? ScrollView : View;
    
    // Props específicas para quando for ScrollView
    const scrollProps = withScroll ? {
        showsVerticalScrollIndicator: false,
        bounces: true,
        overScrollMode: "always",
        contentContainerStyle: { flexGrow: 1 } // Importante para conteúdo pequeno esticar
    } : {
        style: { flex: 1 } // Se for View normal, ocupa tudo
    };

    
    return (
        <SafeAreaView style={[styles.safeArea, style]}>
            <Container 
                style={styles.container}
                {...scrollProps}
            >
                {children}
            </Container>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background || '#f0f0f0', // Ajustei para puxar do tema se houver
    },
    container: {
        flex: 1,
    },
});

export default ScreenWrapper;