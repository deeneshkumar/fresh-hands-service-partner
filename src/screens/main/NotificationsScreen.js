import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { Bell, Check, ChevronLeft, Calendar, Info } from 'lucide-react-native';

const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        title: 'New Job Opportunity',
        message: 'A new cleaning job is available near Sector 45. Check details now!',
        time: '10 mins ago',
        read: false,
        type: 'JOB'
    },
    {
        id: '2',
        title: 'Payment Received',
        message: 'You received a payment of ₹450 for Job #J1023.',
        time: '2 hours ago',
        read: false,
        type: 'PAYMENT'
    },
    {
        id: '3',
        title: 'Document Verified',
        message: 'Your Aadhaar card has been successfully verified.',
        time: '1 day ago',
        read: true,
        type: 'SYSTEM'
    },
    {
        id: '4',
        title: 'Weekly Bonus Unlocked',
        message: 'Congratulations! You have unlocked the Gold Tier bonus.',
        time: '2 days ago',
        read: true,
        type: 'REWARD'
    }
];

export default function NotificationsScreen({ navigation }) {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        Alert.alert("Success", "All notifications marked as read.");
    };

    const renderItem = ({ item }) => {
        const getIcon = () => {
            switch (item.type) {
                case 'JOB': return <Briefcase size={20} color={COLORS.primary} />; // Briefcase isn't imported yet, will fix or use Bell
                case 'PAYMENT': return <IndianRupee size={20} color={COLORS.success} />; // IndianRupee isn't imported yet
                default: return <Info size={20} color={COLORS.textLight} />;
            }
        };

        // Simplified icon logic to avoid missing imports for now
        const IconComponent = item.read ? Check : Bell;
        const iconColor = item.read ? COLORS.success : COLORS.primary;

        return (
            <TouchableOpacity
                style={[styles.notificationItem, !item.read && styles.unreadItem]}
                onPress={() => markAsRead(item.id)}
            >
                <View style={[styles.iconBox, { backgroundColor: item.read ? COLORS.surface : COLORS.primaryLight + '20' }]}>
                    <IconComponent size={20} color={iconColor} />
                </View>
                <View style={styles.content}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.title, !item.read && styles.unreadTitle]}>{item.title}</Text>
                        <Text style={styles.time}>{item.time}</Text>
                    </View>
                    <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
                </View>
                {!item.read && <View style={styles.dot} />}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <TouchableOpacity onPress={markAllAsRead}>
                    <Text style={styles.markAllText}>Read All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={notifications}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyBox}>
                        <Bell size={48} color={COLORS.border} />
                        <Text style={styles.emptyText}>No notifications yet.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    markAllText: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },
    listContent: {
        padding: 16,
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: COLORS.surface, // Invisible border by default
    },
    unreadItem: {
        backgroundColor: '#F0F9FF', // Very light blue
        borderColor: COLORS.primaryLight + '40',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.text,
        flex: 1,
        marginRight: 8,
    },
    unreadTitle: {
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    time: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    message: {
        fontSize: 13,
        color: COLORS.textLight,
        lineHeight: 18,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.error,
        marginLeft: 8,
        marginTop: 6,
    },
    emptyBox: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        opacity: 0.5
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.textLight,
    }
});
