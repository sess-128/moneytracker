export interface Transaction {
    id?: number;
    amount: number;
    categoryId: number;        // ← ЧИСЛО, не строка
    categoryName?: string;
    description: string;
    date: string;
    type: 'income' | 'expense';
}

export interface Category {
    id: number;
    name: string;
    parentId?: number | null;
    hasChildren?: boolean;
    type: 'income' | 'expense';
}