import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // Partner Status: 'UNREGISTERED', 'PENDING_VERIFICATION', 'APPROVED'
    const [partnerStatus, setPartnerStatus] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Start true for initial load
    const [isDutyOn, setIsDutyOn] = useState(false); // Online/Offline status

    useEffect(() => {
        loadStorage();
    }, []);

    const loadStorage = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user');
            const storedStatus = await AsyncStorage.getItem('partnerStatus');
            const storedDuty = await AsyncStorage.getItem('isDutyOn');

            if (storedUser) {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            }

            if (storedStatus) {
                setPartnerStatus(storedStatus);
            }

            if (storedDuty) {
                setIsDutyOn(JSON.parse(storedDuty));
            }

        } catch (e) {
            console.log('Failed to load storage', e);
        } finally {
            setIsLoading(false);
        }
    };

    const persistState = async (key, value) => {
        try {
            if (value === null) {
                await AsyncStorage.removeItem(key);
            } else {
                await AsyncStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
            }
        } catch (e) {
            console.log('Failed to persist', key, e);
        }
    };

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

                persistState('user', mockUser);
                persistState('partnerStatus', 'APPROVED');

                return { success: true, isNewUser: false };
            } else {
                return { success: true, isNewUser: true };
            }
        } else {
            return { success: false, message: 'Invalid OTP' };
        }
    };

    const loginAsGuest = (phone) => {
        const guestUser = { phone, name: 'Guest' };
        setUser(guestUser);
        setPartnerStatus('UNREGISTERED');
        setIsAuthenticated(true);
        persistState('user', guestUser);
        persistState('partnerStatus', 'UNREGISTERED');
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

        persistState('user', newUser);
        persistState('partnerStatus', 'UNREGISTERED');

        setIsLoading(false);
    };

    const registerPartner = async (data) => {
        setIsLoading(true);
        await delay(2000);
        // Merge with existing user data
        setUser(prev => {
            const updated = { ...prev, ...data };
            persistState('user', updated);
            return updated;
        });
        setPartnerStatus('PENDING_VERIFICATION');
        persistState('partnerStatus', 'PENDING_VERIFICATION');

        // valid session is maintained
        setIsLoading(false);
    };

    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        persistState('user', userData);
    };

    const logout = () => {
        setUser(null);
        setPartnerStatus(null);
        setIsAuthenticated(false);
        setIsDutyOn(false);

        persistState('user', null);
        persistState('partnerStatus', null);
        persistState('isDutyOn', null);
    };

    const toggleDuty = async () => {
        const newStatus = !isDutyOn;
        setIsDutyOn(newStatus);
        persistState('isDutyOn', newStatus);
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
