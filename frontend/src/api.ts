import axios from 'axios';
import type {TransactionRequest, TransactionResponse, CategoryResponse} from './types';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: { 'Content-Type': 'application/json' },
});

export const categoryApi = {
    getAllLeaves: () => api.get<CategoryResponse[]>('/categories/leaves'),
    // Можно добавить getAllTree позже, если нужно строить полное дерево визуально
};

export const transactionApi = {
    create: (data: TransactionRequest) => api.post<TransactionResponse>('/transactions', data),
    getAll: () => api.get<TransactionResponse[]>('/transactions'),
};

export default api;