import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import Button from '../../components/Button';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { isValidOTP } from '../../utils/validation';

export default function OtpVerificationScreen({ navigation, route }) {
    const { phoneNumber, generatedOtp, rawPhone } = route.params || { phoneNumber: '+91 XXXXX XXXXX', generatedOtp: null, rawPhone: '' };
    const [otpValues, setOtpValues] = useState(new Array(6).fill(''));
    const [timer, setTimer] = useState(30);
    const { login, loginAsGuest } = useAuth();
    const inputRefs = useRef([]);

    // Simulate receiving SMS
    useEffect(() => {
    }, [generatedOtp]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
            if (timer === 0) clearInterval(interval);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleVerify = () => {
        const enteredOtp = otpValues.join('');

        if (enteredOtp == generatedOtp || isValidOTP(enteredOtp)) {
            // Integrated Auth Logic
            const phoneToCheck = rawPhone || phoneNumber;

            if (phoneToCheck.includes('9876543210')) {
                // Existing Partner Login Mock
                const mockUser = {
                    id: 'p1',
                    name: 'Rajesh Kumar',
                    phone: phoneNumber,
                    service: 'Plumber',
                    rating: 4.8
                };
                login(mockUser);
            } else {
                // New User -> Complete Profile
                navigation.navigate('CompleteProfile', { phone: phoneNumber });
            }
        } else {
            Alert.alert('Invalid OTP', 'The code you entered is incorrect. Please try again.');
        }
    };

    const handleResend = () => {
        setTimer(30);
        const newOtp = Math.floor(100000 + Math.random() * 900000);
        setOtpValues(new Array(6).fill('')); // Reset inputs
        Alert.alert('OTP Resent', `Your new OTP is: ${newOtp}`);
        // In real app, update expected OTP state
    };

    const handleChange = (text, index) => {
        if (text.length > 1) {
            // Handle paste (if simpler single paste is needed, complex logic omitted for brevity)
            const pasted = text.slice(0, 6).split('');
            const newValues = [...otpValues];
            pasted.forEach((char, i) => {
                if (index + i < 6) newValues[index + i] = char;
            });
            setOtpValues(newValues);
            if (index + pasted.length < 6) {
                inputRefs.current[index + pasted.length].focus();
            } else {
                inputRefs.current[5].focus();
            }
            return;
        }

        const newValues = [...otpValues];
        newValues[index] = text;
        setOtpValues(newValues);

        // Move to next input if value entered
        if (text && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleBackspace = (e, index) => {
        if (e.nativeEvent.key === 'Backspace') {
            if (index > 0 && otpValues[index] === '') {
                inputRefs.current[index - 1].focus();
                const newValues = [...otpValues];
                newValues[index - 1] = '';
                setOtpValues(newValues);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ArrowLeft size={24} color={COLORS.primary} />
                <Text style={styles.backButtonText}>Change Number</Text>
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={styles.title}>Verify Phone Number</Text>
                <Text style={styles.subtitle}>
                    Enter the 6-digit code sent to {phoneNumber}
                </Text>

                <View style={styles.otpContainer}>
                    {otpValues.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => inputRefs.current[index] = ref}
                            style={[
                                styles.otpBox,
                                digit ? styles.otpBoxFilled : null,
                                index === otpValues.findIndex(v => v === '') ? styles.otpBoxActive : null
                            ]}
                            value={digit}
                            onChangeText={(text) => handleChange(text, index)}
                            onKeyPress={(e) => handleBackspace(e, index)}
                            keyboardType="number-pad"
                            maxLength={6} // Allow paste but handle inside logic
                            selectTextOnFocus
                        />
                    ))}
                </View>

                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>
                        Resend code in {timer}s
                    </Text>
                    {timer === 0 && (
                        <TouchableOpacity onPress={handleResend}>
                            <Text style={styles.resendLink}>Resend</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <Button title="Verify" onPress={handleVerify} style={styles.button} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: THEME.spacing.l,
        flex: 1,
    },
    backButton: {
        marginBottom: THEME.spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: THEME.spacing.l, // Align with content
        marginTop: 50,
    },
    backButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: THEME.spacing.s,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        marginBottom: THEME.spacing.xl,
        lineHeight: 22,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: THEME.spacing.xl,
        gap: 8,
    },
    otpBox: {
        width: 45,
        height: 55,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 24,
        color: COLORS.text,
        backgroundColor: COLORS.surface,
    },
    otpBoxActive: {
        borderColor: COLORS.primary,
        backgroundColor: '#E0F2F1', // Very light teal tint
    },
    otpBoxFilled: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.surface,
    },
    timerContainer: {
        flexDirection: 'row',
        justifyContent: 'center', // Center it nicely now
        gap: 8,
        marginBottom: THEME.spacing.l,
    },
    timerText: {
        color: COLORS.textLight,
    },
    resendLink: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    button: {
        marginTop: THEME.spacing.m,
    },
});
