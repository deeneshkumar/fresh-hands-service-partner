import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
    // Current Active Job (if any)
    const [activeJob, setActiveJob] = useState(null);

    // Incoming Job Request (popup)
    const [incomingJob, setIncomingJob] = useState(null);

    // Job History
    const [jobHistory, setJobHistory] = useState([
        {
            id: 'j100',
            service: 'Tap Leakage Fix',
            customer: 'Anita Roy',
            date: '2025-12-07',
            amount: 450,
            status: 'COMPLETED',
            rating: 5
        },
        {
            id: 'j99',
            service: 'Basin Pipe Replace',
            customer: 'John Doe',
            date: '2025-12-06',
            amount: 300,
            status: 'COMPLETED',
            rating: 4
        }
    ]);

    // Mock Timer for Simulate Incoming Job
    const [timerId, setTimerId] = useState(null);

    const simulateIncomingJob = () => {
        if (activeJob || incomingJob) return; // Don't send if busy or already have one

        const mockJob = {
            id: 'j' + Date.now(),
            service: 'General Plumbing Check',
            customer: 'Vikram Singh',
            location: 'Sector 45, Gurgaon (2.5km)',
            address: 'Flat 402, Sunshine Apts, Sector 45',
            earnings: 350,
            status: 'NEW_REQUEST',
            timestamp: Date.now(),
            // Location coordinates for Maps
            customerCoords: {
                latitude: 28.4595,
                longitude: 77.0266,
            },
            partnerCoords: { // Starting point for simulation
                latitude: 28.4495,
                longitude: 77.0166,
            },
            distance: '2.5 km',
            eta: '12 mins'
        };
        setIncomingJob(mockJob);
    };

    const acceptJob = () => {
        if (!incomingJob) return;
        if (timerId) clearTimeout(timerId);

        const newJob = { ...incomingJob, status: 'ACCEPTED' };
        setActiveJob(newJob);
        setIncomingJob(null);
    };

    const rejectJob = () => {
        if (timerId) clearTimeout(timerId);
        setIncomingJob(null);
    };

    // Status transitions: ACCEPTED -> ON_THE_WAY -> ARRIVED -> IN_PROGRESS -> COMPLETED
    const updateJobStatus = (status) => {
        if (!activeJob) return;
        setActiveJob(prev => ({ ...prev, status }));
    };

    const completeJob = (finalAmount) => {
        if (!activeJob) return;

        const completedJob = {
            ...activeJob,
            status: 'COMPLETED',
            amount: finalAmount || activeJob.earnings,
            date: new Date().toISOString().split('T')[0]
        };

        setJobHistory(prev => [completedJob, ...prev]);
        setActiveJob(null);
        // Here you would notify backend
    };

    return (
        <JobContext.Provider value={{
            activeJob,
            incomingJob,
            jobHistory,
            simulateIncomingJob,
            acceptJob,
            rejectJob,
            updateJobStatus,
            completeJob
        }}>
            {children}
        </JobContext.Provider>
    );
};

export const useJob = () => useContext(JobContext);
