import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Transaction } from '../types';
import { transactionApi } from '../services/api';

interface TransactionListProps {
    refreshKey: number;
    onNotify?: (msg: string, type: any) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ refreshKey, onNotify }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Используем getWithFilters с пустыми фильтрами для получения последних транзакций
                const response = await transactionApi.getWithFilters({}, 0, 10);
                setTransactions(response.data.content);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [refreshKey]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Удалить эту транзакцию?')) {
            try {
                await transactionApi.delete(id);
                if (onNotify) onNotify('Транзакция удалена', 'success');
                // Обновляем список через refreshKey
            } catch (error) {
                console.error('Error deleting transaction:', error);
                if (onNotify) onNotify('Ошибка при удалении', 'error');
            }
        }
    };

    const formatAmount = (amount: number | { value?: number } | undefined): number => {
        if (typeof amount === 'number') return amount;
        if (amount && typeof amount === 'object' && 'value' in amount) return amount.value || 0;
        return 0;
    };

    if (loading) return <Typography variant="body2" color="text.secondary">Загрузка...</Typography>;

    if (transactions.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                Транзакций нет
            </Typography>
        );
    }

    return (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Дата</TableCell>
                        <TableCell>Тип</TableCell>
                        <TableCell>Категория</TableCell>
                        <TableCell>Описание</TableCell>
                        <TableCell align="right">Сумма</TableCell>
                        <TableCell align="center">Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((transaction) => {
                        const isIncome = transaction.type === 'INCOME';
                        const color = isIncome ? 'green' : 'red';
                        const sign = isIncome ? '+' : '-';
                        const amount = formatAmount(transaction.amount);

                        return (
                            <TableRow key={transaction.id}>
                                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Typography color={color} fontWeight="bold">
                                        {isIncome ? 'Доход' : 'Расход'}
                                    </Typography>
                                </TableCell>
                                <TableCell>{transaction.categoryName || `ID: ${transaction.categoryId}`}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell align="right">
                                    <Typography color={color} fontWeight="bold">
                                        {sign}{amount.toLocaleString('ru-RU')}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" size="small"><EditIcon /></IconButton>
                                    <IconButton
                                        color="error"
                                        size="small"
                                        onClick={() => transaction.id && handleDelete(transaction.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TransactionList;