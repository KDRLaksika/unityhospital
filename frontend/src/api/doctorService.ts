import { doctorApi } from './axiosConfig';

export const doctorService = {
    getAllDoctors: async (params: any = {}) => {
        const response = await doctorApi.post('/doctors/list', params);
        return response.data;
    },
    getDoctorById: async (id: string) => {
        const response = await doctorApi.get(`/doctors/${id}`);
        return response.data;
    },
    addDoctor: async (data: any) => {
        const response = await doctorApi.post('/doctors', data);
        return response.data;
    },
    updateDoctor: async (id: string, data: any) => {
        const response = await doctorApi.put(`/doctors/${id}`, data);
        return response.data;
    },
    deleteDoctor: async (id: string) => {
        const response = await doctorApi.delete(`/doctors/${id}`);
        return response.data;
    }
};
