import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, Check, Upload, CreditCard, User, Briefcase, FileText } from 'lucide-react-native';

const STEPS = [
    { id: 1, title: "Personal", icon: User },
    { id: 2, title: "Work", icon: Briefcase },
    { id: 3, title: "Verify ID", icon: FileText },
    { id: 4, title: "Bank", icon: CreditCard },
];

export default function RegistrationScreen({ route, navigation }) {
    const { phone } = route?.params || { phone: '+919876543210' };
    const { registerPartner, isLoading } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);

    const [form, setForm] = useState({
        name: '',
        email: '',
        city: '',
        category: '',
        experience: '',
        aadharNumber: '',
        gstNumber: '', // Optional
        bankName: '',
        accountNumber: '',
        ifsc: ''
    });

    const updateForm = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const validateStep = (step) => {
        switch (step) {
            case 1:
                if (!form.name || !form.email || !form.city) {
                    Alert.alert("Missing Details", "Please fill in all personal details.");
                    return false;
                }
                return true;
            case 2:
                if (!form.category || !form.experience) {
                    Alert.alert("Missing Details", "Please fill in all professional details.");
                    return false;
                }
                return true;
            case 3:
                if (!form.aadharNumber || form.aadharNumber.length < 12) {
                    Alert.alert("Invalid ID", "Please enter a valid 12-digit Aadhar number.");
                    return false;
                }
                return true;
            case 4:
                // Minimal check for mock
                if (!form.bankName || !form.accountNumber || !form.ifsc) {
                    Alert.alert("Missing Details", "Please fill in all bank details.");
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        } else {
            navigation.goBack();
        }
    };

    const handleSubmit = async () => {
        if (!validateStep(4)) return;

        try {
            await registerPartner({ ...form, phone });
            // Success alert is handled by AuthContext logic implies we might just navigate
            // But let's show an alert here for clarity
            Alert.alert(
                "Application Submitted",
                "Your profile is now under review.",
                [{ text: "OK", onPress: () => navigation.navigate('Main') }]
            );
        } catch (error) {
            Alert.alert("Error", "Registration failed. Please try again.");
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Personal Details</Text>
                        <Input label="Mobile Number" value={phone} style={styles.inputDisable} editable={false} />
                        <Input
                            label="Full Name"
                            placeholder="Enter full name"
                            value={form.name}
                            onChangeText={(t) => updateForm('name', t)}
                        />
                        <Input
                            label="Email"
                            placeholder="Enter email address"
                            value={form.email}
                            onChangeText={(t) => updateForm('email', t)}
                            keyboardType="email-address"
                        />
                        <Input
                            label="City"
                            placeholder="Current city"
                            value={form.city}
                            onChangeText={(t) => updateForm('city', t)}
                        />
                    </View>
                );
            case 2:
                return (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Info</Text>
                        <Input
                            label="Service Category"
                            placeholder="e.g. Plumber, Electrician"
                            value={form.category}
                            onChangeText={(t) => updateForm('category', t)}
                        />
                        <Input
                            label="Experience (Years)"
                            placeholder="e.g. 2"
                            keyboardType="numeric"
                            value={form.experience}
                            onChangeText={(t) => updateForm('experience', t)}
                        />
                        <View style={styles.infoBox}>
                            <Text style={styles.infoText}>
                                Tip: Partners with more detailed profiles get 2x more job requests.
                            </Text>
                        </View>
                    </View>
                );
            case 3:
                return (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>ID Verification</Text>
                        <Text style={styles.sectionSub}>Please provide your government ID for verification.</Text>

                        <Input
                            label="Aadhar Number"
                            placeholder="12-digit Aadhar Number"
                            value={form.aadharNumber}
                            onChangeText={(t) => updateForm('aadharNumber', t)}
                            keyboardType="numeric"
                            maxLength={12}
                        />

                        {/* Mock Upload UI */}
                        <Text style={[styles.label, { marginTop: 12 }]}>Upload Aadhar Card (Front & Back)</Text>
                        <TouchableOpacity style={styles.uploadBox}>
                            <Upload size={32} color={COLORS.primary} />
                            <Text style={styles.uploadText}>Tap to Upload Documents</Text>
                            <Text style={styles.uploadSub}>Supports JPG, PNG, PDF (Max 5MB)</Text>
                        </TouchableOpacity>

                        <Input
                            label="GST Number (Optional)"
                            placeholder="If applicable"
                            value={form.gstNumber}
                            onChangeText={(t) => updateForm('gstNumber', t)}
                            style={{ marginTop: 20 }}
                            maxLength={15}
                        />
                    </View>
                );
            case 4:
                return (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Bank Details</Text>
                        <Text style={styles.sectionSub}>Your earnings will be transferred to this account.</Text>

                        <Input
                            label="Bank Name"
                            placeholder="e.g. HDFC Bank"
                            value={form.bankName}
                            onChangeText={(t) => updateForm('bankName', t)}
                        />
                        <Input
                            label="Account Number"
                            placeholder="XXXXXXXXXX"
                            keyboardType="numeric"
                            value={form.accountNumber}
                            onChangeText={(t) => updateForm('accountNumber', t)}
                        />
                        <Input
                            label="IFSC Code"
                            placeholder="HDFC0001234"
                            value={form.ifsc}
                            onChangeText={(t) => updateForm('ifsc', t)}
                            autoCapitalize="characters"
                        />

                        <View style={[styles.infoBox, { backgroundColor: '#FFF3E0', borderColor: '#FFE0B2' }]}>
                            <Text style={[styles.infoText, { color: '#E65100' }]}>
                                Ensure these details are correct. Incorrect details will delay your payouts.
                            </Text>
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                    <ChevronLeft size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Partner Registration</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Stepper */}
            <View style={styles.stepperContainer}>
                {STEPS.map((step, index) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;

                    return (
                        <View key={step.id} style={styles.stepItem}>
                            <View style={[
                                styles.stepCircle,
                                isActive && styles.activeStepCircle,
                                isCompleted && styles.completedStepCircle
                            ]}>
                                {isCompleted ? (
                                    <Check size={16} color={COLORS.white} />
                                ) : (
                                    <step.icon size={16} color={isActive ? COLORS.white : COLORS.textLight} />
                                )}
                            </View>
                            <Text style={[
                                styles.stepLabel,
                                isActive && styles.activeStepLabel
                            ]}>{step.title}</Text>
                            {index < STEPS.length - 1 && (
                                <View style={[
                                    styles.connectorLine,
                                    (isCompleted || isActive) && styles.activeConnector
                                ]} />
                            )}
                        </View>
                    );
                })}
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {renderStepContent()}
            </ScrollView>

            <View style={styles.footer}>
                {currentStep < 4 ? (
                    <Button title="Next" onPress={handleNext} />
                ) : (
                    <Button title="Submit Application" onPress={handleSubmit} loading={isLoading} />
                )}
            </View>
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
    stepperContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 20,
        backgroundColor: COLORS.surface,
        marginBottom: 8,
        elevation: 1,
    },
    stepItem: {
        alignItems: 'center',
        position: 'relative',
        flex: 1,
    },
    stepCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
        zIndex: 2,
    },
    activeStepCircle: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    completedStepCircle: {
        backgroundColor: COLORS.success,
        borderColor: COLORS.success,
    },
    stepLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        fontWeight: '600',
    },
    activeStepLabel: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    connectorLine: {
        position: 'absolute',
        top: 18,
        left: '50%',
        right: '-50%',
        height: 2,
        backgroundColor: COLORS.border,
        zIndex: 1,
    },
    activeConnector: {
        backgroundColor: COLORS.primary, // Or success
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    sectionSub: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 24,
    },
    inputDisable: {
        opacity: 0.7,
        backgroundColor: COLORS.surface,
    },
    footer: {
        padding: 16,
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    infoBox: {
        backgroundColor: COLORS.primaryLight + '40',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
    },
    infoText: {
        color: COLORS.primary,
        fontSize: 13,
    },
    label: {
        marginBottom: 8,
        color: COLORS.text,
        fontWeight: '500',
    },
    uploadBox: {
        height: 150,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
    },
    uploadText: {
        marginTop: 12,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    uploadSub: {
        marginTop: 4,
        fontSize: 12,
        color: COLORS.textLight,
    }
});
