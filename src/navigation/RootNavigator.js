import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import MainTabNavigator from './MainTabNavigator';
import SplashScreen from '../screens/splash/SplashScreen';
import RegistrationScreen from '../screens/auth/RegistrationScreen';
import VerificationPendingScreen from '../screens/auth/VerificationPendingScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const { isAuthenticated, isLoading } = useAuth();
    const [isSplashVisible, setIsSplashVisible] = useState(true);

    useEffect(() => {
        // Simulate splash delay
        setTimeout(() => setIsSplashVisible(false), 2000);
    }, []);

    if (isSplashVisible || isLoading) {
        return <SplashScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <>
                        <Stack.Screen name="Main" component={MainTabNavigator} />
                        <Stack.Screen name="Register" component={RegistrationScreen} options={{ headerShown: true, title: 'Partner Registration' }} />
                        <Stack.Screen name="VerificationPending" component={VerificationPendingScreen} options={{ headerShown: false }} />
                    </>
                ) : (
                    <Stack.Screen name="Auth" component={AuthStack} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
