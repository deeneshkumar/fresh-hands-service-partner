import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { IndianRupee, TrendingUp, Calendar, CheckCircle2, Gift, ChevronRight, Award } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useJob } from '../../context/JobContext';

const { width } = Dimensions.get('window');

export default function EarningsScreen({ navigation }) {
    const { partnerStatus } = useAuth();
    const { jobHistory } = useJob();

    if (partnerStatus !== 'APPROVED') {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <View style={{ padding: 20, backgroundColor: COLORS.surface, borderRadius: 16, alignItems: 'center', width: '100%' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>Access Restricted</Text>
                    <Text style={{ textAlign: 'center', color: COLORS.textLight, marginBottom: 20 }}>
                        Please complete your partner registration and get approved to view earnings.
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

    // Calculate Earnings
    const today = new Date().toISOString().split('T')[0];
    const todayJobs = jobHistory.filter(j => j.date === today);
    const todayEarnings = todayJobs.reduce((acc, curr) => acc + curr.amount, 0);

    // Mock Weekly Data (for demonstration)
    const weekEarnings = 4850;
    const weekJobs = 12;

    const IncentiveCard = () => (
        <View style={styles.incentiveCard}>
            <View style={styles.incentiveHeader}>
                <Award size={32} color={COLORS.warning} />
                <View style={{ marginLeft: 12 }}>
                    <Text style={styles.incentiveTitle}>Unlock Extra Bonus! 🧠</Text>
                    <Text style={styles.incentiveSub}>Complete 3 more jobs to earn ₹200</Text>
                </View>
            </View>

            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '60%' }]} />
                </View>
                <View style={styles.progressLabels}>
                    <Text style={styles.progressText}>2/5 Jobs Done</Text>
                    <Text style={styles.targetText}>Target: ₹200</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.incentiveAction}>
                <Text style={styles.incentiveActionText}>View Details</Text>
                <ChevronRight size={16} color={COLORS.primary} />
            </TouchableOpacity>
        </View>
    );

    const StatBox = ({ title, value, icon: Icon, color, sub }) => (
        <View style={[styles.statBox, { borderTopColor: color }]}>
            <View style={styles.statHeader}>
                <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
                    <Icon size={24} color={color} />
                </View>
                <Text style={styles.statValue}>{value}</Text>
            </View>
            <Text style={styles.statTitle}>{title}</Text>
            {sub && <Text style={styles.statSub}>{sub}</Text>}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Earnings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.statsGrid}>
                    <StatBox
                        title="Today's Earnings"
                        value={`₹${todayEarnings}`}
                        icon={IndianRupee}
                        color={COLORS.success}
                        sub={`${todayJobs.length} Jobs completed`}
                    />
                    <StatBox
                        title="This Week"
                        value={`₹${weekEarnings}`}
                        icon={TrendingUp}
                        color={COLORS.primary}
                        sub={`${weekJobs} Jobs completed`}
                    />
                </View>

                <IncentiveCard />

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Incentives & Bonuses</Text>
                    </View>
                    <View style={styles.emptyBonusBox}>
                        <Gift size={32} color={COLORS.textLight} />
                        <Text style={styles.emptyBonusText}>₹0 Incentives</Text>
                        <Text style={styles.potentialText}>Keep up the great work! Bonuses are unlocked based on your performance and customer ratings.</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Jobs</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    {todayJobs.length > 0 ? (
                        todayJobs.map((job, idx) => (
                            <View key={idx} style={styles.jobRow}>
                                <View style={styles.jobInfo}>
                                    <Text style={styles.jobService}>{job.service}</Text>
                                    <View style={styles.jobSub}>
                                        <Calendar size={12} color={COLORS.textLight} />
                                        <Text style={styles.jobDate}>{job.date}</Text>
                                    </View>
                                </View>
                                <View style={styles.jobPrice}>
                                    <Text style={styles.priceAmount}>+ ₹{job.amount}</Text>
                                    <View style={styles.statusBadge}>
                                        <CheckCircle2 size={10} color={COLORS.success} />
                                        <Text style={styles.statusText}>Done</Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyRecent}>
                            <Text style={styles.emptyRecentText}>No jobs today yet.</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: 16,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    content: {
        padding: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statBox: {
        width: (width - 48) / 2,
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 16,
        borderTopWidth: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    statHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    statTitle: {
        fontSize: 14,
        color: COLORS.textLight,
        fontWeight: '500',
    },
    statSub: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 4,
    },
    incentiveCard: {
        backgroundColor: COLORS.surface,
        padding: 20,
        borderRadius: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: COLORS.warning + '40',
        elevation: 4,
        shadowColor: COLORS.warning,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    incentiveHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    incentiveTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    incentiveSub: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 2,
    },
    progressContainer: {
        marginBottom: 16,
    },
    progressBar: {
        height: 8,
        backgroundColor: COLORS.border,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.warning,
        borderRadius: 4,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    progressText: {
        fontSize: 12,
        color: COLORS.text,
        fontWeight: '600',
    },
    targetText: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    incentiveAction: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    incentiveActionText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        marginRight: 4,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    seeAll: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    emptyBonusBox: {
        backgroundColor: COLORS.surface,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    emptyBonusText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: 12,
    },
    potentialText: {
        fontSize: 13,
        color: COLORS.textLight,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 18,
    },
    jobRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    jobInfo: {
        flex: 1,
    },
    jobService: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    jobSub: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    jobDate: {
        fontSize: 12,
        color: COLORS.textLight,
        marginLeft: 4,
    },
    jobPrice: {
        alignItems: 'flex-end',
    },
    priceAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.success,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    statusText: {
        fontSize: 10,
        color: COLORS.success,
        fontWeight: 'bold',
        marginLeft: 2,
    },
    emptyRecent: {
        padding: 20,
        alignItems: 'center',
    },
    emptyRecentText: {
        color: COLORS.textLight,
    }
});
