export interface CategoryResponse {
    id: number;
    name: string;
    parentId: number | null;
    hasChildren: boolean;
}
export interface TransactionRequest {
    amount: number;
    date: string;
    description: string;
    categoryId: number;
}

export interface TransactionResponse {
    id: number;
    amount: number;
    date: string;
    description: string;
    categoryId: number;
    categoryName: string;
}