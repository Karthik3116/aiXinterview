// import axios from 'axios';

// const isPrimaryApiHealthy = async (primaryUrl) => {
//     try {
//         const res = await axios.get(`${primaryUrl}/api`);
//         return res.data === 'API Running';
//     } catch {
//         return false;
//     }
// };

// export const getWorkingApiBaseUrl = async () => {
//     const primaryBase = import.meta.env.VITE_API_BASE_URL;
//     const fallbackBase = `https://${import.meta.env.VITE_API_BASE_URL_2}`;

//     const isHealthy = await isPrimaryApiHealthy(primaryBase);
//     return isHealthy ? primaryBase : fallbackBase;
// };

import axios from 'axios';

const isPrimaryApiHealthy = async (primaryUrl) => {
    try {
        const res = await axios.get(`${primaryUrl}`);
        // Consider the API unhealthy if rate-limited or not returning expected status/data
        if (res.status === 429 || res.status === 503 || res.data !== 'API Running') {
            return false;
        }
        return true;
    } catch (error) {
        // Also handle if error response explicitly shows 429
        if (error?.response?.status === 429) {
            console.warn(`Primary API rate-limited: ${error.response.status}`);
            return false;
        }
        return false;
    }
};

export const getWorkingApiBaseUrl = async () => {
    const primaryBase = "http://localhost:5000";
    const fallbackBase = `http://localhost:5000`;

    const isHealthy = await isPrimaryApiHealthy(primaryBase);
    return isHealthy ? primaryBase : fallbackBase;
};
