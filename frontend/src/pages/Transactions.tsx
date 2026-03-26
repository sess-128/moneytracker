import React, { useState, useEffect, useCallback } from 'react';
import { 
    Container, Paper, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, TablePagination,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FiltersBar from '../components/FiltersBar';
import { Transaction, TransactionFilters } from '../types';
import { transactionApi } from '../services/api';

const Transactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<TransactionFilters>({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(40);
    const [totalElements, setTotalElements] = useState(0);

    // Состояние для диалога редактирования
    const [openDialog, setOpenDialog] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [editFormData, setEditFormData] = useState({
        amount: '',
        date: ''
    });

    // Функция для получения числового значения из amount
    const getAmountValue = (amount: number | { value?: number } | undefined): number => {
        if (typeof amount === 'number') return amount;
        if (amount && typeof amount === 'object' && 'value' in amount) return amount.value || 0;
        return 0;
    };

    const loadTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const response = await transactionApi.getWithFilters(filters, page, rowsPerPage);
            const txs: Transaction[] = response.data.content;
            setTransactions(txs);
            setTotalElements(response.data.totalElements);
        } catch (error) {
            console.error('Error loading transactions:', error);
        } finally {
            setLoading(false);
        }
    }, [filters, page, rowsPerPage]);

    useEffect(() => {
        loadTransactions();
    }, [loadTransactions]);

    const handleFiltersChange = (newFilters: TransactionFilters) => {
        setFilters(newFilters);
        setPage(0);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Удалить эту транзакцию?')) {
            try {
                await transactionApi.delete(id);
                loadTransactions();
            } catch (error) {
                console.error('Error deleting transaction:', error);
            }
        }
    };

    // Открытие диалога редактирования
    const handleOpenEditDialog = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setEditFormData({
            amount: getAmountValue(transaction.amount).toString(),
            date: transaction.date
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingTransaction(null);
    };

    // Сохранение изменений
    const handleSaveEdit = async () => {
        if (!editingTransaction || !editFormData.amount || !editFormData.date) {
            return;
        }

        try {
            const payload = {
                amount: parseFloat(editFormData.amount),
                date: editFormData.date,
                categoryId: editingTransaction.categoryId,
                description: editingTransaction.description,
                type: editingTransaction.type
            };

            await transactionApi.update(editingTransaction.id!, payload);
            handleCloseDialog();
            loadTransactions();
        } catch (error) {
            console.error('Error updating transaction:', error);
        }
    };

    const formatAmount = (amount: number | { value?: number } | undefined): number => {
        return getAmountValue(amount);
    };

    if (loading) return <Typography>Загрузка...</Typography>;

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Транзакции
            </Typography>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                    Управление транзакциями: фильтрация, просмотр, редактирование и удаление записей.
                    Для анализа расходов используйте страницу <strong>«Аналитика»</strong>.
                </Typography>

                {/* Горизонтальная строка фильтров */}
                <FiltersBar
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                />
            </Paper>

            {/* Таблица */}
            <Paper sx={{ p: 2 }}>
                <TableContainer>
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
                                            <IconButton 
                                                color="primary" 
                                                size="small"
                                                onClick={() => transaction.id && handleOpenEditDialog(transaction)}
                                            >
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
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[20, 40, 100]}
                    component="div"
                    count={totalElements}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    labelRowsPerPage="Строк на странице:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
                />
            </Paper>

            {/* Диалог редактирования транзакции */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Редактировать транзакцию</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Сумма"
                        type="number"
                        fullWidth
                        value={editFormData.amount}
                        onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Дата"
                        type="date"
                        fullWidth
                        value={editFormData.date}
                        onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Отмена</Button>
                    <Button onClick={handleSaveEdit} variant="contained">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Transactions;
