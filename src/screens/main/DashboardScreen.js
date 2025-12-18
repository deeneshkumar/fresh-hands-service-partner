import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Modal, TouchableOpacity, Dimensions, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { Briefcase, IndianRupee, Star, MapPin, Clock, ShieldCheck, ChevronRight, Gift, TrendingUp, Users, Bell, User, X } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useJob } from '../../context/JobContext';
import Button from '../../components/Button';
import DashboardHeader from '../../components/DashboardHeader';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
    const { user, isDutyOn, toggleDuty, partnerStatus, setPartnerStatus, logout } = useAuth();
    const { activeJob, incomingJob, acceptJob, rejectJob, simulateIncomingJob, jobHistory } = useJob();
    const [isRequestModalVisible, setIsRequestModalVisible] = useState(false);

    useEffect(() => {
        if (incomingJob) {
            setIsRequestModalVisible(true);
        }
    }, [incomingJob]);

    const handleViewDetails = () => {
        setIsRequestModalVisible(false);
        navigation.navigate('Jobs');
    };

    const handleCloseModal = () => {
        setIsRequestModalVisible(false);
    };

    const isVerified = partnerStatus === 'APPROVED';
    const isUnregistered = partnerStatus === 'UNREGISTERED';
    const isPending = partnerStatus === 'PENDING_VERIFICATION';

    const handleToggleDuty = () => {
        if (!isVerified) {
            Alert.alert("Registration Required", "Please complete your partner registration to go online.");
            return;
        }
        toggleDuty();
    };

    // --- SUB COMPONENTS ---

    const MarketingCard = ({ icon: Icon, title, desc, color, style }) => (
        <View style={[styles.marketingCard, style]}>
            <View style={[styles.mIconBox, { backgroundColor: color + '20' }]}>
                <Icon color={color} size={24} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.mTitle}>{title}</Text>
                <Text style={styles.mDesc}>{desc}</Text>
            </View>
        </View>
    );

    const RegistrationBanner = () => (
        <View style={styles.regBanner}>
            <View style={styles.regHeader}>
                <Briefcase size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.regTitle}>Join Fresh Hands</Text>
            <Text style={styles.regSub}>
                Become a verified service partner and start earning today.
                Get access to hundreds of daily jobs in your area.
            </Text>
            <Button
                title="Register as a Partner"
                onPress={() => navigation.navigate('Register', { phone: user?.phone })}
                style={{ marginTop: 16 }}
            />
        </View>
    );

    const VerificationCard = () => (
        <View style={styles.verificationCard}>
            <View style={styles.verificationHeader}>
                <Clock size={24} color={COLORS.warning} />
                <Text style={styles.verificationTitle}>Verification in Progress</Text>
            </View>

            <View style={styles.stepsContainer}>
                <View style={styles.stepRow}>
                    <View style={[styles.stepDot, { backgroundColor: COLORS.success }]} />
                    <Text style={[styles.stepText, { color: COLORS.success }]}>Application Submitted</Text>
                </View>
                <View style={styles.stepLine} />
                <View style={styles.stepRow}>
                    <View style={[styles.stepDot, { backgroundColor: COLORS.warning }]} />
                    <Text style={[styles.stepText, { color: COLORS.text, fontWeight: 'bold' }]}>Under Review</Text>
                </View>
                <View style={styles.stepLine} />
                <View style={styles.stepRow}>
                    <View style={[styles.stepDot, { backgroundColor: COLORS.border }]} />
                    <Text style={[styles.stepText, { color: COLORS.textLight }]}>Approved</Text>
                </View>
            </View>

            <Text style={styles.verificationText}>
                Our team is currently reviewing your profile details and documents. This usually takes 24-48 hours.
            </Text>

            {/* Debug Button for Testing */}
            <TouchableOpacity
                style={styles.debugBtn}
                onPress={() => setPartnerStatus('APPROVED')}
            >
                <Text style={styles.debugBtnText}>[Debug] Auto Verify Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.debugBtn, { marginTop: 8, backgroundColor: COLORS.error }]}
                onPress={() => {
                    logout();
                    alert('App Reset. Please login again.');
                }}
            >
                <Text style={styles.debugBtnText}>[Debug] RESET APP</Text>
            </TouchableOpacity>
        </View>
    );

    const GuestDashboard = () => (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <DashboardHeader />
            <View style={styles.content}>
                <Text style={styles.greetingText} numberOfLines={1} adjustsFontSizeToFit>
                    <Text style={{ color: '#E65100', fontSize: 28 }}>Glad to see you,</Text> Let's earn ! {user?.name?.split(' ')[0] || 'Partner'}
                </Text>

                {isUnregistered && <RegistrationBanner />}
                {isPending && <VerificationCard />}

                <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Why Join Us?</Text>

                <MarketingCard
                    icon={TrendingUp}
                    title="High Earnings"
                    desc="Earn up to ₹30,000 per month with flexible working hours."
                    color={COLORS.success}
                />
                <MarketingCard
                    icon={Gift}
                    title="Weekly Incentives"
                    desc="Get bonuses for completing targets and high ratings."
                    color={COLORS.warning}
                />
                <MarketingCard
                    icon={Users}
                    title="Growing Community"
                    desc="Join over 5,000+ verified service professionals."
                    color={COLORS.primary}
                />
            </View>
        </ScrollView>
    );

    const ProfessionalDashboard = () => (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <DashboardHeader />

            {/* Status Toggle */}
            <View style={styles.headerStatusContainer}>
                <View style={styles.statusInner}>
                    <View style={styles.statusIndicator}>
                        <View style={[styles.statusDot, { backgroundColor: isDutyOn ? COLORS.success : COLORS.error }]} />
                        <View>
                            <Text style={styles.statusLabel}>
                                {isDutyOn ? 'You are Online' : 'You are Offline'}
                            </Text>
                            <Text style={styles.statusTagline}>
                                {isDutyOn ? 'Ready for new job requests' : 'Off-duty: Enjoy your break'}
                            </Text>
                        </View>
                    </View>
                    <Switch
                        value={isDutyOn}
                        onValueChange={handleToggleDuty}
                        trackColor={{ false: COLORS.border, true: COLORS.success }}
                        thumbColor={COLORS.white}
                    />
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.statsRow}>
                    <StatCard
                        icon={IndianRupee}
                        title="Today's Earnings"
                        value={`₹${jobHistory.filter(j => j.date === new Date().toISOString().split('T')[0]).reduce((acc, curr) => acc + curr.amount, 0)}`}
                        color={COLORS.primary}
                        onPress={() => navigation.navigate('Earnings')}
                    />
                    <StatCard
                        icon={Briefcase}
                        title="Jobs Done"
                        value={jobHistory.filter(j => j.date === new Date().toISOString().split('T')[0]).length.toString()}
                        color={COLORS.secondary}
                        onPress={() => navigation.navigate('Jobs')}
                    />
                </View>

                <View style={styles.ratingCard}>
                    <Text style={styles.ratingTitle}>Your Performance</Text>
                    <View style={styles.ratingRow}>
                        <Text style={styles.ratingValue}>{user?.rating || '4.8'}</Text>
                        <Star color="#FFD700" size={32} fill="#FFD700" style={{ marginLeft: 8 }} />
                    </View>
                    <Text style={styles.ratingSub}>Top Tier Partner • 98% Job Success</Text>
                    <Text style={styles.ratingTagline}>You're doing great! Keep it up! ✨</Text>
                </View>

                {incomingJob && !activeJob && (
                    <View style={styles.pendingRequestCard}>
                        <View style={styles.pendingHeader}>
                            <View style={styles.requestBadge}>
                                <Text style={styles.requestBadgeText}>NEW REQUEST</Text>
                            </View>
                            <TouchableOpacity onPress={rejectJob}>
                                <X size={20} color={COLORS.textLight} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.pendingBody}>
                            <View>
                                <Text style={styles.pendingService}>{incomingJob.service}</Text>
                                <Text style={styles.pendingCustomer}>{incomingJob.customer} • {incomingJob.distance || '2.5 km'}</Text>
                            </View>
                            <View style={styles.pendingPriceTag}>
                                <Text style={styles.pendingPriceText}>₹{incomingJob.earnings}</Text>
                            </View>
                        </View>
                        <View style={styles.pendingActions}>
                            <TouchableOpacity style={styles.pendingRejectBtn} onPress={rejectJob}>
                                <Text style={styles.pendingRejectText}>Reject</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.pendingDetailsBtn}
                                onPress={handleViewDetails}
                            >
                                <Text style={styles.pendingDetailsText}>Job Details</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <View style={styles.section}>
                    {activeJob ? (
                        <ActiveJobCard job={activeJob} />
                    ) : (
                        <View style={styles.emptyJob}>
                            <Text style={styles.emptyText}>
                                {isDutyOn ? "Waiting for new requests..." : "Go Online to receive jobs."}
                            </Text>
                            {isDutyOn && (
                                <TouchableOpacity onPress={simulateIncomingJob} style={styles.testBtn}>
                                    <Text style={styles.testBtnText}>Simulate Inviting Job</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );

    const StatCard = ({ icon: Icon, title, value, color, onPress }) => (
        <TouchableOpacity style={styles.statCard} onPress={onPress}>
            <View style={[styles.iconBox, { backgroundColor: color }]}>
                <Icon color={COLORS.white} size={20} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
                <Text style={styles.statTitle}>{title}</Text>
            </View>
        </TouchableOpacity>
    );

    const ActiveJobCard = ({ job }) => (
        <View style={styles.activeJobCard}>
            <View style={styles.activeJobHeader}>
                <Text style={styles.activeJobTitle}>Current Job</Text>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{job.status.replace('_', ' ')}</Text>
                </View>
            </View>

            <View style={styles.jobDetails}>
                <Text style={styles.serviceName}>{job.service}</Text>
                <Text style={styles.customerName}>{job.customer}</Text>

                <View style={styles.detailRow}>
                    <MapPin size={16} color={COLORS.textLight} />
                    <Text style={styles.detailText}>{job.location}</Text>
                </View>
                <View style={styles.detailRow}>
                    <IndianRupee size={16} color={COLORS.textLight} />
                    <Text style={styles.detailText}>Est. Earnings: ₹{job.earnings}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.viewJobBtn}
                onPress={() => navigation.navigate('Jobs')}
            >
                <Text style={styles.viewJobText}>View Job Details</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {isVerified ? <ProfessionalDashboard /> : <GuestDashboard />}

            <Modal
                visible={isRequestModalVisible && !!incomingJob && isVerified}
                transparent
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeModalBtn} onPress={handleCloseModal}>
                            <X size={24} color={COLORS.text} />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>New Job Request!</Text>

                        {incomingJob && (
                            <View style={styles.jobPreview}>
                                <Text style={styles.jobService}>{incomingJob.service}</Text>
                                <Text style={styles.jobLocation}>{incomingJob.location}</Text>
                                <View style={styles.priceTag}>
                                    <Text style={styles.priceText}>₹{incomingJob.earnings}</Text>
                                </View>
                            </View>
                        )}

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.detailsBtnFull} onPress={handleViewDetails}>
                                <Text style={styles.acceptText}>Job Details</Text>
                            </TouchableOpacity>
                        </View>
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
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        padding: THEME.spacing.m,
        paddingBottom: 40,
    },
    headerStatusContainer: {
        backgroundColor: COLORS.surface,
        paddingHorizontal: THEME.spacing.m,
        paddingBottom: 12,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    statusInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        padding: 12,
        borderRadius: 12,
    },
    statusIndicator: {
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
        fontWeight: 'bold',
        color: COLORS.text,
    },
    statusTagline: {
        fontSize: 11,
        color: COLORS.textLight,
        marginTop: 1,
    },
    greetingText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: THEME.spacing.m,
        marginTop: 8,
    },
    regBanner: {
        backgroundColor: COLORS.white,
        padding: 24,
        borderRadius: 16,
        marginBottom: 24,
        elevation: 4,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    regHeader: {
        backgroundColor: COLORS.primaryLight + '40',
        padding: 12,
        borderRadius: 40,
        marginBottom: 16,
    },
    regTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
        marginBottom: 8,
    },
    regSub: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    marketingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        // Responsive Shadow
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    mIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
        flexWrap: 'wrap',
    },
    mDesc: {
        fontSize: 14,
        color: COLORS.textLight,
        lineHeight: 20,
        flexWrap: 'wrap',
    },
    verificationCard: {
        backgroundColor: '#FFF8E1',
        borderColor: '#FFE082',
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    verificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    verificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#F57F17',
        marginLeft: 8,
    },
    stepsContainer: {
        marginVertical: 12,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    stepLine: {
        width: 2,
        height: 12,
        backgroundColor: COLORS.border,
        marginLeft: 4,
        marginVertical: 2,
    },
    stepText: {
        fontSize: 14,
    },
    verificationText: {
        color: '#F57F17',
        fontSize: 14,
        lineHeight: 20,
    },
    debugBtn: {
        marginTop: 16,
        backgroundColor: '#F57F17',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    debugBtnText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 12,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: THEME.spacing.m,
    },
    statCard: {
        flex: 0.48,
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    statTitle: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    ratingCard: {
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 16,
        marginBottom: THEME.spacing.m,
        elevation: 2,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    ratingValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    ratingSub: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.text,
    },
    ratingTagline: {
        fontSize: 12,
        fontStyle: 'italic',
        color: COLORS.textLight,
    },
    pendingRequestCard: {
        backgroundColor: '#FFF9F1',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#FFD180',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    pendingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    requestBadge: {
        backgroundColor: '#FF9100',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    requestBadgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    pendingBody: {
        marginBottom: 4,
    },
    pendingService: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#001F3F',
        marginBottom: 2,
    },
    pendingCustomer: {
        fontSize: 14,
        color: '#546E7A',
        marginBottom: 8,
    },
    pendingPriceTag: {
        backgroundColor: '#2E7D32',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginVertical: 8,
        width: '100%',
    },
    pendingPriceText: {
        color: COLORS.white,
        fontWeight: '900',
        fontSize: 16,
    },
    pendingActions: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 4,
    },
    pendingRejectBtn: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#D32F2F',
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: 'transparent',
    },
    pendingRejectText: {
        color: '#D32F2F',
        fontWeight: 'bold',
        fontSize: 14,
    },
    pendingDetailsBtn: {
        flex: 1.8,
        backgroundColor: '#004D40',
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
    },
    pendingDetailsText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    activeJobCard: {
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 16,
        elevation: 3,
    },
    activeJobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    activeJobTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    statusBadge: {
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    customerName: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    detailText: {
        marginLeft: 8,
        fontSize: 13,
        color: COLORS.text,
    },
    viewJobBtn: {
        marginTop: 16,
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
    },
    viewJobText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    emptyJob: {
        padding: 32,
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: COLORS.border,
        borderRadius: 16,
    },
    emptyText: {
        color: COLORS.textLight,
        textAlign: 'center',
    },
    testBtn: {
        marginTop: 12,
        backgroundColor: COLORS.primaryLight,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    testBtnText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 24,
    },
    closeModalBtn: {
        alignSelf: 'flex-end',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    jobPreview: {
        backgroundColor: COLORS.background,
        padding: 20,
        borderRadius: 20,
        marginVertical: 20,
        alignItems: 'center',
    },
    jobService: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    jobLocation: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    priceTag: {
        backgroundColor: COLORS.success,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 12,
    },
    priceText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    modalActions: {
        marginTop: 8,
    },
    detailsBtnFull: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        alignItems: 'center',
        borderRadius: 16,
    },
    acceptText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 12,
    },
});
