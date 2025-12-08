import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { MapPin, Calendar, Clock, Phone, Navigation, CheckCircle } from 'lucide-react-native';
import { useJob } from '../../context/JobContext';

export default function JobsScreen() {
    const [activeTab, setActiveTab] = useState('ACTIVE'); // ACTIVE | HISTORY
    const { activeJob, jobHistory, updateJobStatus, completeJob } = useJob();

    const handleStatusUpdate = () => {
        if (!activeJob) return;

        switch (activeJob.status) {
            case 'ACCEPTED':
                updateJobStatus('ON_THE_WAY');
                break;
            case 'ON_THE_WAY':
                updateJobStatus('ARRIVED');
                break;
            case 'ARRIVED':
                updateJobStatus('IN_PROGRESS');
                break;
            case 'IN_PROGRESS':
                Alert.alert(
                    "Complete Job",
                    "Are you sure you want to mark this job as completed?",
                    [
                        { text: "Cancel", style: "cancel" },
                        { text: "Yes, Complete", onPress: () => completeJob() }
                    ]
                );
                break;
            default:
                break;
        }
    };

    const getButtonLabel = (status) => {
        switch (status) {
            case 'ACCEPTED': return 'Start Travel';
            case 'ON_THE_WAY': return 'Mark Arrived';
            case 'ARRIVED': return 'Start Job';
            case 'IN_PROGRESS': return 'Complete Job';
            default: return 'Job Completed';
        }
    };

    const TabButton = ({ title, tab }) => (
        <TouchableOpacity
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
        >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{title}</Text>
        </TouchableOpacity>
    );

    const HistoryCard = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.serviceName}>{item.service}</Text>
                <Text style={styles.price}>₹{item.amount}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.customerName}>{item.customer}</Text>
            </View>
            <View style={styles.row}>
                <Clock size={16} color={COLORS.textLight} />
                <Text style={styles.cardText}>{item.date}</Text>
            </View>
            <View style={[styles.badge, styles.badgeDone]}>
                <Text style={styles.badgeText}>{item.status}</Text>
            </View>
        </View>
    );

    const ActiveJobView = () => {
        if (!activeJob) {
            return (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>No active jobs.</Text>
                    <Text style={styles.subEmptyText}>Go Online in Dashboard to receive new requests.</Text>
                </View>
            );
        }

        return (
            <ScrollView contentContainerStyle={styles.activeContainer}>
                <View style={styles.activeCard}>
                    <View style={styles.statusHeader}>
                        <Text style={styles.statusLabel}>STATUS</Text>
                        <View style={styles.activeBadge}>
                            <Text style={styles.activeBadgeText}>{activeJob.status.replace(/_/g, ' ')}</Text>
                        </View>
                    </View>

                    <Text style={styles.activeService}>{activeJob.service}</Text>
                    <Text style={styles.activePrice}>Earnings: ₹{activeJob.earnings}</Text>

                    <View style={styles.divider} />

                    <View style={styles.infoSection}>
                        <Text style={styles.infoLabel}>CUSTOMER</Text>
                        <Text style={styles.infoValue}>{activeJob.customer}</Text>
                        <Text style={styles.infoAddress}>{activeJob.address}</Text>
                    </View>

                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Phone size={24} color={COLORS.primary} />
                            <Text style={styles.iconBtnText}>Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Navigation size={24} color={COLORS.secondary} />
                            <Text style={styles.iconBtnText}>Navigate</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.mainActionBtn,
                            activeJob.status === 'IN_PROGRESS' && styles.completeBtn
                        ]}
                        onPress={handleStatusUpdate}
                    >
                        <Text style={styles.mainActionText}>
                            {getButtonLabel(activeJob.status)}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.tabs}>
                <TabButton title="Current Job" tab="ACTIVE" />
                <TabButton title="History" tab="HISTORY" />
            </View>

            {activeTab === 'ACTIVE' ? (
                <ActiveJobView />
            ) : (
                <FlatList
                    data={jobHistory}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <HistoryCard item={item} />}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyText}>No job history yet.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        padding: THEME.spacing.s,
        elevation: 2,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: COLORS.primary,
    },
    tabText: {
        fontWeight: 'bold',
        color: COLORS.textLight,
    },
    tabTextActive: {
        color: COLORS.primary,
    },
    list: {
        padding: THEME.spacing.m,
    },
    card: {
        backgroundColor: COLORS.surface,
        padding: THEME.spacing.m,
        marginBottom: THEME.spacing.m,
        borderRadius: THEME.borderRadius.m,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    serviceName: {
        fontSize: THEME.fontSize.m,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    customerName: {
        fontSize: THEME.fontSize.m,
        color: COLORS.text,
        fontWeight: '500',
    },
    price: {
        fontSize: THEME.fontSize.m,
        fontWeight: 'bold',
        color: COLORS.success,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    cardText: {
        marginLeft: 8,
        color: COLORS.textLight,
        fontSize: THEME.fontSize.s,
    },
    badge: {
        alignSelf: 'flex-start',
        marginTop: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    badgeDone: {
        backgroundColor: '#E8F5E9',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.success,
    },
    empty: {
        alignItems: 'center',
        marginTop: 40,
        padding: 20,
    },
    emptyText: {
        color: COLORS.textLight,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subEmptyText: {
        color: COLORS.textLight,
        textAlign: 'center',
    },

    // Active Job Styles
    activeContainer: {
        padding: THEME.spacing.m,
    },
    activeCard: {
        backgroundColor: COLORS.surface,
        borderRadius: THEME.borderRadius.l,
        padding: THEME.spacing.l,
        elevation: 4,
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        fontWeight: 'bold',
    },
    activeBadge: {
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    activeBadgeText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 12,
    },
    activeService: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    activePrice: {
        fontSize: 18,
        color: COLORS.success,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 16,
    },
    infoSection: {
        marginBottom: 20,
    },
    infoLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 18,
        color: COLORS.text,
        fontWeight: '600',
        marginBottom: 4,
    },
    infoAddress: {
        fontSize: 14,
        color: COLORS.textLight,
        lineHeight: 20,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 24,
    },
    iconBtn: {
        alignItems: 'center',
    },
    iconBtnText: {
        marginTop: 4,
        color: COLORS.text,
        fontSize: 12,
    },
    mainActionBtn: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: THEME.borderRadius.m,
        alignItems: 'center',
    },
    completeBtn: {
        backgroundColor: COLORS.success,
    },
    mainActionText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    }
});
