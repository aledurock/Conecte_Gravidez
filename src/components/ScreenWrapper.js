import React from 'react';
// A MUDANÇA ESTÁ AQUI: Importamos da biblioteca correta
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { ScrollView, StyleSheet } from 'react-native';
import { COLORS } from './commonStyles';

const ScreenWrapper = ({ children }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                bounces={true} 
                overScrollMode="always" 
            >
                {children}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.lightGray || '#f0f0f0',
    },
    scrollView: {
        flex: 1,
    },
});

export default ScreenWrapper;

