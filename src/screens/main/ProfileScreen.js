import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { User, Settings, FileText, LogOut, HelpCircle, ChevronRight, Bell, Shield, Wallet } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';

export default function ProfileScreen({ navigation }) {
    const { logout, user } = useAuth();
    const [settingsVisible, setSettingsVisible] = useState(false);

    const MenuItem = ({ icon: Icon, title, onPress, danger, value }) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.iconBox, danger && styles.iconBoxDanger]}>
                    <Icon size={20} color={danger ? COLORS.error : COLORS.primary} />
                </View>
                <Text style={[styles.menuText, danger && styles.textDanger]}>{title}</Text>
            </View>
            {value ? (
                <Text style={styles.valueText}>{value}</Text>
            ) : (
                <ChevronRight size={20} color={COLORS.textLight} />
            )}
        </TouchableOpacity>
    );

    const handleDocuments = () => {
        Alert.alert("My Documents", "View your uploaded ID and Certificates here. (Coming Soon)");
    };

    const handleSupport = () => {
        Alert.alert("Support", "Contact us at support@freshhands.com or call +91 99999 88888");
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
                    </Text>
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.name}>{user?.name || 'Guest User'}</Text>
                    <Text style={styles.phone}>+91 {user?.phone || 'Unknown'}</Text>
                    {user?.service && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{user.service}</Text>
                        </View>
                    )}
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.menu}>
                <Text style={styles.sectionHeader}>Account</Text>
                <MenuItem
                    icon={FileText}
                    title="My Documents"
                    onPress={handleDocuments}
                />
                <MenuItem
                    icon={Wallet}
                    title="Wallet & Earnings"
                    onPress={() => navigation.navigate('Wallet')}
                />

                <Text style={styles.sectionHeader}>Preferences</Text>
                <MenuItem
                    icon={Settings}
                    title="Settings"
                    onPress={() => setSettingsVisible(true)}
                />
                <MenuItem
                    icon={HelpCircle}
                    title="Support & Help"
                    onPress={handleSupport}
                />

                <Text style={styles.sectionHeader}>Actions</Text>
                <MenuItem icon={LogOut} title="Logout" onPress={logout} danger />
            </ScrollView>

            {/* Settings Modal */}
            <Modal
                visible={settingsVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setSettingsVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Settings</Text>
                        <TouchableOpacity onPress={() => setSettingsVisible(false)}>
                            <Text style={styles.closeText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalContent}>
                        <View style={styles.settingRow}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Bell size={20} color={COLORS.text} style={{ marginRight: 12 }} />
                                <Text style={styles.settingText}>Push Notifications</Text>
                            </View>
                            <Switch value={true} trackColor={{ true: COLORS.primary }} />
                        </View>
                        <View style={styles.settingRow}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Shield size={20} color={COLORS.text} style={{ marginRight: 12 }} />
                                <Text style={styles.settingText}>Privacy Mode</Text>
                            </View>
                            <Switch value={false} trackColor={{ true: COLORS.primary }} />
                        </View>

                        <Text style={styles.versionText}>Version 1.0.0</Text>
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
    header: {
        backgroundColor: COLORS.surface,
        padding: THEME.spacing.l,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    userInfo: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    phone: {
        marginTop: 2,
        color: COLORS.textLight,
        fontSize: 14,
    },
    badge: {
        backgroundColor: COLORS.success + '20',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    badgeText: {
        color: COLORS.success,
        fontSize: 12,
        fontWeight: '600',
    },
    menu: {
        padding: THEME.spacing.m,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textLight,
        marginTop: 16,
        marginBottom: 8,
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.surface,
        padding: 16,
        marginBottom: 8,
        borderRadius: 12,
        // Shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: COLORS.primaryLight + '20', // transparent primary
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    iconBoxDanger: {
        backgroundColor: COLORS.error + '20',
    },
    menuText: {
        fontSize: 16,
        color: COLORS.text,
        fontWeight: '500',
    },
    valueText: {
        color: COLORS.textLight,
        fontSize: 14,
    },
    textDanger: {
        color: COLORS.error,
    },
    // Modal
    modalContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: COLORS.surface,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 16,
    },
    modalContent: {
        padding: 20,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    settingText: {
        fontSize: 16,
        color: COLORS.text,
    },
    versionText: {
        marginTop: 40,
        textAlign: 'center',
        color: COLORS.textLight,
    }
});
