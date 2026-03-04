import { organizationApi } from './axiosConfig';

export const organizationService = {
    getAllCompanyDetails: async (req: any = {}) => {
        const response = await organizationApi.post('/company-details/list', req);
        return response.data;
    },
    getCompanyDetailById: async (id: string) => {
        const response = await organizationApi.get(`/company-details/${id}`);
        return response.data;
    },
    addCompanyDetail: async (data: any) => {
        const response = await organizationApi.post('/company-details', data);
        return response.data;
    },
    updateCompanyDetail: async (id: string, data: any) => {
        const response = await organizationApi.put(`/company-details/${id}`, data);
        return response.data;
    },
    deleteCompanyDetail: async (id: string) => {
        const response = await organizationApi.delete(`/company-details/${id}`);
        return response.data;
    },
    getDropdownCompanyDetails: async (search?: string) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);

        const response = await organizationApi.get(`/company-details/dropdown?${params.toString()}`);
        return response.data;
    }
};
