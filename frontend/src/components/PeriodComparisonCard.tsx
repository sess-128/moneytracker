import React from 'react';
import { Paper, Typography, Box, Grid, SxProps, Theme } from '@mui/material';
import { PeriodComparison } from '../types';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RemoveIcon from '@mui/icons-material/Remove';

interface PeriodComparisonCardProps {
    comparison: PeriodComparison;
    title?: string;
    sx?: SxProps<Theme>;
}

const ChangeIndicator: React.FC<{ value: number; inverse?: boolean }> = ({ value, inverse = false }) => {
    const isPositive = value > 0;
    const isNegative = value < 0;
    const shouldInverse = inverse; // Для расходов: рост = плохо, снижение = хорошо

    let iconColor: 'success' | 'error' = 'success';
    let Icon = RemoveIcon;

    if (isPositive) {
        Icon = shouldInverse ? TrendingDownIcon : TrendingUpIcon;
        iconColor = shouldInverse ? 'error' : 'success';
    } else if (isNegative) {
        Icon = shouldInverse ? TrendingUpIcon : TrendingDownIcon;
        iconColor = shouldInverse ? 'success' : 'error';
    }

    const absValue = Math.abs(value);
    const sign = value > 0 ? '+' : '';

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Icon fontSize="small" sx={{ color: iconColor === 'success' ? 'success.main' : 'error.main' }} />
            <Typography 
                variant="caption" 
                fontWeight="bold" 
                color={iconColor}
            >
                {sign}{absValue.toFixed(1)}%
            </Typography>
        </Box>
    );
};

const StatCard: React.FC<{
    title: string;
    current: number;
    previous: number;
    changePercent: number;
    formatAsCurrency?: boolean;
    inverse?: boolean;
}> = ({ title, current, previous, changePercent, formatAsCurrency = true, inverse = false }) => {
    const format = (value: number) => {
        if (formatAsCurrency) {
            return value.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        return value.toString();
    };

    return (
        <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
            <Typography variant="caption" color="text.secondary" display="block">
                {title}
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ mt: 0.5 }}>
                {format(current)}{formatAsCurrency ? ' ₽' : ''}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 1 }}>
                <ChangeIndicator value={changePercent} inverse={inverse} />
                <Typography variant="caption" color="text.secondary">
                    к пред. периоду
                </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                Было: {format(previous)}{formatAsCurrency ? ' ₽' : ''}
            </Typography>
        </Paper>
    );
};

const PeriodComparisonCard: React.FC<PeriodComparisonCardProps> = ({ comparison, title = 'Сравнение периодов', sx }) => {
    const { currentPeriod, previousPeriod, expenseChangePercent, incomeChangePercent, balanceChangePercent } = comparison;

    return (
        <Paper sx={{ p: 2, ...sx }}>
            <Typography variant="h6" gutterBottom>{title}</Typography>
            
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <StatCard
                        title="Расходы"
                        current={currentPeriod.totalExpense}
                        previous={previousPeriod.totalExpense}
                        changePercent={expenseChangePercent}
                        inverse // Для расходов: снижение = хорошо
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <StatCard
                        title="Доходы"
                        current={currentPeriod.totalIncome}
                        previous={previousPeriod.totalIncome}
                        changePercent={incomeChangePercent}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <StatCard
                        title="Баланс"
                        current={currentPeriod.balance}
                        previous={previousPeriod.balance}
                        changePercent={balanceChangePercent}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};

export default PeriodComparisonCard;
