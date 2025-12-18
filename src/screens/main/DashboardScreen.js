import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Modal, TouchableOpacity, Dimensions, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { Briefcase, IndianRupee, Star, MapPin, Clock, ShieldCheck, ChevronRight, Gift, TrendingUp, Users, Bell, User } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useJob } from '../../context/JobContext';
import Button from '../../components/Button';
import DashboardHeader from '../../components/DashboardHeader';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
    const { user, isDutyOn, toggleDuty, partnerStatus, setPartnerStatus, logout } = useAuth();
    const { activeJob, incomingJob, acceptJob, rejectJob, simulateIncomingJob, jobHistory } = useJob();
    const [secondsLeft, setSecondsLeft] = useState(30);

    const isVerified = partnerStatus === 'APPROVED';
    const isUnregistered = partnerStatus === 'UNREGISTERED';
    const isPending = partnerStatus === 'PENDING_VERIFICATION';

    // Timer for incoming job modal
    useEffect(() => {
        let interval;
        if (incomingJob) {
            setSecondsLeft(30);
            interval = setInterval(() => {
                setSecondsLeft((prev) => {
                    if (prev <= 1) {
                        rejectJob(); // Auto reject
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [incomingJob]);

    const handleAccept = () => {
        acceptJob();
        navigation.navigate('Jobs');
    };

    const handleToggleDuty = () => {
        if (!isVerified) return;
        toggleDuty();
    };

    // --- SUB COMPONENTS ---

    const MarketingCard = ({ icon: Icon, title, desc, color }) => (
        <View style={styles.marketingCard}>
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
                    // Hard Reset
                    logout();
                    alert('App Reset. Please login again.');
                }}
            >
                <Text style={styles.debugBtnText}>[Debug] RESET APP</Text>
            </TouchableOpacity>
        </View>
    );

    // --- SUB COMPONENTS ---

    // DashboardHeader is now imported


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
            <View style={styles.content}>
                <View style={styles.statsRow}>
                    <StatCard
                        icon={IndianRupee}
                        title="Today's Earnings"
                        value={`₹${jobHistory.filter(j => j.date === new Date().toISOString().split('T')[0]).reduce((acc, curr) => acc + curr.amount, 0)}`}
                        color={COLORS.primary}
                    />
                    <StatCard
                        icon={Briefcase}
                        title="Jobs Done"
                        value={jobHistory.filter(j => j.date === new Date().toISOString().split('T')[0]).length.toString()}
                        color={COLORS.secondary}
                    />
                </View>

                <View style={styles.ratingCard}>
                    <Text style={styles.ratingTitle}>Your Rating</Text>
                    <View style={styles.ratingRow}>
                        <Text style={styles.ratingValue}>{user?.rating || 'NEW'}</Text>
                        <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star
                                    key={i}
                                    size={16}
                                    fill={i <= Math.round(user?.rating || 0) ? COLORS.warning : 'transparent'}
                                    color={COLORS.warning}
                                />
                            ))}
                        </View>
                    </View>
                    <Text style={styles.ratingSub}>Based on last 50 jobs</Text>
                </View>

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

    const StatCard = ({ icon: Icon, title, value, color }) => (
        <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: color }]}>
                <Icon color={COLORS.white} size={20} />
            </View>
            <View>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statTitle}>{title}</Text>
            </View>
        </View>
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
            {/* Main Content Switch */}
            {isVerified ? <ProfessionalDashboard /> : <GuestDashboard />}

            {/* Incoming Job Modal (Only active if Verified & Online) */}
            <Modal
                visible={!!incomingJob && isVerified}
                transparent
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.timerBar}>
                            <View style={[styles.timerFill, { width: `${(secondsLeft / 30) * 100}%` }]} />
                        </View>

                        <Text style={styles.modalTitle}>New Job Request!</Text>
                        <Text style={styles.timerText}>Auto-reject in {secondsLeft}s</Text>

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
                            <TouchableOpacity style={styles.rejectBtn} onPress={rejectJob}>
                                <Text style={styles.rejectText}>Reject</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept}>
                                <Text style={styles.acceptText}>Accept Job</Text>
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
    header: {
        paddingHorizontal: THEME.spacing.m,
        paddingTop: 15, // More top padding for safe area
        paddingBottom: -15,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
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
        backgroundColor: COLORS.background,
        padding: 12,
        borderRadius: 12,
        marginTop: 4,
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
    scrollContent: {
        padding: 0,
        flexGrow: 1,
    },
    content: {
        padding: THEME.spacing.m,
        paddingBottom: 40,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: THEME.spacing.m,
        marginTop: 8,
    },
    greetingText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: THEME.spacing.m,
        marginTop: 8,
    },

    // Guest Dashboard Styles
    regBanner: {
        backgroundColor: COLORS.primary, // Make it pop with primary color background? No, lets stick to white with accent
        backgroundColor: COLORS.white,
        padding: 24,
        borderRadius: 16,
        marginBottom: 24,
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    regHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: COLORS.primaryLight + '40',
        padding: 12,
        borderRadius: 40,
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
        paddingHorizontal: 16,
    },
    marketingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
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
        marginBottom: 2,
    },
    mDesc: {
        fontSize: 13,
        color: COLORS.textLight,
        lineHeight: 18,
    },
    verificationCard: {
        backgroundColor: '#FFF8E1', // Warmer yellow
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
    verificationText: {
        color: '#F57F17',
        lineHeight: 20,
        fontSize: 14,
        marginTop: 12,
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
    debugBtn: {
        marginTop: 16,
        backgroundColor: '#F57F17',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    debugBtnText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 12,
    },

    // Prof Dashboard Styles
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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
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
        marginTop: 2,
    },
    ratingCard: {
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 16,
        marginBottom: THEME.spacing.m,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    ratingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
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
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 4,
    },
    section: {
        marginTop: 8,
    },
    emptyJob: {
        backgroundColor: COLORS.surface,
        padding: 32,
        borderRadius: 16,
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: COLORS.border,
        marginTop: 8,
    },
    emptyText: {
        color: COLORS.textLight,
        marginBottom: 16,
        fontSize: 16,
    },
    activeJobCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 16,
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderLeftWidth: 6,
        borderLeftColor: COLORS.primary,
    },
    activeJobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    activeJobTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: COLORS.text,
    },
    statusBadge: {
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    jobDetails: {
        marginBottom: 16,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
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
        marginTop: 6,
    },
    detailText: {
        marginLeft: 8,
        color: COLORS.text,
        fontSize: 14,
    },
    viewJobBtn: {
        backgroundColor: COLORS.primary,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    viewJobText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    testBtn: {
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
    },
    testBtnText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 14,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        elevation: 10,
    },
    timerBar: {
        height: 6,
        backgroundColor: COLORS.border,
        borderRadius: 3,
        marginBottom: 24,
        overflow: 'hidden',
    },
    timerFill: {
        height: '100%',
        backgroundColor: COLORS.error,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 8,
    },
    timerText: {
        textAlign: 'center',
        color: COLORS.error,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    jobPreview: {
        backgroundColor: COLORS.background,
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    jobService: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    jobLocation: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: 'center',
        marginBottom: 16,
    },
    priceTag: {
        backgroundColor: COLORS.success,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    priceText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 20,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    rejectBtn: {
        flex: 1,
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.error,
        alignItems: 'center',
    },
    acceptBtn: {
        flex: 1,
        backgroundColor: COLORS.success,
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    rejectText: {
        color: COLORS.error,
        fontWeight: 'bold',
        fontSize: 16,
    },
    acceptText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    }
});
