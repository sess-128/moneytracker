import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { analyticsApi } from '../services/api';

interface ExpensesVsBalanceChartProps {
    startDate?: string;
    endDate?: string;
    title?: string;
}

interface ChartData {
    date: string;
    dateShort: string;
    expenses: number;
    balance: number;
}

const ExpensesVsBalanceChart: React.FC<ExpensesVsBalanceChartProps> = ({
    startDate,
    endDate,
    title = 'Расходы и текущий баланс'
}) => {
    const theme = useTheme();
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Получаем накопительные данные о расходах
                const response = await analyticsApi.getCumulativeSpending(startDate, endDate);
                
                // Преобразуем cumulative в daily expenses и считаем баланс
                let totalIncome = 0;
                let totalExpenses = 0;
                
                // Сначала получим общую сумму доходов за период
                if (startDate && endDate) {
                    const statsResponse = await analyticsApi.getStats(startDate, endDate);
                    totalIncome = statsResponse.data.totalIncome;
                }

                const chartData: ChartData[] = response.data.map((item, index) => {
                    const dailyExpense = index === 0
                        ? item.cumulativeAmount
                        : item.cumulativeAmount - response.data[index - 1].cumulativeAmount;
                    
                    totalExpenses = item.cumulativeAmount;
                    // Баланс = общий доход - текущие расходы
                    const currentBalance = totalIncome - totalExpenses;

                    return {
                        date: item.date,
                        dateShort: new Date(item.date).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'short'
                        }),
                        expenses: dailyExpense,
                        balance: currentBalance
                    };
                });

                setData(chartData);
            } catch (error) {
                console.error('Error loading chart data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [startDate, endDate]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <Box sx={{
                    bgcolor: 'background.paper',
                    p: 1.5,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    boxShadow: 1
                }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        {label}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="error.main">
                        Расход: {payload[0].value.toLocaleString('ru-RU')} ₽
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color={payload[1].value >= 0 ? 'success.main' : 'error.main'}>
                        Баланс: {payload[1].value.toLocaleString('ru-RU')} ₽
                    </Typography>
                </Box>
            );
        }
        return null;
    };

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
                <Typography color="text.secondary">Нет данных за выбранный период</Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{title}</Typography>
            </Box>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis
                        dataKey="dateShort"
                        tick={{ fontSize: 12 }}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        formatter={(value) => <span style={{ fontSize: '12px' }}>{value}</span>}
                    />
                    <Line
                        type="monotone"
                        dataKey="expenses"
                        name="Расходы"
                        stroke="#f44336"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="balance"
                        name="Баланс"
                        stroke="#4caf50"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export default ExpensesVsBalanceChart;
