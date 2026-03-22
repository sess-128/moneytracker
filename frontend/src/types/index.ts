export interface Transaction {
    id?: number;
    amount: number | { value?: number }; // BigDecimal с бэкенда может прийти как объект
    categoryId: number;
    categoryName?: string;
    description: string;
    date: string;
    type?: 'INCOME' | 'EXPENSE';
    parentCategoryId?: number | null;
    parentCategoryName?: string | null;
}

export interface Category {
    id: number;
    name: string;
    parentId?: number | null;
    hasChildren?: boolean;
    type: 'INCOME' | 'EXPENSE';
}

export interface TransactionFilters {
    startDate?: string;
    endDate?: string;
    parentCategoryIds?: number[];
    categoryIds?: number[];
    minAmount?: number;
    maxAmount?: number;
    description?: string;
    type?: 'INCOME' | 'EXPENSE';
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface DailySpending {
    date: string;
    amount: number;
    cumulativeAmount: number;
}

export interface SpendingStats {
    totalExpense: number;
    totalIncome: number;
    balance: number;
    transactionCount: number;
    averageDailyExpense: number;
}

export interface PeriodComparison {
    currentPeriod: SpendingStats;
    previousPeriod: SpendingStats;
    expenseChangePercent: number;
    incomeChangePercent: number;
    balanceChangePercent: number;
}