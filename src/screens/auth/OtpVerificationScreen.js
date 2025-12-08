import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { isValidOTP } from '../../utils/validation';

export default function OtpVerificationScreen({ navigation, route }) {
    const { phoneNumber, generatedOtp, rawPhone } = route.params || { phoneNumber: '+91 XXXXX XXXXX', generatedOtp: null, rawPhone: '' };
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(30);
    const { login, loginAsGuest } = useAuth();

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
        if (otp == generatedOtp || isValidOTP(otp)) {
            // Integrated Auth Logic
            // If rawPhone (the inner 10 digit number) is NOT 9876543210 -> Guest
            // This preserves the 'Guest View Only Before Verification' requirement

            // Extract raw number if strictly 10 digits needed by loginAsGuest
            // Using rawPhone passed from LoginScreen
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
                // Guest Login
                loginAsGuest(phoneNumber);
            }

            // Note: navigation to 'Main' happens automatically via RootNavigator when isAuthenticated becomes true

        } else {
            Alert.alert('Invalid OTP', 'The code you entered is incorrect. Please try again.');
        }
    };

    const handleResend = () => {
        setTimer(30);
        const newOtp = Math.floor(1000 + Math.random() * 9000);
        Alert.alert('OTP Resent', `Your new OTP is: ${newOtp}`);
        // In real app, update expected OTP state
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Verify Phone Number</Text>
                <Text style={styles.subtitle}>
                    Enter the 4-digit code sent to {phoneNumber}
                </Text>

                <Input
                    placeholder="0000"
                    keyboardType="number-pad"
                    value={otp}
                    onChangeText={setOtp}
                    style={styles.input}
                    maxLength={4}
                    textContentType="oneTimeCode"
                    autoComplete="sms-otp"
                />

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
    input: {
        textAlign: 'center',
        letterSpacing: 8,
        fontSize: 24,
    },
    timerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
