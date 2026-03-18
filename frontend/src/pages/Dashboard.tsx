import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Snackbar, Alert } from '@mui/material';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';

const Dashboard: React.FC = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    // Состояние для уведомлений
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    }>({ open: false, message: '', severity: 'info' });

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
    };

    const handleTransactionDeleted = () => {
        setRefreshKey(prev => prev + 1);
        showNotification('Транзакция удалена', 'success');
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h4" gutterBottom>Dashboard</Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    {/* Передаем функцию уведомления вместо alert */}
                    <TransactionForm onNotify={showNotification} onSuccess={handleTransactionAdded} />
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Последние транзакции</Typography>
                        <TransactionList refreshKey={refreshKey} onNotify={showNotification} />
                    </Paper>
                </Grid>
            </Grid>

            {/* Компонент уведомления */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000} // Исчезнет через 3 секунды
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