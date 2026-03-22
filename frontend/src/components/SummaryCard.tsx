import React from 'react';
import { Paper, Grid, Typography, Box, Divider } from '@mui/material';

interface SummaryCardProps {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount?: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ 
    totalIncome, 
    totalExpense, 
    balance,
    transactionCount 
}) => {
    const isPositive = balance >= 0;

    return (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
            <Grid container spacing={3} alignItems="center">
                <Grid size={{ xs: 12, md: 4 }}>
                    <Box textAlign={{ xs: 'left', md: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            ДОХОДЫ
                        </Typography>
                        <Typography variant="h6" color="success.main" fontWeight="bold">
                            +{totalIncome.toLocaleString('ru-RU')} ₽
                        </Typography>
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Box textAlign={{ xs: 'left', md: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            РАСХОДЫ
                        </Typography>
                        <Typography variant="h6" color="error.main" fontWeight="bold">
                            -{totalExpense.toLocaleString('ru-RU')} ₽
                        </Typography>
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Box textAlign={{ xs: 'left', md: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            ОСТАТОК
                        </Typography>
                        <Typography
                            variant="h5"
                            color={isPositive ? 'success.main' : 'error.main'}
                            fontWeight="bold"
                        >
                            {isPositive ? '+' : '-'}{Math.abs(balance).toLocaleString('ru-RU')} ₽
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            {transactionCount !== undefined && (
                <>
                    <Divider sx={{ my: 1 }} />

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                            Всего транзакций
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                            {transactionCount}
                        </Typography>
                    </Box>
                </>
            )}
        </Paper>
    );
};

export default SummaryCard;