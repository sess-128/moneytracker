import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction, TransactionFilters } from '../types';
import { transactionApi } from '../services/api';

interface CategoryData {
    name: string;
    value: number;
    color: string;
}

const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
    '#82CA9D', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'
];

interface CategoryPieChartProps {
    filters: TransactionFilters;
}

// Функция для получения числового значения из amount (может быть number или BigDecimal-подобным объектом)
const getAmountValue = (amount: number | { value?: number } | undefined): number => {
    if (typeof amount === 'number') return amount;
    if (amount && typeof amount === 'object' && 'value' in amount) return amount.value || 0;
    return 0;
};

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ filters }) => {
    const [data, setData] = useState<CategoryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalExpense, setTotalExpense] = useState(0);

    useEffect(() => {
        const loadCategoryStats = async () => {
            setLoading(true);
            try {
                // Получаем все транзакции с текущими фильтрами
                const response = await transactionApi.getWithFilters(filters, 0, 1000);
                const transactions: Transaction[] = response.data.content;

                // Группируем по категориям (только расходы)
                const categoryMap = new Map<string, number>();
                let total = 0;

                transactions.forEach((t: Transaction) => {
                    if (t.type === 'EXPENSE' && t.categoryName) {
                        const amount = getAmountValue(t.amount);
                        const current = categoryMap.get(t.categoryName) || 0;
                        categoryMap.set(t.categoryName, current + amount);
                        total += amount;
                    }
                });

                setTotalExpense(total);

                // Преобразуем в массив и сортируем
                const chartData: CategoryData[] = Array.from(categoryMap.entries())
                    .map(([name, value], index) => ({
                        name,
                        value,
                        color: COLORS[index % COLORS.length]
                    }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 10); // Топ-10 категорий

                setData(chartData);
            } catch (error) {
                console.error('Error loading category stats:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCategoryStats();
    }, [filters]);

    if (loading) {
        return (
            <Paper sx={{ p: 2, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">Загрузка...</Typography>
            </Paper>
        );
    }

    if (data.length === 0) {
        return (
            <Paper sx={{ p: 2, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">Нет данных о расходах</Typography>
            </Paper>
        );
    }

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const percent = totalExpense > 0 ? ((payload[0].value as number) / totalExpense * 100).toFixed(1) : '0.0';
            return (
                <Box sx={{ bgcolor: 'background.paper', p: 1, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                        {payload[0].name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {(payload[0].value as number).toLocaleString('ru-RU')} ₽ ({percent}%)
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    return (
        <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
                Расходы по категориям
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Всего: {totalExpense.toLocaleString('ru-RU')} ₽
            </Typography>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) => {
                            if (percent === undefined || percent === null) return name;
                            return `${name} (${(percent * 100).toFixed(0)}%)`;
                        }}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        formatter={(value) => <span style={{ fontSize: '12px' }}>{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export default CategoryPieChart;