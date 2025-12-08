import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/theme';

export default function Button({ title, onPress, variant = 'primary', loading = false, disabled = false, style }) {
    const isPrimary = variant === 'primary';
    return (
        <TouchableOpacity
            style={[
                styles.button,
                isPrimary ? styles.primary : styles.outline,
                (disabled || loading) && styles.disabled,
                style
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={isPrimary ? COLORS.white : COLORS.primary} />
            ) : (
                <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textOutline]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: THEME.spacing.m,
        borderRadius: THEME.borderRadius.m,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: THEME.spacing.s,
    },
    primary: {
        backgroundColor: COLORS.primary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    disabled: {
        opacity: 0.6,
    },
    text: {
        fontWeight: 'bold',
        fontSize: THEME.fontSize.l,
    },
    textPrimary: {
        color: COLORS.white,
    },
    textOutline: {
        color: COLORS.primary,
    }
});
