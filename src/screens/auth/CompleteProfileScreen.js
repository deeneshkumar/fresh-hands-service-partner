import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { User, Mail, Calendar, MapPin, ChevronRight, Check } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';

const AGE_CATEGORIES = ['18-25', '26-35', '36-45', '46-55', '55+'];
const SERVICE_AREAS = ['Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad'];

export default function CompleteProfileScreen({ navigation, route }) {
    const { phone } = route.params || {};
    const { completeUserProfile, user } = useAuth();
    const [name, setName] = useState('');
    const [ageCategory, setAgeCategory] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    const handleComplete = async () => {
        if (!name || !ageCategory || !gender || !address) {
            Alert.alert("Required Fields", "Please fill in all details to continue.");
            return;
        }

        try {
            setLoading(true);
            await completeUserProfile({
                name,
                ageCategory,
                gender,
                address,
                address,
                phone: phone || user?.phone
            });
            // Auto navigates to Dashboard as authentication state changes
        } catch (error) {
            Alert.alert("Error", "Profile update failed. Please try again.");
            setLoading(false);
        }
    };

    const SelectionPill = ({ label, selected, onPress }) => (
        <TouchableOpacity
            style={[styles.pill, selected && styles.pillSelected]}
            onPress={onPress}
        >
            <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Complete Your Profile</Text>
                        <Text style={styles.subtitle}>
                            Let's get to know you better.
                        </Text>
                    </View>

                    {/* Mobile Number (Read Only) */}
                    <View style={[styles.section, { marginBottom: 6 }]}>
                        <Text style={styles.label}>Mobile Number <Text style={styles.required}>*</Text></Text>
                        <Input
                            value={phone || user?.phone || ''}
                            editable={false}
                            style={{ backgroundColor: COLORS.surface, color: COLORS.textLight }}
                        />
                    </View>

                    {/* Name */}
                    <View style={[styles.section, { marginBottom: 6 }]}>
                        <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
                        <Input
                            placeholder="Enter your full name"
                            value={name}
                            onChangeText={setName}
                            maxLength={35}
                            autoCapitalize="words"
                        />
                    </View>

                    {/* Address */}
                    <View style={[styles.section, { marginBottom: 6 }]}>
                        <Text style={styles.label}>Address <Text style={styles.required}>*</Text></Text>
                        <Input
                            placeholder="Enter your full address"
                            value={address}
                            onChangeText={setAddress}
                            multiline
                            numberOfLines={3}
                            style={{ height: 50, textAlignVertical: 'top' }}
                        />
                    </View>


                    {/* Age Category */}
                    <View style={[styles.section, { marginBottom: 24 }]}>
                        <Text style={styles.label}>Age Category <Text style={styles.required}>*</Text></Text>
                        <View style={styles.pillsContainer}>
                            {AGE_CATEGORIES.map((age) => (
                                <SelectionPill
                                    key={age}
                                    label={age}
                                    selected={ageCategory === age}
                                    onPress={() => setAgeCategory(age)}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Gender */}
                    <View style={[styles.section, { marginBottom: 30 }]}>
                        <Text style={styles.label}>Gender <Text style={styles.required}>*</Text></Text>
                        <View style={styles.pillsContainer}>
                            {['Male', 'Female', 'Other'].map((g) => (
                                <SelectionPill
                                    key={g}
                                    label={g}
                                    selected={gender === g}
                                    onPress={() => setGender(g)}
                                />
                            ))}
                        </View>
                    </View>


                    <Button
                        title="Start Using App"
                        onPress={handleComplete}
                        loading={loading}
                        style={styles.submitBtn}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>By submitting, you agree to our Terms of Service</Text>
                    </View>
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
        padding: 24,
        paddingTop: 10,
    },
    header: {
        marginBottom: 32,
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
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 10,
    },
    required: {
        color: COLORS.error,
    },
    pillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    pill: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    pillSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    pillText: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '500',
    },
    pillTextSelected: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    hint: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 8,
        fontStyle: 'italic',
    },
    submitBtn: {
        marginTop: 10,
        marginBottom: 24,
    },
    footer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    footerText: {
        fontSize: 12,
        color: COLORS.textLight,
    },
});
