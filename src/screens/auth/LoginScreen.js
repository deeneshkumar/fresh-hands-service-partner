import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, FlatList, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, Check } from 'lucide-react-native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';

import { isValidPhoneNumber } from '../../utils/validation';

const COUNTRIES = [
    { code: 'IN', name: 'India', dial_code: '+91', flag: 'https://flagcdn.com/w40/in.png' },
    { code: 'US', name: 'USA', dial_code: '+1', flag: 'https://flagcdn.com/w40/us.png' },
    { code: 'GB', name: 'UK', dial_code: '+44', flag: 'https://flagcdn.com/w40/gb.png' },
    { code: 'CA', name: 'Canada', dial_code: '+1', flag: 'https://flagcdn.com/w40/ca.png' },
    { code: 'AU', name: 'Australia', dial_code: '+61', flag: 'https://flagcdn.com/w40/au.png' },
    { code: 'SG', name: 'Singapore', dial_code: '+65', flag: 'https://flagcdn.com/w40/sg.png' },
    { code: 'AE', name: 'UAE', dial_code: '+971', flag: 'https://flagcdn.com/w40/ae.png' },
];

export default function LoginScreen({ navigation }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
    const [showCountryPicker, setShowCountryPicker] = useState(false);

    const handleLogin = () => {
        const cleanedPhone = phoneNumber.trim();

        if (cleanedPhone.length === 0) {
            alert('Mobile number is required to proceed.');
            return;
        }

        if (cleanedPhone.length !== 10) {
            alert(`Mobile number must be exactly 10 digits. You entered ${cleanedPhone.length} digits.`);
            return;
        }

        // Check for Indian mobile number format (starts with 6, 7, 8, or 9)
        if (selectedCountry.code === 'IN' && !/^[6-9]/.test(cleanedPhone)) {
            alert('Indian mobile numbers must start with 6, 7, 8, or 9.');
            return;
        }

        if (isValidPhoneNumber(cleanedPhone)) {
            // Simulate sending OTP
            const otp = Math.floor(100000 + Math.random() * 900000);
            alert(`OTP Sent: ${otp}`);
            // Passing rawPhone as well for easier logic downstream if needed
            navigation.navigate('OTP', {
                phoneNumber: `${selectedCountry.dial_code} ${cleanedPhone}`,
                generatedOtp: otp,
                rawPhone: cleanedPhone
            });
        } else {
            alert('Please enter a valid mobile number.');
        }
    };

    const handlePhoneChange = (text) => {
        // Edge Case: Prevent non-numeric characters (paste handling)
        const numericValue = text.replace(/[^0-9]/g, '');
        setPhoneNumber(numericValue);
    };

    const renderCountryItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.countryItem, item.code === selectedCountry.code && styles.countryItemActive]}
            onPress={() => {
                setSelectedCountry(item);
                setShowCountryPicker(false);
            }}
        >
            <View style={styles.countryInfo}>
                <Image source={{ uri: item.flag }} style={styles.flagMedium} />
                <Text style={styles.countryName}>{item.name} ({item.dial_code})</Text>
            </View>
            {item.code === selectedCountry.code && <Check size={20} color={COLORS.primary} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.logoText}>Fresh Hands</Text>
                    <Text style={styles.tagline}>Become a service partner</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Enter your mobile number</Text>

                    <View style={styles.inputRow}>
                        {/* Country Code Selector */}
                        <TouchableOpacity
                            style={styles.countryCodeContainer}
                            onPress={() => setShowCountryPicker(true)}
                        >
                            <Image
                                source={{ uri: selectedCountry.flag }}
                                style={styles.flagSmall}
                            />
                            <Text style={styles.countryCodeText}>{selectedCountry.dial_code}</Text>
                            <ChevronDown size={14} color={COLORS.text} />
                        </TouchableOpacity>

                        {/* Mobile Number Input */}
                        <View style={styles.phoneInputContainer}>
                            <Input
                                placeholder="Mobile Number"
                                keyboardType="phone-pad"
                                value={phoneNumber}
                                onChangeText={handlePhoneChange}
                                maxLength={10}
                                style={styles.inputReset} // Override container styles
                                inputStyle={{ borderRadius: 12 }}
                            />
                        </View>
                    </View>

                    <Text style={styles.helperText}>We will send you a 6 digit OTP to verify</Text>

                    <Button title="Continue" onPress={handleLogin} style={styles.button} />
                </View>
            </View>

            {/* Country Picker Modal */}
            <Modal
                visible={showCountryPicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowCountryPicker(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowCountryPicker(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Select Country</Text>
                                    <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                                        <Text style={styles.closeText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                                <FlatList
                                    data={COUNTRIES}
                                    renderItem={renderCountryItem}
                                    keyExtractor={item => item.code}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: THEME.spacing.l,
        paddingTop: 80, // Move content up but keep it safe from status bar
        justifyContent: 'flex-start',
    },
    header: {
        alignItems: 'center',
        marginBottom: THEME.spacing.xl * 2,
    },
    logoText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: THEME.spacing.s,
    },
    tagline: {
        fontSize: 24,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    form: {
        width: '100%',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: THEME.spacing.m,
        color: COLORS.text,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-start', // Align tops of containers
        marginBottom: 8,
    },
    countryCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 10,
        height: 50, // Fixed height to match Input's implicit height (approx)
        marginRight: 8,
        minWidth: 90,
        justifyContent: 'space-between',
    },
    flagSmall: {
        width: 20,
        height: 14,
        marginRight: 6,
        borderRadius: 2,
    },
    countryCodeText: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.text,
        marginRight: 4,
    },
    phoneInputContainer: {
        flex: 1,
        // The Input component has internal margins/styles we need to manage
    },
    inputReset: {
        marginBottom: 0,
        width: '100%',
        // Input component applies style to CONTAINER. 
        // Internal TextInput handles height/padding. 
        // Container with marginBottom:0 allows alignment.
    },
    helperText: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: THEME.spacing.l,
        marginTop: 4,
    },
    button: {
        marginTop: THEME.spacing.s,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '60%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    closeText: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: '600',
    },
    countryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    countryItemActive: {
        backgroundColor: COLORS.surface,
    },
    countryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flagMedium: {
        width: 30,
        height: 20,
        marginRight: 12,
        borderRadius: 3,
    },
    countryName: {
        fontSize: 16,
        color: COLORS.text,
    },
});
