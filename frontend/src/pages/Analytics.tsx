import React, { useState, useEffect, useCallback } from 'react';
import { 
    Container, Typography, Grid, Paper, Box, 
    FormControl, InputLabel, Select, MenuItem, TextField, Button, Stack
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { SpendingStats } from '../types';
import { analyticsApi } from '../services/api';
import SpendingTrendChart from '../components/SpendingTrendChart';
import DailyBarChart from '../components/DailyBarChart';

const Analytics: React.FC = () => {
    const [period, setPeriod] = useState<string>('month');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [stats, setStats] = useState<SpendingStats | null>(null);

    // Вычисление дат для предустановленных периодов
    const getPeriodDates = useCallback((periodType: string) => {
        const now = new Date();
        let start: Date;
        let end: Date = now;

        switch (periodType) {
            case 'today':
                start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                start = new Date(now);
                start.setDate(now.getDate() - now.getDay() + 1); // Понедельник
                start.setHours(0, 0, 0, 0);
                break;
            case 'month':
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'year':
                start = new Date(now.getFullYear(), 0, 1);
                break;
            case 'custom':
                return { start: startDate || undefined, end: endDate || undefined };
            default:
                start = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        return {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        };
    }, [startDate, endDate]);

    const loadStats = useCallback(async () => {
        try {
            const dates = getPeriodDates(period);
            const response = await analyticsApi.getStats(dates.start, dates.end);
            setStats(response.data);
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }, [period, getPeriodDates]);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    const dates = getPeriodDates(period);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('ru-RU', { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
        });
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Аналитика</Typography>
                
                <Stack direction="row" spacing={2} alignItems="center">
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Период</InputLabel>
                        <Select
                            value={period}
                            label="Период"
                            onChange={(e) => setPeriod(e.target.value)}
                        >
                            <MenuItem value="today">Сегодня</MenuItem>
                            <MenuItem value="week">Эта неделя</MenuItem>
                            <MenuItem value="month">Этот месяц</MenuItem>
                            <MenuItem value="year">Этот год</MenuItem>
                            <MenuItem value="custom">Свой период</MenuItem>
                        </Select>
                    </FormControl>

                    {period === 'custom' && (
                        <>
                            <TextField
                                label="С"
                                type="date"
                                size="small"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{ width: 130 }}
                            />
                            <TextField
                                label="По"
                                type="date"
                                size="small"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{ width: 130 }}
                            />
                        </>
                    )}

                    <Button 
                        variant="outlined" 
                        size="small"
                        startIcon={<RefreshIcon />}
                        onClick={loadStats}
                    >
                        Обновить
                    </Button>
                </Stack>
            </Box>

            {/* Карточки статистики */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            РАСХОДЫ
                        </Typography>
                        <Typography 
                            variant="h5" 
                            color="error.main" 
                            fontWeight="bold"
                            sx={{ mt: 1 }}
                        >
                            -{stats ? formatCurrency(stats.totalExpense) : '0.00'} ₽
                        </Typography>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            ДОХОДЫ
                        </Typography>
                        <Typography 
                            variant="h5" 
                            color="success.main" 
                            fontWeight="bold"
                            sx={{ mt: 1 }}
                        >
                            +{stats ? formatCurrency(stats.totalIncome) : '0.00'} ₽
                        </Typography>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            БАЛАНС
                        </Typography>
                        <Typography 
                            variant="h5" 
                            color={stats && stats.balance >= 0 ? 'success.main' : 'error.main'} 
                            fontWeight="bold"
                            sx={{ mt: 1 }}
                        >
                            {stats && stats.balance >= 0 ? '+' : ''}{stats ? formatCurrency(stats.balance) : '0.00'} ₽
                        </Typography>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            СРЕДНЕЕ В ДЕНЬ
                        </Typography>
                        <Typography 
                            variant="h5" 
                            color="text.primary" 
                            fontWeight="bold"
                            sx={{ mt: 1 }}
                        >
                            {stats ? formatCurrency(stats.averageDailyExpense) : '0.00'} ₽
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Основной график */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Box sx={{ height: 400 }}>
                    <SpendingTrendChart 
                        startDate={dates.start} 
                        endDate={dates.end}
                        title="Накопительная динамика расходов"
                    />
                </Box>
            </Paper>

            {/* Дополнительные графики */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <DailyBarChart 
                        startDate={dates.start} 
                        endDate={dates.end}
                        title="Расходы по дням"
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            Информация
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                <strong>Период:</strong> {dates.start} — {dates.end}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                <strong>Транзакций:</strong> {stats?.transactionCount || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Дней в периоде:</strong> {
                                    stats && dates.start && dates.end 
                                        ? Math.ceil((new Date(dates.end).getTime() - new Date(dates.start).getTime()) / (1000 * 60 * 60 * 24)) + 1
                                        : 0
                                }
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Analytics;
