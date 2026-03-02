import axios from 'axios';

// Ensure to handle the trailing slashes in your usages
// Route all traffic through the API Gateway (Port 8080)
export const GATEWAY_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const AUTH_API_URL = `${GATEWAY_URL}/authservice/api`;
export const DOCTOR_API_URL = `${GATEWAY_URL}/doctorservice/api`;
export const PATIENT_API_URL = `${GATEWAY_URL}/patientservice/api`;
export const APPOINTMENT_API_URL = `${GATEWAY_URL}/appointmentservice/api`;
export const BILLING_API_URL = `${GATEWAY_URL}/billingservice/api`;
export const PHARMACY_API_URL = `${GATEWAY_URL}/pharmacyservice/api`;
export const HOSPITAL_API_URL = `${GATEWAY_URL}/hospitalservice/api`;

const authInterceptor = (config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

// Instance for Auth Service
export const authApi = axios.create({
    baseURL: AUTH_API_URL,
    headers: { 'Content-Type': 'application/json' }
});
authApi.interceptors.request.use(authInterceptor);

// Instance for Doctor Service
export const doctorApi = axios.create({
    baseURL: DOCTOR_API_URL,
    headers: { 'Content-Type': 'application/json' }
});
doctorApi.interceptors.request.use(authInterceptor);

// Instance for Patient Service
export const patientApi = axios.create({
    baseURL: PATIENT_API_URL,
    headers: { 'Content-Type': 'application/json' }
});
patientApi.interceptors.request.use(authInterceptor);

// Instance for Appointment Service
export const appointmentApi = axios.create({
    baseURL: APPOINTMENT_API_URL,
    headers: { 'Content-Type': 'application/json' }
});
appointmentApi.interceptors.request.use(authInterceptor);

// Instance for Billing Service
export const billingApi = axios.create({
    baseURL: BILLING_API_URL,
    headers: { 'Content-Type': 'application/json' }
});
billingApi.interceptors.request.use(authInterceptor);

// Instance for Pharmacy Service
export const pharmacyApi = axios.create({
    baseURL: PHARMACY_API_URL,
    headers: { 'Content-Type': 'application/json' }
});
pharmacyApi.interceptors.request.use(authInterceptor);

// Instance for Hospital Service
export const hospitalApi = axios.create({
    baseURL: HOSPITAL_API_URL,
    headers: { 'Content-Type': 'application/json' }
});
hospitalApi.interceptors.request.use(authInterceptor);
