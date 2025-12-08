import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Briefcase, Wallet, User } from 'lucide-react-native';
import DashboardScreen from '../screens/main/DashboardScreen';
import JobsScreen from '../screens/main/JobsScreen';
import WalletScreen from '../screens/main/WalletScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textLight,
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarIcon: ({ color }) => <Home color={color} size={24} />
                }}
            />
            <Tab.Screen
                name="Jobs"
                component={JobsScreen}
                options={{
                    tabBarIcon: ({ color }) => <Briefcase color={color} size={24} />
                }}
            />
            <Tab.Screen
                name="Wallet"
                component={WalletScreen}
                options={{
                    tabBarIcon: ({ color }) => <Wallet color={color} size={24} />
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color }) => <User color={color} size={24} />
                }}
            />
        </Tab.Navigator>
    );
}
