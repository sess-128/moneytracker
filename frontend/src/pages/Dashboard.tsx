import React, { useState, useEffect, useCallback } from 'react';
import { 
    Container, Grid, Paper, Typography, Snackbar, Alert, Box,
    FormControl, InputLabel, Select, MenuItem, Button, Stack
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import MiniDashboardCard from '../components/MiniDashboardCard';
import PeriodComparisonCard from '../components/PeriodComparisonCard';
import SpendingTrendChart from '../components/SpendingTrendChart';
import { SpendingStats, PeriodComparison } from '../types';
import { analyticsApi } from '../services/api';

const Dashboard: React.FC = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [period, setPeriod] = useState<string>('week');

    // Состояние для уведомлений
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    }>({ open: false, message: '', severity: 'info' });

    // Состояния для данных
    const [todayStats, setTodayStats] = useState<SpendingStats | null>(null);
    const [weekStats, setWeekStats] = useState<SpendingStats | null>(null);
    const [comparison, setComparison] = useState<PeriodComparison | null>(null);

    // Функция показа уведомления
    const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const handleTransactionAdded = () => {
        setRefreshKey(prev => prev + 1);
        showNotification('Транзакция успешно добавлена!', 'success');
        loadData(); // Обновляем данные после добавления
    };

    // Вычисление дат для периодов
    const getPeriodDates = (periodType: string) => {
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
            default:
                start = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        return {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        };
    };

    const loadData = useCallback(async () => {
        try {
            // Сегодня
            const today = getPeriodDates('today');
            const todayRes = await analyticsApi.getStats(today.start, today.end);
            setTodayStats(todayRes.data);

            // Эта неделя
            const week = getPeriodDates('week');
            const weekRes = await analyticsApi.getStats(week.start, week.end);
            setWeekStats(weekRes.data);

            // Сравнение периодов (выбранный период vs предыдущий)
            const selectedPeriod = getPeriodDates(period);
            const compRes = await analyticsApi.comparePeriods(selectedPeriod.start, selectedPeriod.end);
            setComparison(compRes.data);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            showNotification('Ошибка загрузки данных', 'error');
        }
    }, [period]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Dashboard</Typography>
                
                <Stack direction="row" spacing={2} alignItems="center">
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Период сравнения</InputLabel>
                        <Select
                            value={period}
                            label="Период сравнения"
                            onChange={(e) => setPeriod(e.target.value)}
                        >
                            <MenuItem value="week">Эта неделя</MenuItem>
                            <MenuItem value="month">Этот месяц</MenuItem>
                            <MenuItem value="year">Этот год</MenuItem>
                        </Select>
                    </FormControl>

                    <Button 
                        variant="outlined" 
                        size="small"
                        startIcon={<RefreshIcon />}
                        onClick={loadData}
                    >
                        Обновить
                    </Button>
                </Stack>
            </Box>

            {/* Быстрые карточки: Сегодня и Эта неделя */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    {todayStats && (
                        <MiniDashboardCard stats={todayStats} periodLabel="📅 Сегодня" />
                    )}
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    {weekStats && (
                        <MiniDashboardCard stats={weekStats} periodLabel="📅 Эта неделя" />
                    )}
                </Grid>
            </Grid>

            {/* Сравнение периодов */}
            {comparison && (
                <PeriodComparisonCard 
                    comparison={comparison} 
                    title={`Сравнение: ${period === 'week' ? 'Эта неделя' : period === 'month' ? 'Этот месяц' : 'Этот год'} vs Пред. период`}
                    sx={{ mb: 3 }}
                />
            )}

            {/* График и форма */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 2 }}>
                        <SpendingTrendChart 
                            startDate={getPeriodDates(period).start}
                            endDate={getPeriodDates(period).end}
                            title={`Динамика расходов (${period === 'week' ? 'неделя' : period === 'month' ? 'месяц' : 'год'})`}
                        />
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <TransactionForm onNotify={showNotification} onSuccess={handleTransactionAdded} />
                </Grid>
            </Grid>

            {/* Последние транзакции */}
            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Последние транзакции</Typography>
                <TransactionList refreshKey={refreshKey} onNotify={showNotification} />
            </Paper>

            {/* Компонент уведомления */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Dashboard;