import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, Image } from 'react-native';
import { COLORS } from '../constants/colors';
import { MapPin, Navigation } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function LocationPermissionModal({ visible, onAllow }) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            statusBarTranslucent
            onRequestClose={() => { }} // Prevent hardware back button from closing
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.iconContainer}>
                        <View style={styles.iconCircle}>
                            <MapPin size={40} color={COLORS.primary} />
                        </View>
                        <View style={styles.iconBadge}>
                            <Navigation size={18} color={COLORS.white} />
                        </View>
                    </View>

                    <Text style={styles.title}>Enable Location Access</Text>
                    <Text style={styles.subtitle}>
                        Location access is mandatory. We need your location to assign nearby jobs and verify your presence.
                    </Text>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            • Find high-paying jobs in your area{'\n'}
                            • Get accurate navigation to customer location{'\n'}
                            • Verify your service presence
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.allowBtn} onPress={onAllow}>
                        <Text style={styles.allowBtnText}>Allow Location Access</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 24,
        position: 'relative',
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primaryLight + '40',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.success,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.textLight,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
        paddingHorizontal: 10,
    },
    infoBox: {
        backgroundColor: COLORS.background,
        padding: 16,
        borderRadius: 12,
        width: '100%',
        marginBottom: 24,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.text,
        lineHeight: 24,
    },
    allowBtn: {
        backgroundColor: COLORS.primary,
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    allowBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    denyBtn: {
        paddingVertical: 12,
    },
    denyBtnText: {
        color: COLORS.textLight,
        fontSize: 16,
        fontWeight: '600',
    },
});
