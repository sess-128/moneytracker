import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Select, MenuItem, FormControl, InputLabel,
    Box, Paper, Typography, CircularProgress
} from '@mui/material';
import { Transaction, Category } from '../types';
import { transactionApi, categoryApi } from '../services/api';

interface TransactionFormProps {
    onSuccess?: () => void;
    onNotify?: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void; // <-- ДОБАВИТЬ ЭТУ СТРОКУ
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSuccess, onNotify }) => { // <-- Добавить onNotify в деструктуризацию
    const [formData, setFormData] = useState<Partial<Transaction>>({
        amount: undefined,
        categoryId: undefined,
        description: '',
        date: new Date().toISOString().split('T')[0],
        type: 'EXPENSE'
    });

    const [parentCategories, setParentCategories] = useState<Category[]>([]);
    const [childCategories, setChildCategories] = useState<Category[]>([]);
    const [selectedParentId, setSelectedParentId] = useState<number | ''>('');
    const [loadingParents, setLoadingParents] = useState(false);
    const [loadingChildren, setLoadingChildren] = useState(false);

    useEffect(() => {
        const loadParents = async () => {
            setLoadingParents(true);
            try {
                const res = await categoryApi.getRoot();
                setParentCategories(res.data);
            } catch (e) { console.error(e); }
            finally { setLoadingParents(false); }
        };
        loadParents();
    }, []);

    useEffect(() => {
        const loadChildren = async () => {
            if (!selectedParentId) {
                setChildCategories([]);
                setFormData(prev => ({ ...prev, categoryId: undefined }));
                return;
            }
            setLoadingChildren(true);
            try {
                const res = await categoryApi.getByParent(Number(selectedParentId));
                setChildCategories(res.data);
                setFormData(prev => ({ ...prev, categoryId: undefined }));
            } catch (e) { console.error(e); }
            finally { setLoadingChildren(false); }
        };
        loadChildren();
    }, [selectedParentId]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleParentChange = (e: any) => {
        setSelectedParentId(e.target.value === '' ? '' : Number(e.target.value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.categoryId || !formData.amount) {
            // ЗАМЕНИТЬ alert НА onNotify
            if (onNotify) {
                onNotify('Заполните сумму и выберите категорию!', 'warning');
            } else {
                alert('Заполните сумму и выберите категорию!');
            }
            return;
        }

        try {
            await transactionApi.create(formData);

            // ЗАМЕНИТЬ alert НА onNotify
            if (onNotify) {
                onNotify('Транзакция успешно добавлена!', 'success');
            } else {
                alert('Транзакция добавлена!');
            }

            // Сброс формы
            setFormData({
                amount: undefined,
                categoryId: undefined,
                description: '',
                date: new Date().toISOString().split('T')[0],
                type: formData.type
            });

            setSelectedParentId('');
            setChildCategories([]);

            if (onSuccess) onSuccess();
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || 'Ошибка при добавлении транзакции';
            // ЗАМЕНИТЬ alert НА onNotify
            if (onNotify) {
                onNotify(msg, 'error');
            } else {
                alert(msg);
            }
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 3 }}>
            <Typography variant="h6" gutterBottom>Новая транзакция</Typography>
            <Box component="form" onSubmit={handleSubmit}>

                {/* Тип операции */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Тип</InputLabel>
                    <Select
                        name="type"
                        value={formData.type}
                        label="Тип"
                        onChange={handleChange}
                    >
                        <MenuItem value="EXPENSE">Расход</MenuItem>
                        <MenuItem value="INCOME">Доход</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    fullWidth margin="normal" label="Сумма" name="amount" type="number"
                    value={formData.amount || ''} onChange={handleChange}
                    placeholder="0" required
                />

                <FormControl fullWidth margin="normal" disabled={loadingParents}>
                    <InputLabel>Группа</InputLabel>
                    <Select value={selectedParentId} label="Группа" onChange={handleParentChange}>
                        <MenuItem value=""><em>-- Выберите группу --</em></MenuItem>
                        {parentCategories.map(cat => (
                            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                        ))}
                    </Select>
                    {loadingParents && <CircularProgress size={20} sx={{ position: 'absolute', right: 10, bottom: 10 }} />}
                </FormControl>

                <FormControl fullWidth margin="normal" disabled={!selectedParentId || loadingChildren}>
                    <InputLabel>Категория</InputLabel>
                    <Select
                        name="categoryId"
                        value={formData.categoryId || ''}
                        label="Категория"
                        onChange={handleChange}
                        required
                    >
                        <MenuItem value="">
                            {!selectedParentId ? 'Сначала выберите группу' : '-- Выберите категорию --'}
                        </MenuItem>
                        {childCategories.map(cat => (
                            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                        ))}
                    </Select>
                    {loadingChildren && <CircularProgress size={20} sx={{ position: 'absolute', right: 10, bottom: 10 }} />}
                </FormControl>

                <TextField
                    fullWidth margin="normal" label="Описание" name="description"
                    value={formData.description} onChange={handleChange} multiline rows={2}
                />

                <TextField
                    fullWidth margin="normal" label="Дата" name="date" type="date"
                    value={formData.date} onChange={handleChange} required
                    InputLabelProps={{ shrink: true }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={!formData.categoryId || !formData.amount}
                >
                    Добавить
                </Button>
            </Box>
        </Paper>
    );
};

export default TransactionForm;