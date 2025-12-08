import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function SplashScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Fresh Hands</Text>
            <Text style={styles.subtitle}>Service Partner</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    subtitle: {
        fontSize: 18,
        color: COLORS.white,
        marginTop: 8,
        opacity: 0.9,
    }
});
