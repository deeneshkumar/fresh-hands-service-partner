import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import OtpVerificationScreen from '../screens/auth/OtpVerificationScreen';
import RegistrationScreen from '../screens/auth/RegistrationScreen';
import VerificationPendingScreen from '../screens/auth/VerificationPendingScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OTP" component={OtpVerificationScreen} />
            <Stack.Screen name="Register" component={RegistrationScreen} />
            <Stack.Screen name="VerificationPending" component={VerificationPendingScreen} />
        </Stack.Navigator>
    );
}
