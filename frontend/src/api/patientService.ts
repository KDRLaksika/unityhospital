import { patientApi } from './axiosConfig';

export const patientService = {
    getAllPatients: async (params: any = {}) => {
        const response = await patientApi.post('/patients/list', params);
        return response.data;
    },
    getPatientById: async (id: string) => {
        const response = await patientApi.get(`/patients/${id}`);
        return response.data;
    },
    addPatient: async (data: any) => {
        const response = await patientApi.post('/patients', data);
        return response.data;
    },
    updatePatient: async (id: string, data: any) => {
        const response = await patientApi.put(`/patients/${id}`, data);
        return response.data;
    },
    deletePatient: async (id: string) => {
        const response = await patientApi.delete(`/patients/${id}`);
        return response.data;
    }
};
