import axios from 'axios';
import { Transaction, Category } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const transactionApi = {
    getAll: () => api.get<Transaction[]>('/transactions'),
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

export default api;