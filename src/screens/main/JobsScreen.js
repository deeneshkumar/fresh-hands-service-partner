import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { MapPin, Calendar, Clock, Phone, Navigation, CheckCircle, ChevronLeft, IndianRupee, Info, User } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useJob } from '../../context/JobContext';
import TrackingMap from '../../components/TrackingMap';
import NavigationModal from '../../components/NavigationModal';

const { width, height } = Dimensions.get('window');

export default function JobsScreen({ navigation }) {
    const { partnerStatus } = useAuth();
    const [activeTab, setActiveTab] = useState('ACTIVE'); // ACTIVE | HISTORY
    const { assignments, activeJob, incomingJob, jobHistory, updateJobStatus, completeJob, acceptJob, rejectJob, cancelJob, startSimulation, partnerLocation, routeInfo } = useJob();
    const [filterPeriod, setFilterPeriod] = useState('ALL'); // ALL | TODAY | WEEK | MONTH

    // Navigation Modal State
    const [navModalVisible, setNavModalVisible] = useState(false);
    const [navJob, setNavJob] = useState(null);

    if (partnerStatus !== 'APPROVED') {
        // ... (Access Restricted View)
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <View style={{ padding: 20, backgroundColor: COLORS.surface, borderRadius: 16, alignItems: 'center', width: '100%' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>Access Restricted</Text>
                    <Text style={{ textAlign: 'center', color: COLORS.textLight, marginBottom: 20 }}>
                        Please complete your partner registration and get approved to view jobs and history.
                    </Text>
                    <TouchableOpacity
                        style={{ backgroundColor: COLORS.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }}
                        onPress={() => navigation.navigate('Dashboard')}
                    >
                        <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>Go to Dashboard</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const handleStatusUpdate = (job) => {
        if (!job) return;

        switch (job.status) {
            case 'ACCEPTED':
                // Start Simulation & Navigate
                if (startSimulation) {
                    startSimulation(job);
                }
                setNavJob(job);
                setNavModalVisible(true);
                break;
            case 'ON_THE_WAY':
                // Resume Navigation if closed, or just show map? 
                // For now, re-open navigation
                setNavJob(job);
                setNavModalVisible(true);
                break;
            case 'ARRIVED':
                updateJobStatus(job.id, 'IN_PROGRESS');
                break;
            case 'IN_PROGRESS':
                Alert.alert(
                    "Complete Job",
                    "Are you sure you want to mark this job as completed?",
                    [
                        { text: "Cancel", style: "cancel" },
                        { text: "Yes, Complete", onPress: () => completeJob(job.id) }
                    ]
                );
                break;
            default:
                break;
        }
    };

    const handleArrivedFromModal = () => {
        if (navJob) {
            updateJobStatus(navJob.id, 'ARRIVED');
            setNavModalVisible(false);
            setNavJob(null);
            Alert.alert("You've Arrived!", "Marked as arrived at customer location.");
        }
    };

    const getButtonLabel = (status) => {
        switch (status) {
            case 'ACCEPTED': return 'Start Travel & Navigate';
            case 'ON_THE_WAY': return 'Continue Navigation';
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

    const filterHistory = (history) => {
        if (filterPeriod === 'ALL') return history;
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        return history.filter(item => {
            const itemDate = new Date(item.date);
            if (filterPeriod === 'TODAY') return item.date === today;
            if (filterPeriod === 'WEEK') {
                const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return itemDate >= oneWeekAgo;
            }
            if (filterPeriod === 'MONTH') {
                const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                return itemDate >= oneMonthAgo;
            }
            return true;
        });
    };

    const Header = () => (
        <View style={styles.localHeader}>
            <Text style={styles.headerTitle}>Jobs & History</Text>
        </View>
    );

    // RENDER ITEM FOR ACTIVE JOBS LIST
    const ActiveJobItem = ({ job }) => (
        <View style={{ marginBottom: 24 }} key={job.id}>
            <TrackingMap
                job={job}
                partnerLocation={job.status === 'ON_THE_WAY' ? partnerLocation : null}
            />

            <View style={styles.activeCard}>
                <View style={styles.activeHeader}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={styles.jobId}>Job #{job.id ? job.id.slice(-6) : '...'}</Text>
                        <Text style={styles.serviceName} numberOfLines={2} adjustsFontSizeToFit>{job.service}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', flexShrink: 0 }}>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>{job.status.replace('_', ' ')}</Text>
                        </View>
                        <View style={{
                            marginTop: 6,
                            backgroundColor: job.type === 'INSTANT' ? '#FFEBEE' : '#E3F2FD',
                            paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
                            borderWidth: 1, borderColor: job.type === 'INSTANT' ? '#FFCDD2' : '#BBDEFB'
                        }}>
                            <Text style={{
                                color: job.type === 'INSTANT' ? '#D32F2F' : '#1976D2',
                                fontSize: 10, fontWeight: '800'
                            }}>
                                {job.type === 'INSTANT' ? '⚡ INSTANT' : '📅 SCHEDULED'}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                    <MapPin size={20} color={COLORS.primary} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={styles.label}>Location</Text>
                        <Text style={styles.value}>{job.location}</Text>
                        <Text style={styles.address}>{job.address}</Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <User size={20} color={COLORS.primary} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={styles.label}>Customer</Text>
                        <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>{job.customer}</Text>
                    </View>
                </View>

                {job.type === 'SCHEDULED' && job.scheduledTime && (
                    <View style={styles.infoRow}>
                        <Clock size={20} color={COLORS.secondary} />
                        <View style={{ marginLeft: 12, flex: 1 }}>
                            <Text style={styles.label}>Scheduled For</Text>
                            <Text style={styles.value}>
                                {new Date(job.scheduledTime).toLocaleDateString()} at {new Date(job.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                    </View>
                )}

                <View style={styles.infoRow}>
                    <IndianRupee size={20} color={COLORS.success} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={styles.label}>Estimated Earnings</Text>
                        <Text style={[styles.value, { color: COLORS.success }]}>₹{job.earnings}</Text>
                    </View>
                </View>

                <View style={styles.actionSection}>
                    <TouchableOpacity
                        style={[styles.statusBtn, job.status === 'IN_PROGRESS' && styles.completeBtn]}
                        onPress={() => handleStatusUpdate(job)}
                    >
                        <Text style={styles.statusBtnText}>{getButtonLabel(job.status)}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.statusBtn, { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.error, flex: 0.4 }]}
                        onPress={() => {
                            Alert.alert(
                                "Cancel Job",
                                "Are you sure you want to cancel this job?",
                                [
                                    { text: "No", style: "cancel" },
                                    { text: "Yes, Cancel", style: 'destructive', onPress: () => cancelJob(job.id) }
                                ]
                            );
                        }}
                    >
                        <Text style={[styles.statusBtnText, { color: COLORS.error }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const IncomingJobView = () => (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            <TrackingMap job={incomingJob} showRoute={false} />

            <View style={styles.activeCard}>
                <View style={styles.activeHeader}>
                    {/* ... */}
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={styles.jobId}>PENDING REQUEST</Text>
                        <Text style={styles.serviceName} numberOfLines={2} adjustsFontSizeToFit>{incomingJob.service}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', flexShrink: 0 }}>
                        <View style={[styles.statusBadge, { backgroundColor: COLORS.warning + '20' }]}>
                            <Text style={[styles.statusText, { color: COLORS.warning }]}>NEW</Text>
                        </View>
                    </View>
                </View>
                {/* ... existing Details ... */}
                <View style={styles.divider} />

                <View style={styles.infoRow}>
                    <MapPin size={20} color={COLORS.primary} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={styles.label}>Service Address</Text>
                        <Text style={styles.value}>{incomingJob.location}</Text>
                        <Text style={styles.address}>{incomingJob.address}</Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <User size={20} color={COLORS.primary} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={styles.label}>Customer</Text>
                        <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>{incomingJob.customer}</Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <IndianRupee size={20} color={COLORS.success} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={styles.label}>Price</Text>
                        <Text style={[styles.value, { color: COLORS.success }]}>₹{incomingJob.earnings}</Text>
                    </View>
                </View>

                <View style={styles.actionSection}>
                    <TouchableOpacity
                        style={styles.rejectFullBtn}
                        onPress={() => {
                            rejectJob();
                            Alert.alert("Job Rejected", "The request has been removed.");
                        }}
                    >
                        <Text style={styles.rejectFullBtnText}>Reject Job</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.acceptFullBtn}
                        onPress={() => {
                            acceptJob();
                            // Alert.alert("Job Accepted", "Please head to the customer location.");
                        }}
                    >
                        <Text style={styles.acceptFullBtnText}>Accept Job</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );

    const HistoryItem = ({ item }) => (
        <TouchableOpacity
            style={styles.historyCard}
            onPress={() => Alert.alert(
                "Job Details",
                `Service: ${item.service}\nCustomer: ${item.customer}\nDate: ${item.date}\nAmount: ₹${item.amount}\nStatus: ${item.status}`,
                [{ text: "Close" }]
            )}
        >
            <View style={styles.historyInfo}>
                <Text style={styles.historyService}>{item.service}</Text>
                <Text style={styles.historyCustomer}>{item.customer}</Text>
                <View style={styles.historyDateRow}>
                    <Calendar size={12} color={COLORS.textLight} />
                    <Text style={styles.historyDate}>{item.date}</Text>
                </View>
            </View>
            <View style={styles.historyRight}>
                <Text style={styles.historyAmount}>₹{item.amount}</Text>
                <View style={styles.completeBadge}>
                    <CheckCircle size={10} color={COLORS.success} />
                    <Text style={styles.completeText}>Done</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <NavigationModal
                visible={navModalVisible}
                onClose={() => setNavModalVisible(false)}
                job={navJob}
                partnerLocation={partnerLocation}
                routeInfo={routeInfo}
                onArrived={handleArrivedFromModal}
            />

            <Header />
            <View style={styles.tabBar}>
                <TabButton title="Current Jobs" tab="ACTIVE" />
                <TabButton title="History" tab="HISTORY" />
            </View>

            <View style={styles.content}>
                {activeTab === 'ACTIVE' ? (
                    assignments.length > 0 ? (
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                            {assignments.map(job => (
                                <ActiveJobItem key={job.id} job={job} />
                            ))}
                        </ScrollView>
                    ) : incomingJob ? (
                        <IncomingJobView />
                    ) : (
                        <View style={styles.emptyBox}>
                            <Text style={styles.emptyText}>No active or pending jobs right now.</Text>
                            <TouchableOpacity
                                style={styles.goBtn}
                                onPress={() => navigation.navigate('Dashboard')}
                            >
                                <Text style={styles.goBtnText}>Go to Dashboard</Text>
                            </TouchableOpacity>
                        </View>
                    )
                ) : (
                    <View style={{ flex: 1 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
                            {['ALL', 'TODAY', 'WEEK', 'MONTH'].map(period => (
                                <TouchableOpacity
                                    key={period}
                                    style={[styles.filterPill, filterPeriod === period && styles.filterPillActive]}
                                    onPress={() => setFilterPeriod(period)}
                                >
                                    <Text style={[styles.filterText, filterPeriod === period && styles.filterTextActive]}>
                                        {period.charAt(0) + period.slice(1).toLowerCase()}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <FlatList
                            data={filterHistory(jobHistory)}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <HistoryItem item={item} />}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            ListEmptyComponent={
                                <View style={styles.emptyBox}>
                                    <Text style={styles.emptyText}>No jobs found for this period.</Text>
                                </View>
                            }
                        />
                    </View>
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
    localHeader: {
        padding: 16,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        padding: 6,
        margin: 16,
        borderRadius: 12,
        elevation: 2,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    tabActive: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textLight,
    },
    tabTextActive: {
        color: COLORS.white,
    },
    content: {
        flex: 1,
    },
    mapContainer: {
        height: 250,
        marginHorizontal: 16,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 4,
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
    },
    fullMap: {
        ...StyleSheet.absoluteFillObject,
        height: height,
        zIndex: 1000,
        borderRadius: 0,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    trackingOverlay: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        alignItems: 'center',
    },
    trackingInfo: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 16,
        elevation: 4,
        alignItems: 'center',
    },
    trackingStat: {
        alignItems: 'center',
    },
    trackingLabel: {
        fontSize: 10,
        color: COLORS.textLight,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    trackingValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    trackingDivider: {
        width: 1,
        height: 20,
        backgroundColor: COLORS.border,
        marginHorizontal: 20,
    },
    navHeader: {
        position: 'absolute',
        top: 40,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 12,
        borderRadius: 12,
    },
    navBackBtn: {
        padding: 4,
        marginRight: 12,
    },
    navTitle: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    expandBtn: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 24,
        elevation: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    expandBtnText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    customerMarker: {
        padding: 4,
    },
    partnerMarker: {
        padding: 4,
    },
    activeCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        padding: 20,
        marginHorizontal: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    activeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    jobId: {
        color: COLORS.textLight,
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 4,
    },
    serviceName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    statusBadge: {
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    statusText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 20,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center', // Ensure icon and text align vertically center if needed, or flex-start
    },
    label: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: 2,
    },
    value: {
        fontSize: 15, // Slightly adjust for compactness
        fontWeight: '700',
        color: COLORS.text,
    },
    address: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 4,
        lineHeight: 20,
    },
    actionSection: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 12,
    },
    statusBtn: {
        flex: 1,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        elevation: 2,
    },
    completeBtn: {
        backgroundColor: COLORS.success,
    },
    statusBtnText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    filterBar: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        maxHeight: 60,
    },
    filterPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        marginRight: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    filterPillActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterText: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '600',
    },
    filterTextActive: {
        color: COLORS.white,
    },
    historyCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        elevation: 2,
    },
    historyInfo: {
        flex: 1,
    },
    historyService: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    historyCustomer: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 4,
    },
    historyDateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    historyDate: {
        fontSize: 12,
        color: COLORS.textLight,
        marginLeft: 6,
    },
    historyRight: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    historyAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.success,
    },
    completeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    completeText: {
        fontSize: 11,
        color: COLORS.success,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    emptyBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100,
    },
    emptyText: {
        color: COLORS.textLight,
        fontSize: 16,
        marginBottom: 24,
    },
    goBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
        elevation: 2,
    },
    goBtnText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 15,
    },
    rejectFullBtn: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.error,
    },
    rejectFullBtnText: {
        color: COLORS.error,
        fontWeight: 'bold',
        fontSize: 16,
    },
    acceptFullBtn: {
        flex: 1.5,
        backgroundColor: COLORS.success,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    acceptFullBtnText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    }
});
