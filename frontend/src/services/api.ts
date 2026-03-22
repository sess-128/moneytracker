import axios from 'axios';
import { Transaction, Category, TransactionFilters, PageResponse, DailySpending, SpendingStats, PeriodComparison } from '../types';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const transactionApi = {
    getAll: () => api.get<Transaction[]>('/transactions'),

    getWithFilters: (filters: TransactionFilters, page: number = 0, size: number = 40) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('size', size.toString());

        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.parentCategoryIds?.length) {
            filters.parentCategoryIds.forEach(id => params.append('parentCategoryIds', id.toString()));
        }
        if (filters.categoryIds?.length) {
            filters.categoryIds.forEach(id => params.append('categoryIds', id.toString()));
        }
        if (filters.minAmount) params.append('minAmount', filters.minAmount.toString());
        if (filters.maxAmount) params.append('maxAmount', filters.maxAmount.toString());
        if (filters.description) params.append('description', filters.description);
        if (filters.type) params.append('type', filters.type);

        return api.get<PageResponse<Transaction>>(`/transactions/filter?${params}`);
    },

    create: (data: any) => api.post('/transactions', data),
    delete: (id: number) => api.delete(`/transactions/${id}`),
};

export const categoryApi = {
    getAll: () => api.get<Category[]>('/categories/all'),
    getRoot: () => api.get<Category[]>('/categories'),
    getByParent: (parentId: number) => api.get<Category[]>(`/categories/${parentId}/children`),
    create: (data: any) => api.post('/categories', data),
    update: (id: number, data: any) => api.put(`/categories/${id}`, data),
    delete: (id: number) => api.delete(`/categories/${id}`),
};

export const analyticsApi = {
    getStats: (startDate?: string, endDate?: string) => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        return api.get<SpendingStats>(`/analytics/stats?${params}`);
    },

    comparePeriods: (startDate?: string, endDate?: string) => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        return api.get<PeriodComparison>(`/analytics/compare?${params}`);
    },

    getCumulativeSpending: (startDate?: string, endDate?: string) => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        return api.get<DailySpending[]>(`/analytics/cumulative?${params}`);
    },

    getSpendingByCategory: (startDate?: string, endDate?: string) => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        return api.get<Record<string, number>>(`/analytics/by-category?${params}`);
    },
};

export default api;