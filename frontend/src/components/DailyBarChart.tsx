import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { analyticsApi } from '../services/api';

interface DailyBarChartProps {
    startDate?: string;
    endDate?: string;
    title?: string;
}

interface ChartData {
    date: string;
    dateShort: string;
    expense: number;
    income: number;
}

const DailyBarChart: React.FC<DailyBarChartProps> = ({ 
    startDate, 
    endDate,
    title = 'Расходы по дням'
}) => {
    const theme = useTheme();
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Получаем накопительные данные и преобразуем их
                const response = await analyticsApi.getCumulativeSpending(startDate, endDate);
                
                // Преобразуем cumulative в daily
                const chartData: ChartData[] = response.data.map((item, index) => {
                    const daily = index === 0 
                        ? item.cumulativeAmount 
                        : item.cumulativeAmount - response.data[index - 1].cumulativeAmount;
                    
                    return {
                        date: item.date,
                        dateShort: new Date(item.date).toLocaleDateString('ru-RU', { 
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                        }),
                        expense: daily,
                        income: 0 // Для будущих улучшений
                    };
                });
                
                setData(chartData);
            } catch (error) {
                console.error('Error loading daily chart:', error);
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
                </Box>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <Paper sx={{ p: 2, height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">Загрузка...</Typography>
            </Paper>
        );
    }

    if (data.length === 0) {
        return (
            <Paper sx={{ p: 2, height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">Нет данных за выбранный период</Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>{title}</Typography>

            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis 
                        dataKey="dateShort" 
                        tick={{ fontSize: 11 }}
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                    />
                    <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                        formatter={(value) => <span style={{ fontSize: '12px' }}>{value}</span>}
                    />
                    <Bar dataKey="expense" name="Расход">
                        {data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={entry.expense > 0 ? '#f44336' : theme.palette.divider}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export default DailyBarChart;
