import { authApi } from './axiosConfig';

export const authService = {
    login: async (credentials: any) => {
        const response = await authApi.post('/auth/login', credentials);
        return response.data;
    },
    register: async (data: any) => {
        const response = await authApi.post('/auth/register', data);
        return response.data;
    },
    registerStaff: async (data: { email: string; username: string; password: string; role: string }) => {
        const response = await authApi.post('/auth/register', data);
        return response.data;
    },
    listUsers: async () => {
        const response = await authApi.get('/auth/users');
        return response.data;
    },
};
