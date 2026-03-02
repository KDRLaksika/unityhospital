import { pharmacyApi } from './axiosConfig';

export interface DrugResponseDto {
    id: string;
    name: string;
    code: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface DrugListRequestDto {
    page?: number;
    size?: number;
    name?: string;
    code?: string;
    search?: string;
}

export interface PageResponse<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const pharmacyService = {
    getAllDrugs: async (params: DrugListRequestDto): Promise<ApiResponse<PageResponse<DrugResponseDto>>> => {
        const response = await pharmacyApi.post('/drugs/list', params);
        return response.data;
    },

    getDrugById: async (id: string): Promise<ApiResponse<DrugResponseDto>> => {
        const response = await pharmacyApi.get(`/drugs/${id}`);
        return response.data;
    },

    createDrug: async (data: any): Promise<ApiResponse<DrugResponseDto>> => {
        const response = await pharmacyApi.post('/drugs', data);
        return response.data;
    },

    updateDrug: async (id: string, data: any): Promise<ApiResponse<DrugResponseDto>> => {
        const response = await pharmacyApi.put(`/drugs/${id}`, data);
        return response.data;
    },

    deleteDrug: async (id: string): Promise<ApiResponse<object>> => {
        const response = await pharmacyApi.delete(`/drugs/${id}`);
        return response.data;
    }
};
