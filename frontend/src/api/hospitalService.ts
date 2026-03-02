import { hospitalApi } from './axiosConfig';

export const hospitalService = {
    getAllAppointmentTypes: async () => {
        const response = await hospitalApi.post('/appointment-types/list', {});
        return response.data;
    },
    getAppointmentTypeById: async (id: string) => {
        const response = await hospitalApi.get(`/appointment-types/${id}`);
        return response.data;
    },
    addAppointmentType: async (data: any) => {
        const response = await hospitalApi.post('/appointment-types', data);
        return response.data;
    },
    updateAppointmentType: async (id: string, data: any) => {
        const response = await hospitalApi.put(`/appointment-types/${id}`, data);
        return response.data;
    },
    deleteAppointmentType: async (id: string) => {
        const response = await hospitalApi.delete(`/appointment-types/${id}`);
        return response.data;
    }
};
