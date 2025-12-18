
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Modal, SectionList, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Check, Upload, CreditCard, User, Briefcase, FileText, ChevronDown, X, Camera, Award } from 'lucide-react-native';

const STEPS = [
    { id: 1, title: "Personal", icon: User },
    { id: 2, title: "Work", icon: Briefcase },
    { id: 3, title: "ID Check", icon: FileText },
    { id: 4, title: "Selfie", icon: Camera },
    { id: 5, title: "Skills", icon: Award },
    { id: 6, title: "Bank", icon: CreditCard },
];

const SERVICES_DATA = [
    { title: 'Cleaning', data: ['Home Cleaner (Full)', 'Kitchen Cleaning', 'Bathroom Cleaning'] },
    { title: 'Repairs', data: ['Plumber', 'Electrician', 'Carpenter'] },
    { title: 'Vehicle Services', data: ['Car Wash', 'Bike Service'] },
    { title: 'Lifestyle & Home', data: ['Interior Design', 'House Painting'] },
    { title: 'Tech Services', data: ['AC Service & Repair', 'Laptop / PC Repair'] },
    { title: 'Pest Control', data: ['General Pest Control', 'Termite Treatment'] },
    { title: 'Relocation', data: ['House Shifting (Small)', 'Vehicle Moving'] },
    { title: 'Quick Fix', data: ['Door Lock Repair', 'Curtain Rod Installation'] },
    { title: 'Salon', data: ['Men’s Haircut', 'Women’s Haircut'] },
    { title: 'Massage', data: ['Full Body Massage', 'Head & Shoulder Massage'] },
];

