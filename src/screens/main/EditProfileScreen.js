import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft } from 'lucide-react-native';

const AGE_CATEGORIES = ['18-25', '26-35', '36-45', '46+'];
const GENDERS = ['Male', 'Female', 'Other'];

export default function EditProfileScreen({ navigation }) {
    const { user, updateUserProfile } = useAuth();

    const [name, setName] = useState(user?.name || '');
    const [ageCategory, setAgeCategory] = useState(user?.ageCategory || '');
    const [address, setAddress] = useState(user?.address || '');
    const [gender, setGender] = useState(user?.gender || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Missing Information', 'Please enter your name.');
            return;
        }
        if (!address.trim()) {
            Alert.alert('Missing Information', 'Please enter your full address.');
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

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            updateUserProfile({
                name: name.trim(),
                address: address.trim(),
                ageCategory,
                gender
            });
            setLoading(false);
            Alert.alert("Success", "Profile updated successfully.", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        }, 1000);
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
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 16 }}>
                    <ArrowLeft size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

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
                    <View style={[styles.section, { marginBottom: 30 }]}>
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

                    {/* Address */}
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

                    <View style={styles.submitBtn}>
                        <Button
                            title="Save Changes"
                            onPress={handleSave}
                            loading={loading}
                        />
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    content: {
        padding: 24,
    },
    section: {
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8,
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
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
    },
    pillSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '15',
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
    submitBtn: {
        marginTop: 20,
        marginBottom: 40,
    },
});
