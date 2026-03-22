import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { analyticsApi } from '../services/api';

interface SpendingTrendChartProps {
    startDate?: string;
    endDate?: string;
    title?: string;
}

interface ChartData {
    date: string;
    dateShort: string;
    daily: number;
    cumulative: number;
}

const SpendingTrendChart: React.FC<SpendingTrendChartProps> = ({ 
    startDate, 
    endDate,
    title = 'Динамика расходов'
}) => {
    const theme = useTheme();
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const response = await analyticsApi.getCumulativeSpending(startDate, endDate);
                const chartData: ChartData[] = response.data.map(item => ({
                    date: item.date,
                    dateShort: new Date(item.date).toLocaleDateString('ru-RU', { 
                        day: 'numeric', 
                        month: 'short' 
                    }),
                    daily: item.amount,
                    cumulative: item.cumulativeAmount
                }));
                setData(chartData);
            } catch (error) {
                console.error('Error loading spending trend:', error);
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
                    <Typography variant="body2" fontWeight="bold" color="primary.main">
                        Накоплено: {payload[1].value.toLocaleString('ru-RU')} ₽
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        За день: {payload[0].value.toLocaleString('ru-RU')} ₽
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

    const totalSpent = data[data.length - 1]?.cumulative || 0;

    return (
        <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="caption" color="text.secondary">
                    Всего: {totalSpent.toLocaleString('ru-RU')} ₽
                </Typography>
            </Box>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1976d2" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#1976d2" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
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
                    <Area
                        type="monotone"
                        dataKey="daily"
                        name="За день"
                        stroke="#ff9800"
                        fill="transparent"
                        strokeWidth={2}
                    />
                    <Area
                        type="monotone"
                        dataKey="cumulative"
                        name="Накоплено"
                        stroke="#1976d2"
                        fillOpacity={1}
                        fill="url(#colorCumulative)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export default SpendingTrendChart;
