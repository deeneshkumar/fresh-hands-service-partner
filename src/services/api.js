export const api = {
    login: async (phone) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: 'OTP Sent' });
            }, 1000);
        });
    },

    verifyOtp: async (phone, otp) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate new user vs existing user
                if (phone === '9999999999') {
                    resolve({
                        success: true,
                        isNewUser: false,
                        user: {
                            id: 'p1',
                            name: 'John Doe',
                            status: 'APPROVED',
                            phone
                        }
                    });
                } else {
                    resolve({ success: true, isNewUser: true });
                }
            }, 1000);
        });
    },

    register: async (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    user: {
                        id: 'p2',
                        name: data.name,
                        status: 'PENDING_VERIFICATION',
                        ...data
                    }
                });
            }, 1500);
        });
    },

    getJobs: async (status) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const jobs = [
                    {
                        id: 'j1',
                        service: 'Plumber - Tap Leakage',
                        customer: 'Alice Smith',
                        address: '123, Green Park, Chennai',
                        amount: 350,
                        status: 'NEW',
                        distance: '2.5 km',
                        time: 'Now'
                    },
                    {
                        id: 'j2',
                        service: 'AC Service',
                        customer: 'Bob Brown',
                        address: '45, Anna Nagar, Chennai',
                        amount: 500,
                        status: 'COMPLETED',
                        date: 'Yesterday'
                    }
                ];
                if (status === 'NEW') resolve(jobs.filter(j => j.status === 'NEW'));
                else if (status === 'HISTORY') resolve(jobs.filter(j => j.status === 'COMPLETED'));
                else resolve([]);
            }, 500);
        });
    }
};
