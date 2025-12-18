import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/theme';

export default function Input({
    label = '',
    value = '',
    onChangeText = () => { },
    placeholder = '',
    keyboardType = 'default',
    secureTextEntry = false,
    style = {},
    inputStyle = {},
    ...props
}) {
    return (
        <View style={[styles.container, style]}>
            {!!label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[styles.input, inputStyle]}
                value={String(value)}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={COLORS.textLight}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: THEME.spacing.m,
    },
    label: {
        marginBottom: THEME.spacing.s,
        color: COLORS.text,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: THEME.borderRadius.m,
        padding: THEME.spacing.m,
        backgroundColor: COLORS.surface,
        fontSize: THEME.fontSize.m,
    }
});
