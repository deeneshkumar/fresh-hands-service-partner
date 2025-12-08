import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleCheck, Clock } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

export default function VerificationPendingScreen() {
    const { logout } = useAuth();
    // This screen is technically deprecated as RootNavigator now routes PENDING to Main.
    // However, if we ever need it back, we keep it. 
    // For now, let's just make sure user doesn't get stuck here if navigated manually.

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Clock size={80} color={COLORS.warning} />
                <Text style={styles.title}>Application Under Review</Text>
                <Text style={styles.subtitle}>
                    Your application is currently being reviewed by our team.
                    You can check your status on the Dashboard.
                </Text>
                <Button
                    title="Go to Dashboard"
                    onPress={() => navigation.navigate('Main')}
                    style={{ width: '100%', marginTop: 20 }}
                />
                <Button
                    title="Logout"
                    onPress={logout}
                    variant="outline"
                    style={{ width: '100%', marginTop: 10 }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: THEME.spacing.xl,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        marginTop: THEME.spacing.l,
        fontSize: THEME.fontSize.xl,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
    },
    subtitle: {
        marginTop: THEME.spacing.s,
        fontSize: THEME.fontSize.m,
        color: COLORS.textLight,
        textAlign: 'center',
        lineHeight: 22,
    }
});
