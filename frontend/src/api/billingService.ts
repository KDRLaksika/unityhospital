import { billingApi } from './axiosConfig';

export interface InvoiceResponseDto {
    id: string;
    patientId: string;
    appointmentId: string;
    pricePlanId: string;
    totalAmount: number;
    status: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface InvoiceListRequestDto {
    page?: number;
    size?: number;
    patientName?: string;
    status?: string;
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

export const billingService = {
    getAllInvoices: async (params: InvoiceListRequestDto): Promise<ApiResponse<PageResponse<InvoiceResponseDto>>> => {
        const response = await billingApi.post('/invoices/list', params);
        return response.data;
    },

    getInvoiceById: async (id: string): Promise<ApiResponse<InvoiceResponseDto>> => {
        const response = await billingApi.get(`/invoices/${id}`);
        return response.data;
    },

    createInvoice: async (data: any): Promise<ApiResponse<InvoiceResponseDto>> => {
        const response = await billingApi.post('/invoices', data);
        return response.data;
    },

    updateInvoice: async (id: string, data: any): Promise<ApiResponse<InvoiceResponseDto>> => {
        const response = await billingApi.put(`/invoices/${id}`, data);
        return response.data;
    }
};
