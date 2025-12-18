import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { IndianRupee, ArrowUpRight, ArrowDownLeft, Clock, Plus, Landmark, Briefcase, PlusCircle } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useJob } from '../../context/JobContext';

const { width } = Dimensions.get('window');

export default function WalletScreen({ navigation }) {
    const { user, partnerStatus } = useAuth();
    const { jobHistory } = useJob();


    // Calculate balance from history (simulated)
    const balance = jobHistory.reduce((acc, curr) => acc + curr.amount, 0);

    // Mock transactions
    const transactions = [
        { id: '1', title: 'Withdraw to Bank', amount: -1200, date: '2025-12-15', status: 'COMPLETED' },
        { id: '2', title: 'Job Payout #j100', amount: 450, date: '2025-12-07', status: 'COMPLETED' },
        { id: '3', title: 'Job Payout #j99', amount: 300, date: '2025-12-06', status: 'COMPLETED' },
    ];

    const handleWithdraw = () => {
        Alert.alert("Withdrawal", "Your withdrawal request of ₹" + balance + " has been initiated.");
    };

    if (partnerStatus !== 'APPROVED') {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <View style={{ padding: 20, backgroundColor: COLORS.surface, borderRadius: 16, alignItems: 'center', width: '100%' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>Access Restricted</Text>
                    <Text style={{ textAlign: 'center', color: COLORS.textLight, marginBottom: 20 }}>
                        Please complete your partner registration and get approved to view your wallet.
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.localHeader}>
                <Text style={styles.headerTitle}>My Wallet</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Balance Card */}
                    <View style={styles.balanceCard}>
                        <View style={styles.balanceHeader}>
                            <Text style={styles.balanceLabel}>Total Balance</Text>
                            <IndianRupee size={24} color={COLORS.white} />
                        </View>
                        <Text
                            style={styles.balanceValue}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            ₹{balance.toLocaleString('en-IN')}
                        </Text>

                        <TouchableOpacity style={styles.withdrawBtn} onPress={handleWithdraw}>
                            <Landmark size={20} color={COLORS.primary} />
                            <Text style={styles.withdrawText}>Withdraw to Bank</Text>
                        </TouchableOpacity>
                    </View>



                    {/* Stats Section */}
                    <View style={styles.statsGrid}>
                        <View style={styles.walletStat}>
                            <Text style={styles.walletStatLabel}>Total Earned</Text>
                            <Text style={styles.walletStatValue}>₹{balance + 1200}</Text>
                        </View>
                        <View style={styles.walletStat}>
                            <Text style={styles.walletStatLabel}>Withdrawals</Text>
                            <Text style={styles.walletStatValue}>₹1,200</Text>
                        </View>
                    </View>

                    {/* Recent Transactions */}
                    <Text style={styles.sectionTitle}>Recent Transactions</Text>
                    {transactions.length > 0 ? (
                        transactions.map((txn) => (
                            <View key={txn.id} style={styles.txnItem}>
                                <View style={[styles.txnIcon, { backgroundColor: txn.amount > 0 ? COLORS.success + '20' : COLORS.error + '20' }]}>
                                    {txn.amount > 0 ? <ArrowDownLeft size={20} color={COLORS.success} /> : <ArrowUpRight size={20} color={COLORS.error} />}
                                </View>
                                <View style={styles.txnInfo}>
                                    <Text style={styles.txnTitle}>{txn.title}</Text>
                                    <Text style={styles.txnDate}>{txn.date}</Text>
                                </View>
                                <View style={styles.txnPrice}>
                                    <Text style={[styles.txnAmount, { color: txn.amount > 0 ? COLORS.success : COLORS.error }]}>
                                        {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount)}
                                    </Text>
                                    <Text style={styles.txnStatus}>{txn.status}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No transactions yet.</Text>
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
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    balanceCard: {
        backgroundColor: COLORS.primary,
        padding: 24,
        borderRadius: 24,
        elevation: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        marginBottom: 20,
    },
    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    balanceLabel: {
        color: COLORS.white,
        fontSize: 16,
        opacity: 0.9,
    },
    balanceValue: {
        color: COLORS.white,
        fontSize: 42,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    withdrawBtn: {
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
    },
    withdrawText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
    unverifiedBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF3E0',
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#FFE0B2',
    },
    unverifiedText: {
        color: '#E65100',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 8,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    walletStat: {
        flex: 1,
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    walletStatLabel: {
        color: COLORS.textLight,
        fontSize: 12,
        marginBottom: 4,
    },
    walletStatValue: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 16,
    },
    txnItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    txnIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    txnInfo: {
        flex: 1,
        marginLeft: 12,
    },
    txnTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.text,
    },
    txnDate: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 2,
    },
    txnPrice: {
        alignItems: 'flex-end',
    },
    txnAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    txnStatus: {
        fontSize: 10,
        color: COLORS.textLight,
        marginTop: 2,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS.textLight,
        fontSize: 15,
    }
});
