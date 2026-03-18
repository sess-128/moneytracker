import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Transaction } from '../types';
import { transactionApi } from '../services/api';

const TransactionList: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await transactionApi.getAll();
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Удалить эту транзакцию?')) {
            try {
                await transactionApi.delete(id);
                fetchTransactions();
            } catch (error) {
                console.error('Error deleting transaction:', error);
            }
        }
    };

    if (loading) return <Typography>Загрузка...</Typography>;

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
                    {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Typography color={transaction.type === 'income' ? 'green' : 'red'}>
                                    {transaction.type === 'income' ? 'Доход' : 'Расход'}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                {transaction.categoryName || `ID: ${transaction.categoryId}`}
                            </TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell align="right">
                                <Typography color={transaction.type === 'income' ? 'green' : 'red'}>
                                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <IconButton color="primary" size="small">
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    size="small"
                                    onClick={() => transaction.id && handleDelete(transaction.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TransactionList;