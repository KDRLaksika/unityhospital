import { appointmentApi } from './axiosConfig';

export const appointmentService = {
    getAllAppointments: async (params: any = {}) => {
        const response = await appointmentApi.post('/appointments/list', params);
        return response.data;
    },
    getAppointmentById: async (id: string) => {
        const response = await appointmentApi.get(`/appointments/${id}`);
        return response.data;
    },
    addAppointment: async (data: any) => {
        const response = await appointmentApi.post('/appointments', data);
        return response.data;
    },
    updateAppointment: async (id: string, data: any) => {
        const response = await appointmentApi.put(`/appointments/${id}`, data);
        return response.data;
    },
    deleteAppointment: async (id: string) => {
        const response = await appointmentApi.delete(`/appointments/${id}`);
        return response.data;
    }
};
