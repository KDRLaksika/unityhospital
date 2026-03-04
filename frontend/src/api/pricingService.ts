import { pricingApi } from './axiosConfig';

export const pricingService = {
    getAllPricePlans: async (req: any = {}) => {
        const response = await pricingApi.post('/price-plans/list', req);
        return response.data;
    },
    getPricePlanById: async (id: string) => {
        const response = await pricingApi.get(`/price-plans/${id}`);
        return response.data;
    },
    addPricePlan: async (data: any) => {
        const response = await pricingApi.post('/price-plans', data);
        return response.data;
    },
    updatePricePlan: async (id: string, data: any) => {
        const response = await pricingApi.put(`/price-plans/${id}`, data);
        return response.data;
    },
    deletePricePlan: async (id: string) => {
        const response = await pricingApi.delete(`/price-plans/${id}`);
        return response.data;
    },
    getDropdownPricePlans: async (search?: string, appointmentTypeId?: string) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (appointmentTypeId) params.append('appointmentTypeId', appointmentTypeId);

        const response = await pricingApi.get(`/price-plans/dropdown?${params.toString()}`);
        return response.data;
    }
};
