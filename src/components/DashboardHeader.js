import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/theme';
import { MapPin, Bell, User } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

export default function DashboardHeader() {
    const { user, isDutyOn, toggleDuty, partnerStatus } = useAuth();
    const isVerified = partnerStatus === 'APPROVED';

    const handleToggleDuty = () => {
        if (!isVerified) return;
        toggleDuty();
    };

    return (
        <View style={styles.header}>
            <View style={styles.headerTop}>
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <User size={20} color={COLORS.primary} />
                    </View>
                    <View style={{ marginLeft: 12 }}>
                        <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Partner'}</Text>
                        <View style={styles.locationRow}>
                            <MapPin size={12} color={COLORS.textLight} />
                            <Text style={styles.locationText}>Chennai, India</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.notificationBtn}>
                    <View style={styles.redDot} />
                    <Bell size={24} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            {isVerified && (
                <View style={styles.statusContainer}>
                    <View style={styles.statusTextContainer}>
                        <View style={[styles.statusDot, { backgroundColor: isDutyOn ? COLORS.success : COLORS.error }]} />
                        <Text style={styles.statusLabel}>
                            {isDutyOn ? 'You are Online' : 'You are Offline'}
                        </Text>
                    </View>
                    <Switch
                        value={isDutyOn}
                        onValueChange={handleToggleDuty}
                        trackColor={{ false: COLORS.border, true: COLORS.success }}
                        thumbColor={COLORS.white}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: THEME.spacing.m,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: COLORS.surface,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: COLORS.primaryLight + '40',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.primaryLight,
    },
    greeting: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    locationText: {
        fontSize: 12,
        color: COLORS.textLight,
        marginLeft: 4,
    },
    notificationBtn: {
        padding: 8,
        backgroundColor: COLORS.background,
        borderRadius: 12,
        position: 'relative',
    },
    redDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.error,
        zIndex: 2,
        borderWidth: 1,
        borderColor: COLORS.surface,
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    statusLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
});
