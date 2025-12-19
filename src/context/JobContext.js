import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
    // Active Assignments (Accepted Jobs)
    // We use an array to support multiple scheduled jobs + 1 instant job
    const [assignments, setAssignments] = useState([]);

    // Incoming Job Request (popup)
    const [incomingJob, setIncomingJob] = useState(null);

    // Job History
    const [jobHistory, setJobHistory] = useState([]); // kept empty/mock for brevity or use previous mock

    // Mock Timer
    const [timerId, setTimerId] = useState(null);

    // Live Tracking State
    const [partnerLocation, setPartnerLocation] = useState(null);
    const [routeInfo, setRouteInfo] = useState({ distance: '0 km', eta: '0 min' });
    const [simulationInterval, setSimulationInterval] = useState(null);

    // --- HELPER: Conflict Detection ---
    const checkAvailability = (newJob) => {
        // 1. If New Job is INSTANT (1 hr duration mock)
        if (newJob.type === 'INSTANT') {
            // Cannot accept if you have ANY overlapping job in the next 1 hour
            const newStart = Date.now();
            const newEnd = newStart + 60 * 60 * 1000; // 1 hr

            const hasConflict = assignments.some(job => {
                // If existing is Instant (assuming it's still active)
                if (job.type === 'INSTANT') return true; // Can't have 2 instants at once

                // If existing is Scheduled
                const jobStart = new Date(job.scheduledTime).getTime();
                const jobEnd = jobStart + 60 * 60 * 1000; // Assuming 1 hr duration for scheduled too

                // Check overlap
                return (newStart < jobEnd && newEnd > jobStart);
            });

            return !hasConflict;
        }

        // 2. If New Job is SCHEDULED
        if (newJob.type === 'SCHEDULED') {
            const newStart = new Date(newJob.scheduledTime).getTime();
            const newEnd = newStart + 60 * 60 * 1000;

            const hasConflict = assignments.some(job => {
                let jobStart, jobEnd;
                if (job.type === 'INSTANT') {
                    // Overlap with current instant job?
                    // Assuming instant job started at 'acceptedAt'
                    jobStart = job.acceptedAt;
                    jobEnd = jobStart + 60 * 60 * 1000;
                } else {
                    jobStart = new Date(job.scheduledTime).getTime();
                    jobEnd = jobStart + 60 * 60 * 1000;
                }

                return (newStart < jobEnd && newEnd > jobStart);
            });

            return !hasConflict;
        }

        return true;
    };

    const canGoOffline = () => {
        // Only if NO active assignments
        return assignments.length === 0;
    };

    const simulateIncomingJob = (type = 'INSTANT') => {
        if (incomingJob) return;

        // Create Mock
        const isInstant = type === 'INSTANT';
        const mockJob = {
            id: 'j' + Date.now(),
            type: type, // INSTANT or SCHEDULED
            service: isInstant ? 'Emergency Pipe Fix' : 'Scheduled Maintenance',
            customer: isInstant ? 'Rahul Kumar' : 'Sita Sharma',
            location: 'Sector 45, Gurgaon',
            earnings: isInstant ? 450 : 800,
            amount: isInstant ? 450 : 800, // Sync with earnings for Wallet/Earnings compatibility
            status: 'NEW_REQUEST', // Initial
            timestamp: Date.now(),
            scheduledTime: isInstant ? null : new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // Schedule for 2 hrs later
            customerCoords: { latitude: 28.4595, longitude: 77.0266 }, // Mock
            partnerCoords: { latitude: 28.4495, longitude: 77.0166 },
            distance: '2.5 km',
            eta: '12 mins'
        };

        setIncomingJob(mockJob);
    };

    const acceptJob = () => {
        if (!incomingJob) return;

        // Check Conflict again (safety)
        if (!checkAvailability(incomingJob)) {
            Alert.alert("Schedule Conflict", "You cannot accept this job as it overlaps with an existing assignment.");
            setIncomingJob(null);
            return;
        }

        const newJob = {
            ...incomingJob,
            status: 'ACCEPTED',
            acceptedAt: Date.now()
        };

        setAssignments(prev => [...prev, newJob]);
        setIncomingJob(null);
    };

    const rejectJob = () => {
        setIncomingJob(null);
    };

    const cancelJob = (jobId) => {
        const job = assignments.find(j => j.id === jobId);
        if (!job) return;

        const timeSinceAccept = Date.now() - job.acceptedAt; // ms

        // Rule: Instant < 3 mins
        if (job.type === 'INSTANT') {
            if (timeSinceAccept > 3 * 60 * 1000) {
                Alert.alert("Cancellation Failed", "Instant jobs can only be cancelled within 3 minutes of acceptance.");
                return;
            }
        }
        // Rule: Scheduled < 2 hours
        else if (job.type === 'SCHEDULED') {
            if (timeSinceAccept > 2 * 60 * 60 * 1000) {
                Alert.alert("Cancellation Failed", "Scheduled jobs can only be cancelled within 2 hours of acceptance.");
                return;
            }
        }

        // Remove from assignments
        setAssignments(prev => prev.filter(j => j.id !== jobId));
        endSimulation();
        Alert.alert("Job Cancelled", "The job has been removed from your schedule.");
    };

    // Transition: ACCEPTED -> ON_THE_WAY ...
    const updateJobStatus = (jobId, status) => {
        setAssignments(prev => prev.map(job =>
            job.id === jobId ? { ...job, status } : job
        ));

        if (status === 'COMPLETED') {
            endSimulation();
        }
    };

    const completeJob = (jobId) => {
        const job = assignments.find(j => j.id === jobId);
        if (!job) return;

        const completedJob = {
            ...job,
            status: 'COMPLETED',
            completedAt: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0] // Format for EarningsScreen
        };

        setJobHistory(prev => [completedJob, ...prev]);
        setAssignments(prev => prev.filter(j => j.id !== jobId));
        endSimulation();
    };

    // --- SIMULATION LOGIC ---
    const startSimulation = (job) => {
        if (simulationInterval) clearInterval(simulationInterval);

        let progress = 0;
        const totalSteps = 20; // Move in 20 steps
        const startLat = job.partnerCoords.latitude;
        const startLon = job.partnerCoords.longitude;
        const endLat = job.customerCoords.latitude;
        const endLon = job.customerCoords.longitude;

        const id = setInterval(() => {
            progress += 1;
            const fraction = progress / totalSteps;

            const newLat = startLat + (endLat - startLat) * fraction;
            const newLon = startLon + (endLon - startLon) * fraction;

            setPartnerLocation({ latitude: newLat, longitude: newLon });

            // Calc remaining
            const remainingDist = (2.5 * (1 - fraction)).toFixed(1);
            setRouteInfo({
                distance: `${remainingDist} km`,
                eta: `${Math.ceil(12 * (1 - fraction))} mins`
            });

            if (progress >= totalSteps) {
                clearInterval(id);
                setSimulationInterval(null);
            }
        }, 1000); // Update every second

        setSimulationInterval(id);
        updateJobStatus(job.id, 'ON_THE_WAY');
    };

    const endSimulation = () => {
        if (simulationInterval) {
            clearInterval(simulationInterval);
            setSimulationInterval(null);
        }
    };

    // Derived activeJob (first instant or next upcoming) for Dashboard display simplicity
    // For now, we just take the first one or logic to return 'most urgent'
    const activeJob = assignments.length > 0 ? assignments[0] : null;

    return (
        <JobContext.Provider value={{
            activeJob, // Current focused job
            assignments, // All accepted jobs
            incomingJob,
            jobHistory,
            simulateIncomingJob,
            acceptJob,
            rejectJob,
            cancelJob,
            updateJobStatus,
            completeJob,
            canGoOffline,
            checkAvailability,
            partnerLocation,
            routeInfo,
            startSimulation,
            endSimulation
        }}>
            {children}
        </JobContext.Provider>
    );
};

export const useJob = () => useContext(JobContext);
