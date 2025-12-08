import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import Button from '../../components/Button';
import { useJob } from '../../context/JobContext';

export default function WalletScreen() {
    const { jobHistory } = useJob();
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    // Calculate total earnings
    const totalEarnings = jobHistory
        .filter(job => job.status === 'COMPLETED')
        .reduce((sum, job) => sum + (job.amount || 0), 0);

    // Mock wallet balance (Earnings - withdrawals). 
    // For now assuming 0 withdrawals, so Balance = Earnings
    const walletBalance = totalEarnings;

    const handleWithdraw = () => {
        if (walletBalance < 500) {
            Alert.alert("Low Balance", "Minimum withdrawal amount is ₹500.");
            return;
        }

        Alert.alert(
            "Withdraw Funds",
            `Transfer ₹${walletBalance} to your bank account?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Confirm",
                    onPress: async () => {
                        setIsWithdrawing(true);
                        // Simulate API call
                        setTimeout(() => {
                            setIsWithdrawing(false);
                            Alert.alert("Success", "Withdrawal request submitted successfully. Amount will be credited in 24 hours.");
                        }, 2000);
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.balanceCard}>
                <Text style={styles.balanceTitle}>Total Balance</Text>
                <Text style={styles.balanceValue}>₹{walletBalance.toFixed(2)}</Text>
                <Text style={styles.subText}>Available to withdraw</Text>

                {isWithdrawing ? (
                    <View style={styles.loaderBox}>
                        <ActivityIndicator color={COLORS.primary} />
                    </View>
                ) : (
                    <Button
                        title="Withdraw to Bank"
                        onPress={handleWithdraw}
                        style={styles.withdrawButton}
                        variant="outline"
                        textStyle={{ color: COLORS.primary }}
                    />
                )}
            </View>

            <Text style={styles.title}>Recent Transactions</Text>

            <ScrollView contentContainerStyle={styles.list}>
                {jobHistory.length > 0 ? (
                    jobHistory.map((job) => (
                        <View key={job.id} style={styles.txnItem}>
                            <View>
                                <Text style={styles.txnTitle}>Payment for {job.service}</Text>
                                <Text style={styles.txnDate}>{job.date}</Text>
                            </View>
                            <Text style={styles.txnAmount}>+ ₹{job.amount}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No transactions yet.</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: THEME.spacing.m,
    },
    balanceCard: {
        backgroundColor: COLORS.primary,
        padding: THEME.spacing.xl,
        borderRadius: THEME.borderRadius.l,
        alignItems: 'center',
        marginBottom: THEME.spacing.xl,
        elevation: 4,
    },
    balanceTitle: {
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 8,
    },
    balanceValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 8,
    },
    subText: {
        color: 'rgba(255,255,255,0.8)',
        marginBottom: THEME.spacing.l,
    },
    withdrawButton: {
        backgroundColor: COLORS.white,
        width: '100%',
        borderColor: COLORS.white,
    },
    loaderBox: {
        height: 50,
        width: '100%',
        backgroundColor: COLORS.white,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: THEME.fontSize.l,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: THEME.spacing.m,
    },
    list: {
        paddingBottom: 20,
    },
    txnItem: {
        backgroundColor: COLORS.surface,
        padding: THEME.spacing.m,
        borderRadius: THEME.borderRadius.m,
        marginBottom: THEME.spacing.s,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 1,
    },
    txnTitle: {
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    txnDate: {
        fontSize: THEME.fontSize.s,
        color: COLORS.textLight,
    },
    txnAmount: {
        fontWeight: 'bold',
        color: COLORS.success,
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.textLight,
        marginTop: 20,
    }
});
