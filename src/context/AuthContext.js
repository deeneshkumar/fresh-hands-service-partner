import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // User object: { name, phone, email, id, ... }
    const [user, setUser] = useState(null);
    // Partner Status: 'UNREGISTERED', 'PENDING_VERIFICATION', 'APPROVED', 'REJECTED', 'SUSPENDED'
    // Partner Status: 'UNREGISTERED', 'PENDING_VERIFICATION', 'APPROVED'
    const [partnerStatus, setPartnerStatus] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDutyOn, setIsDutyOn] = useState(false); // Online/Offline status

    // Mock API Delay
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const sendOtp = async (phone) => {
        setIsLoading(true);
        await delay(1500); // Simulate network request
        setIsLoading(false);
        return true; // Success
    };

    const verifyOtp = async (phone, otp) => {
        setIsLoading(true);
        await delay(1500);
        setIsLoading(false);

        if (otp === '1234') {
            // STRICT MOCK LOGIC:
            // 9876543210 -> APPROVED Partner
            // Any other -> NEW/UNREGISTERED

            if (phone === '9876543210') {
                // Login existing user
                const mockUser = {
                    id: 'p1',
                    name: 'Rajesh Kumar',
                    phone: phone,
                    service: 'Plumber',
                    rating: 4.8
                };
                setUser(mockUser);
                setPartnerStatus('APPROVED');
                setIsAuthenticated(true);
                return { success: true, isNewUser: false };
            } else {
                return { success: true, isNewUser: true };
            }
        } else {
            return { success: false, message: 'Invalid OTP' };
        }
    };

    const loginAsGuest = (phone) => {
        setUser({ phone, name: 'Guest' });
        setPartnerStatus('UNREGISTERED');
        setIsAuthenticated(true);
    };

    const completeUserProfile = async (data) => {
        setIsLoading(true);
        await delay(1000);
        const newUser = {
            id: 'u' + Date.now(),
            ...data
        };
        setUser(newUser);
        setPartnerStatus('UNREGISTERED');
        setIsAuthenticated(true);
        setIsLoading(false);
    };

    const registerPartner = async (data) => {
        setIsLoading(true);
        await delay(2000);
        // Merge with existing user data
        setUser(prev => ({ ...prev, ...data }));
        setPartnerStatus('PENDING_VERIFICATION');
        // valid session is maintained
        setIsLoading(false);
    };

    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        setUser(null);
        setPartnerStatus(null);
        setIsAuthenticated(false);
        setIsDutyOn(false);
    };

    const toggleDuty = async () => {
        const newStatus = !isDutyOn;
        setIsDutyOn(newStatus);
    };

    return (
        <AuthContext.Provider value={{
            user,
            partnerStatus,
            isAuthenticated,
            isLoading,
            isDutyOn,
            login,
            loginAsGuest,
            logout,
            sendOtp,
            verifyOtp,
            verifyOtp,
            completeUserProfile,
            registerPartner,
            toggleDuty,
            setPartnerStatus, // Exposed for testing/debugging
            updateUserProfile: (updates) => {
                setUser(prev => ({ ...prev, ...updates }));
            }
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