export default function RegistrationScreen({ route, navigation }) {
    const { user, registerPartner, isLoading } = useAuth();
    const phone = route?.params?.phone || user?.phone || '+919876543210';
    const [currentStep, setCurrentStep] = useState(1);
    const [serviceModalVisible, setServiceModalVisible] = useState(false);

    const [form, setForm] = useState({
        name: user?.name || '',
        address: user?.address || '',
        city: user?.city || '',
        category: '',
        serviceArea: '', // New field
        experience: '',
        aadharNumber: '',
        panNumber: '',
        gstNumber: '', // Optional
        aadharUploaded: false,
        panUploaded: false,
        hasShop: false,
        shopName: '',
        shopAddress: '',
        shopPhotoUploaded: false,
        selfieUploaded: false,
        workPhotosUploaded: false,
        skillDescription: '',
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
                if (!form.name || !form.address || !form.city) {
                    Alert.alert("Missing Details", "Please fill in all personal details.");
                    return false;
                }
                return true;
            case 2:
                if (!form.category || !form.experience || !form.serviceArea) {
                    Alert.alert("Missing Details", "Please fill in all professional details, including service area.");
                    return false;
                }
                return true;
            case 3:
                if (!form.aadharNumber || form.aadharNumber.length < 12) {
                    Alert.alert("Invalid ID", "Please enter a valid 12-digit Aadhar number.");
                    return false;
                }
                if (!form.panNumber || form.panNumber.length < 10) {
                    Alert.alert("Invalid ID", "Please enter a valid 10-character PAN number.");
                    return false;
                }
                if (!form.aadharUploaded || !form.panUploaded) {
                    Alert.alert("Missing Documents", "Please upload both Aadhar and PAN card images.");
                    return false;
                }
                return true;
            case 4:
                // Mock validation for selfie
                // In real app check form.selfieUploaded
                return true;
            case 5:
                if (!form.skillDescription) {
                    Alert.alert("Missing Info", "Please provide a brief description of your skills or references.");
                    return false;
                }
                if (form.hasShop) {
                    if (!form.shopName || !form.shopAddress) {
                        Alert.alert("Missing Shop Details", "Please fill in Shop Name and Address.");
                        return false;
                    }
                    if (!form.shopPhotoUploaded) {
                        Alert.alert("Missing Photo", "Please upload a photo of your shop.");
                        return false;
                    }
                }
                return true;
            case 6:
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

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={handleBack} style={{ marginRight: 16 }}>
                    <ArrowLeft size={24} color={COLORS.text} />
                </TouchableOpacity>
            ),
        });
    }, [navigation, currentStep]);

    const handleSubmit = async () => {
        if (!validateStep(6)) return;

        try {
            await registerPartner({ ...form, phone });
            // Success logic is handled by AuthContext or we navigate manually
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
                            maxLength={25}
                        />
                        <Input
                            label="Full Address"
                            placeholder="Current Address"
                            value={form.address}
                            onChangeText={(t) => updateForm('address', t)}
                            multiline
                            maxLength={100}

                            style={{ minHeight: 80, maxHeight: 100, textAlignVertical: 'top' }}
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

                        <Text style={styles.label}>Service Category</Text>
                        <TouchableOpacity
                            style={styles.dropdownSelector}
                            onPress={() => setServiceModalVisible(true)}
                        >
                            <Text style={[styles.dropdownText, !form.category && { color: COLORS.textLight }]}>
                                {form.category || "Select Service Category"}
                            </Text>
                            <ChevronDown size={20} color={COLORS.textLight} />
                        </TouchableOpacity>

                        <Input
                            label="Preferred Service Area"
                            placeholder="e.g. Anna Nagar, T. Nagar"
                            value={form.serviceArea}
                            onChangeText={(t) => updateForm('serviceArea', t)}
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
                        <Text style={styles.sectionSub}>Provide government IDs for trust & safety.</Text>

                        <Input
                            label="Aadhar Number"
                            placeholder="12-digit Aadhar Number"
                            value={form.aadharNumber}
                            onChangeText={(t) => updateForm('aadharNumber', t)}
                            keyboardType="numeric"
                            maxLength={12}
                        />

                        <TouchableOpacity
                            style={[styles.uploadBox, { height: 100, marginBottom: 20, marginTop: 4 }]}
                            onPress={() => updateForm('aadharUploaded', !form.aadharUploaded)}
                        >
                            {form.aadharUploaded ? (
                                <View style={{ alignItems: 'center' }}>
                                    <Check size={24} color={COLORS.primary} />
                                    <Text style={styles.uploadText}>Aadhar Uploaded</Text>
                                </View>
                            ) : (
                                <>
                                    <Upload size={24} color={COLORS.primary} />
                                    <Text style={styles.uploadText}>Upload Aadhar Card</Text>
                                    <Text style={styles.uploadSub}>Front & Back</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <Input
                            label="PAN Number"
                            placeholder="10-character PAN (e.g. ABCDE1234F)"
                            value={form.panNumber}
                            onChangeText={(t) => updateForm('panNumber', t)}
                            autoCapitalize="characters"
                            maxLength={10}
                        />

                        <TouchableOpacity
                            style={[styles.uploadBox, { height: 100, marginBottom: 20, marginTop: 4 }]}
                            onPress={() => updateForm('panUploaded', !form.panUploaded)}
                        >
                            {form.panUploaded ? (
                                <View style={{ alignItems: 'center' }}>
                                    <Check size={24} color={COLORS.primary} />
                                    <Text style={styles.uploadText}>PAN Uploaded</Text>
                                </View>
                            ) : (
                                <>
                                    <Upload size={24} color={COLORS.primary} />
                                    <Text style={styles.uploadText}>Upload PAN Card</Text>
                                </>
                            )}
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
                        <Text style={styles.sectionTitle}>Selfie Verification</Text>
                        <Text style={styles.sectionSub}>Take a live selfie to verify your identity. No gallery photos allowed.</Text>

                        <View style={{ alignItems: 'center', marginVertical: 32 }}>
                            <View style={{
                                width: 150, height: 150, borderRadius: 75,
                                backgroundColor: COLORS.surface, borderWidth: 2, borderColor: COLORS.border,
                                justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed'
                            }}>
                                <User size={64} color={COLORS.textLight} />
                            </View>
                            <TouchableOpacity style={{ marginTop: 24, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, padding: 12, borderRadius: 8 }}>
                                <Camera size={20} color={COLORS.white} style={{ marginRight: 8 }} />
                                <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>Open Camera</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.infoBox}>
                            <Text style={styles.infoText}>Ensure good lighting and remove glasses/masks.</Text>
                        </View>
                    </View>
                );
            case 5:
                return (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Skill Check</Text>
                        <Text style={styles.sectionSub}>Showcase your capability for {form.category || 'your service'}.</Text>

                        <Text style={styles.label}>Past Work Photos</Text>
                        <TouchableOpacity style={styles.uploadBox}>
                            <Upload size={32} color={COLORS.primary} />
                            <Text style={styles.uploadText}>Upload 2-3 Work Photos</Text>
                            <Text style={styles.uploadSub}>e.g. Fixed pipes, Cleaned room</Text>
                        </TouchableOpacity>

                        <View style={{ height: 20 }} />

                        <Input
                            label={`Experience / References(${form.category || 'General'})`}
                            placeholder="Describe your past work or provide reference contacts..."
                            multiline
                            numberOfLines={4}
                            value={form.skillDescription}
                            onChangeText={(t) => updateForm('skillDescription', t)}
                            style={{ height: 100, textAlignVertical: 'top' }}
                        />

                        {/* Shop Reference Toggle */}
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}
                            onPress={() => updateForm('hasShop', !form.hasShop)}
                        >
                            <View style={{
                                width: 24, height: 24, borderRadius: 4, borderWidth: 2,
                                borderColor: form.hasShop ? COLORS.primary : COLORS.border,
                                alignItems: 'center', justifyContent: 'center', marginRight: 10,
                                backgroundColor: form.hasShop ? COLORS.primary : 'transparent'
                            }}>
                                {form.hasShop && <Check size={16} color={COLORS.white} />}
                            </View>
                            <Text style={{ color: COLORS.text, fontWeight: '500' }}>I have an offline shop / office</Text>
                        </TouchableOpacity>

                        {form.hasShop && (
                            <View style={{ marginLeft: 8, paddingLeft: 12, borderLeftWidth: 2, borderLeftColor: COLORS.border }}>
                                <Input
                                    label="Shop Name"
                                    placeholder="e.g. Siva Electronics"
                                    value={form.shopName}
                                    onChangeText={(t) => updateForm('shopName', t)}
                                />
                                <Input
                                    label="Shop Address"
                                    placeholder="Address of your shop"
                                    value={form.shopAddress}
                                    onChangeText={(t) => updateForm('shopAddress', t)}
                                />
                                <Text style={styles.label}>Shop Photo</Text>
                                <TouchableOpacity
                                    style={[styles.uploadBox, { height: 120, marginBottom: 20 }]}
                                    onPress={() => updateForm('shopPhotoUploaded', !form.shopPhotoUploaded)}
                                >
                                    {form.shopPhotoUploaded ? (
                                        <View style={{ alignItems: 'center' }}>
                                            <Check size={24} color={COLORS.primary} />
                                            <Text style={styles.uploadText}>Photo Uploaded</Text>
                                        </View>
                                    ) : (
                                        <>
                                            <Camera size={32} color={COLORS.primary} />
                                            <Text style={styles.uploadText}>Take/Upload Shop Photo</Text>
                                            <Text style={styles.uploadSub}>Showcase your shop board or interior</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}

                        <View style={[styles.infoBox, { backgroundColor: '#E3F2FD' }]}>
                            <Text style={[styles.infoText, { color: '#1565C0' }]}>
                                Verification: We may call your references or conduct a field audit later.
                            </Text>
                        </View>
                    </View>
                );
            case 6:
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
        <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
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

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    {renderStepContent()}
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={styles.footer}>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    {currentStep > 1 && (
                        <View style={{ flex: 1 }}>
                            <Button title="Previous" onPress={handleBack} variant="outline" />
                        </View>
                    )}
                    <View style={{ flex: 1 }}>
                        {currentStep < 6 ? (
                            <Button title="Next" onPress={handleNext} />
                        ) : (
                            <Button title="Submit" onPress={handleSubmit} loading={isLoading} />
                        )}
                    </View>
                </View>
            </View>
            {/* Service Selection Modal */}
            <Modal
                visible={serviceModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setServiceModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Service Category</Text>
                            <TouchableOpacity onPress={() => setServiceModalVisible(false)} style={styles.closeButton}>
                                <X size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>

                        <SectionList
                            sections={SERVICES_DATA}
                            keyExtractor={(item, index) => item + index}
                            renderSectionHeader={({ section: { title } }) => (
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionHeaderText}>{title}</Text>
                                </View>
                            )}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.optionItem}
                                    onPress={() => {
                                        updateForm('category', item);
                                        setServiceModalVisible(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        form.category === item && styles.optionTextSelected
                                    ]}>{item}</Text>
                                    {form.category === item && <Check size={20} color={COLORS.primary} />}
                                </TouchableOpacity>
                            )}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    // ... (header, stepperContainer, stepItem, stepCircle, activeStepCircle, 
    // completedStepCircle, stepLabel, activeStepLabel, connectorLine, 
    // activeConnector, content styles remain same)

    // Explicitly re-adding kept styles for clarity if needed, or just appending new ones.
    // Ideally I should merge, but since I am replacing the end of the file, I need to be careful.
    // I will use replace_file_content with targeted ranges to append styles or replace the style block.

    // Wait, the previous tool only replaced the renderStepContent.
    // I need to insert the Modal before `</SafeAreaView > ` and add styles.

    // I will just return the styles object extended.

    header: {
        // ... (lines 292-300)
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
        justifyContent: 'center',
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
        backgroundColor: COLORS.primary,
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 16, // Reduced from 24
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 12, // Reduced from 20
    },
    sectionSub: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 16, // Reduced from 24
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
        marginBottom: 6, // Reduced from 8
        color: COLORS.text,
        fontWeight: '500',
        fontSize: 14,
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
    },
    // Dropdown Styles
    dropdownSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: COLORS.surface,
        marginBottom: 16,
    },
    dropdownText: {
        fontSize: 16,
        color: COLORS.text,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    closeButton: {
        padding: 4,
    },
    sectionHeader: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    sectionHeaderText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.textLight,
        textTransform: 'uppercase',
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border + '80', // semi-transparent
    },
    optionText: {
        fontSize: 16,
        color: COLORS.text,
    },
    optionTextSelected: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
});
