// frontend/src/apiConfig.js

/**
 * API Configuration
 * 
 * In development, we use the Vite proxy defined in vite.config.js
 * In production, we use the VITE_API_URL environment variable or fallback to relative path
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const API_URLS = {
    auth: {
        base: `${API_BASE_URL}/api/auth`,
        login: `${API_BASE_URL}/api/auth/login`,
        register: `${API_BASE_URL}/api/auth/register`,
        me: `${API_BASE_URL}/api/auth/me`,
    },
    business: {
        base: `${API_BASE_URL}/api/business`,
        config: `${API_BASE_URL}/api/business/config`,
        urls: `${API_BASE_URL}/api/business/urls`,
    },
    chat: {
        send: `${API_BASE_URL}/api/chat`,
        public: `${API_BASE_URL}/api/chat/public`,
    },
    documents: {
        base: `${API_BASE_URL}/api/documents`,
        upload: `${API_BASE_URL}/api/documents/upload`,
    },
    leads: {
        base: `${API_BASE_URL}/api/leads`,
    },
    v1: {
        dashboard: `${API_BASE_URL}/api/business/v1/dashboard/stats`,
        analytics: `${API_BASE_URL}/api/business/v1/analytics/overview`,
        tickets: `${API_BASE_URL}/api/business/v1/tickets`,
        subscription: `${API_BASE_URL}/api/business/v1/subscription`,
        team: `${API_BASE_URL}/api/business/v1/team`,
    },
    admin: {
        stats: `${API_BASE_URL}/api/admin/v1/dashboard`,
        tenants: `${API_BASE_URL}/api/admin/v1/tenants`,
    }
};

export default API_BASE_URL;
