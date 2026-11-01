/**
 * API Service for Student Internship Portal
 * Uses native Fetch API and reads API URL from environment variable
 */

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

/**
 * Helper to handle fetch responses and error messages
 */
const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
        data = await response.json();
    } else {
        const text = await response.text();
        data = { message: text };
    }

    if (!response.ok) {
        const errorMessage =
            data && data.message
                ? data.message
                : `HTTP Error ${response.status}: ${response.statusText}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
};

/**
 * Fetch all internships, with optional search and type filter
 */
export const getInternships = async (search = '', type = 'All') => {
    const params = new URLSearchParams();
    if (search && search.trim()) params.append('search', search.trim());
    if (type && type !== 'All') params.append('type', type);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${API_BASE}/api/internships${queryString}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return handleResponse(response);
};

/**
 * Fetch single internship details by ID
 */
export const getInternshipById = async (id) => {
    if (!id) throw new Error('Internship ID is required');

    const response = await fetch(`${API_BASE}/api/internships/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return handleResponse(response);
};

/**
 * Submit student application
 */
export const submitApplication = async (applicationData) => {
    const response = await fetch(`${API_BASE}/api/applications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
    });

    return handleResponse(response);
};

/**
 * Retrieve all submitted applications
 */
export const getApplications = async () => {
    const response = await fetch(`${API_BASE}/api/applications`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return handleResponse(response);
};

/**
 * Seed sample internships data
 */
export const seedSampleInternships = async () => {
    const response = await fetch(`${API_BASE}/api/internships/seed`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return handleResponse(response);
};

export default {
    getInternships,
    getInternshipById,
    submitApplication,
    getApplications,
    seedSampleInternships,
};

