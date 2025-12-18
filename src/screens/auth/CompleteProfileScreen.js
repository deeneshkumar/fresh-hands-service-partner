import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

const AGE_CATEGORIES = ['18-25', '26-35', '36-45', '46+'];
const GENDERS = ['Male', 'Female', 'Other'];

export default function CompleteProfileScreen({ navigation, route }) {
    const { phone } = route.params || {};
    const { login, setPartnerStatus } = useAuth();

    const [name, setName] = useState('');
    const [ageCategory, setAgeCategory] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');

    const handleSubmit = () => {
        if (!name.trim()) {
            Alert.alert('Missing Information', 'Please enter your name.');
            return;
        }
        if (!ageCategory) {
            Alert.alert('Missing Information', 'Please select your age category.');
            return;
        }
        if (!gender) {
            Alert.alert('Missing Information', 'Please select your gender.');
            return;
        }
        if (!address.trim()) {
            Alert.alert('Missing Information', 'Please enter your full address.');
            return;
        }

        // Create User Profile
        const userProfile = {
            id: 'u' + Date.now(),
            name: name.trim(),
            phone: phone,
            address: address.trim(),
            ageCategory,
            gender,
            isNewUser: true, // Flag to show welcome or registration banner
        };

        // Complete Login
        setPartnerStatus('UNREGISTERED');
        login(userProfile);
    };

    const SelectionPill = ({ label, selected, onSelect }) => (
        <TouchableOpacity
            style={[
                styles.pill,
                selected && styles.pillSelected
            ]}
            onPress={() => onSelect(label)}
        >
            <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    <View style={styles.header}>
                        <Text style={styles.title}>Complete Your Profile</Text>
                        <Text style={styles.subtitle}>
                            Let's get to know you better to find the best jobs for you.
                        </Text>
                    </View>

                    {/* Name */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
                        <Input
                            placeholder="Enter your full name"
                            value={name}
                            onChangeText={setName}
                            maxLength={25}
                        />
                    </View>

                    {/* Age Category */}
                    <View style={[styles.section, { marginBottom: 30}]}>
                        <Text style={styles.label}>Age Category <Text style={styles.required}>*</Text></Text>
                        <View style={styles.pillsContainer}>
                            {AGE_CATEGORIES.map((age) => (
                                <SelectionPill
                                    key={age}
                                    label={age}
                                    selected={ageCategory === age}
                                    onSelect={setAgeCategory}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Address (Required) */}
                    <View style={[styles.section, { marginBottom: 15 }]}>
                        <Text style={styles.label}>Full Address <Text style={styles.required}>*</Text></Text>
                        <Input
                            placeholder="House No, Street, Area, City"
                            value={address}
                            onChangeText={setAddress}
                            multiline
                            numberOfLines={3}
                            maxLength={100}
                            style={{ minHeight: 10, maxHeight: 100, textAlignVertical: 'top' }}
                        />
                    </View>

                    {/* Gender */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Gender <Text style={styles.required}>*</Text></Text>
                        <View style={styles.pillsContainer}>
                            {GENDERS.map((g) => (
                                <SelectionPill
                                    key={g}
                                    label={g}
                                    selected={gender === g}
                                    onSelect={setGender}
                                />
                            ))}
                        </View>
                    </View>

                    <Button
                        title="Save & Continue"
                        onPress={handleSubmit}
                        style={styles.submitBtn}
                    />

                </ScrollView>
            </KeyboardAvoidingView>
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
    },
    header: {
        marginTop: 1,
        marginBottom: THEME.spacing.xl,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,

    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        lineHeight: 22,
    },
    section: {
        marginBottom: 10, // Reduced from 16
    },
    label: {

        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 6, // Reduced from 12
    },
    required: {
        color: COLORS.error,
    },
    optional: {
        color: COLORS.textLight,
        fontWeight: 'normal',
        fontSize: 14,
    },
    pillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    pill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
    },
    pillSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '15', // Light transparent primary
    },
    pillText: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '500',
    },
    pillTextSelected: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    taglineContainer: {
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center',
        padding: 16,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    submitBtn: {
        marginTop: 12,
        marginBottom: 40,
    },
});
