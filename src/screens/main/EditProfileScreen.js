import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Edit2, X } from 'lucide-react-native';

const AGE_CATEGORIES = ['18-25', '26-35', '36-45', '46-55', '55+'];
const GENDERS = ['Male', 'Female', 'Other'];

export default function EditProfileScreen({ navigation }) {
    const { user, updateUserProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    const [name, setName] = useState(user?.name || '');
    const [ageCategory, setAgeCategory] = useState(user?.ageCategory || '');
    const [email, setEmail] = useState(user?.email || '');
    const [gender, setGender] = useState(user?.gender || '');
    const [loading, setLoading] = useState(false);

    const toggleEdit = () => {
        if (isEditing) {
            // Cancel editing: Reset fields to original user data
            setName(user?.name || '');
            setAgeCategory(user?.ageCategory || '');
            setEmail(user?.email || '');
            setGender(user?.gender || '');
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    };

    const handleSave = async () => {
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
        // Email is optional, no check needed unless we want format validation

        setLoading(true);
        // Simulate API call
        setTimeout(async () => {
            // In a real app, you'd await the actual update call here
            await updateUserProfile({
                name: name.trim(),
                email: email.trim(),
                ageCategory,
                gender
            });
            setLoading(false);
            setIsEditing(false);
            Alert.alert("Success", "Profile updated successfully.");
        }, 1000);
    };

    const SelectionPill = ({ label, selected, onSelect, disabled }) => (
        <TouchableOpacity
            style={[
                styles.pill,
                disabled && styles.pillDisabled,
                selected && styles.pillSelected,
            ]}
            onPress={() => !disabled && onSelect(label)}
            activeOpacity={disabled ? 1 : 0.7}
        >
            <Text style={[
                styles.pillText,
                selected && styles.pillTextSelected,
                disabled && !selected && styles.pillTextDisabled
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile Details</Text>

                <TouchableOpacity onPress={toggleEdit} style={styles.editButton}>
                    {isEditing ? (
                        <Text style={styles.editButtonText}>Cancel</Text>
                    ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Edit2 size={18} color={COLORS.primary} />
                            <Text style={styles.editButtonText}>Edit</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >

                    {/* Mobile Number (Read Only) */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Mobile Number</Text>
                        <Input
                            value={user?.phone || ''}
                            editable={false}
                            style={[styles.input, styles.readOnlyInput]}
                        />
                    </View>

                    {/* Name */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
                        <Input
                            placeholder="Enter your full name"
                            value={name}
                            onChangeText={setName}
                            maxLength={35}
                            editable={isEditing}
                            style={[styles.input, !isEditing && styles.readOnlyInput]}
                        />
                    </View>

                    {/* Age Category */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Age Category <Text style={styles.required}>*</Text></Text>
                        <View style={styles.pillsContainer}>
                            {AGE_CATEGORIES.map((age) => (
                                <SelectionPill
                                    key={age}
                                    label={age}
                                    selected={ageCategory === age}
                                    onSelect={setAgeCategory}
                                    disabled={!isEditing}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Email (Optional) */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Email <Text style={styles.required}>(Optional)</Text></Text>
                        <Input
                            placeholder="Enter your email address"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={isEditing}
                            style={[styles.input, !isEditing && styles.readOnlyInput]}
                        />
                    </View>

                    {/* Gender */}
                    <View style={[styles.section, { marginBottom: 30 }]}>
                        <Text style={styles.label}>Gender <Text style={styles.required}>*</Text></Text>
                        <View style={styles.pillsContainer}>
                            {GENDERS.map((g) => (
                                <SelectionPill
                                    key={g}
                                    label={g}
                                    selected={gender === g}
                                    onSelect={setGender}
                                    disabled={!isEditing}
                                />
                            ))}
                        </View>
                    </View>

                    {isEditing && (
                        <View style={styles.submitBtn}>
                            <Button
                                title="Save Changes"
                                onPress={handleSave}
                                loading={loading}
                            />
                        </View>
                    )}

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
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    editButton: {
        padding: 4,
    },
    editButtonText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 16,
    },
    content: {
        padding: 24,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8,
    },
    required: {
        color: COLORS.error,
    },
    input: {
        backgroundColor: COLORS.surface,
    },
    readOnlyInput: {
        backgroundColor: COLORS.background,
        color: COLORS.textLight,
        borderWidth: 0,
    },
    pillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    pill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
    },
    pillSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary,
    },
    pillDisabled: {
        opacity: 0.7,
        backgroundColor: COLORS.background,
        borderColor: COLORS.border,
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
    pillTextDisabled: {
        color: COLORS.textLight,
    },
    submitBtn: {
        marginTop: 10,
        marginBottom: 20,
    },
});
