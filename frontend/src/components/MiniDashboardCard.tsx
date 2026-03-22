import React from 'react';
import { Paper, Typography, Box, Stack } from '@mui/material';
import { SpendingStats } from '../types';

interface MiniDashboardCardProps {
    stats: SpendingStats;
    periodLabel: string;
}

const MiniDashboardCard: React.FC<MiniDashboardCardProps> = ({ stats, periodLabel }) => {
    const formatCurrency = (value: number) => {
        return value.toLocaleString('ru-RU', { 
            minimumFractionDigits: 0,
            maximumFractionDigits: 0 
        });
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {periodLabel}
            </Typography>
            
            <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Доходы:</Typography>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                        +{formatCurrency(stats.totalIncome)} ₽
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Расходы:</Typography>
                    <Typography variant="body2" fontWeight="bold" color="error.main">
                        -{formatCurrency(stats.totalExpense)} ₽
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Баланс:</Typography>
                    <Typography 
                        variant="body2" 
                        fontWeight="bold" 
                        color={stats.balance >= 0 ? 'success.main' : 'error.main'}
                    >
                        {stats.balance >= 0 ? '+' : ''}{formatCurrency(stats.balance)} ₽
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Транзакций:</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {stats.transactionCount}
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    );
};

export default MiniDashboardCard;
