import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Select, MenuItem, FormControl, InputLabel,
    Box, Paper, Typography, CircularProgress
} from '@mui/material';
import { Transaction, Category } from '../types';
import { transactionApi, categoryApi } from '../services/api';

interface TransactionFormProps {
    onSuccess?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSuccess }) => {
    const [formData, setFormData] = useState<Partial<Transaction>>({
        amount: 0,
        categoryId: undefined,  // ← ЧИСЛО
        description: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense'
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
        if (!formData.categoryId) {
            alert('Выберите подкатегорию!');
            return;
        }
        try {
            await transactionApi.create(formData);
            alert('Транзакция добавлена!');
            setFormData({ amount: 0, categoryId: undefined, description: '', date: new Date().toISOString().split('T')[0], type: 'expense' });
            setSelectedParentId('');
            setChildCategories([]);
            if (onSuccess) onSuccess();
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Ошибка');
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 3 }}>
            <Typography variant="h6" gutterBottom>Новая транзакция</Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Тип</InputLabel>
                    <Select name="type" value={formData.type} label="Тип" onChange={handleChange}>
                        <MenuItem value="income">Доход</MenuItem>
                        <MenuItem value="expense">Расход</MenuItem>
                    </Select>
                </FormControl>

                <TextField fullWidth margin="normal" label="Сумма" name="amount" type="number" value={formData.amount} onChange={handleChange} required />

                <FormControl fullWidth margin="normal" disabled={loadingParents}>
                    <InputLabel>Группа</InputLabel>
                    <Select value={selectedParentId} label="Группа" onChange={handleParentChange}>
                        <MenuItem value=""><em>-- Выберите группу --</em></MenuItem>
                        {parentCategories.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
                    </Select>
                    {loadingParents && <CircularProgress size={20} sx={{ position: 'absolute', right: 10, bottom: 10 }} />}
                </FormControl>

                <FormControl fullWidth margin="normal" disabled={!selectedParentId || loadingChildren}>
                    <InputLabel>Категория</InputLabel>
                    <Select name="categoryId" value={formData.categoryId || ''} label="Категория" onChange={handleChange} required>
                        <MenuItem value="">{!selectedParentId ? 'Сначала выберите группу' : '-- Выберите категорию --'}</MenuItem>
                        {childCategories.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
                    </Select>
                    {loadingChildren && <CircularProgress size={20} sx={{ position: 'absolute', right: 10, bottom: 10 }} />}
                </FormControl>

                <TextField fullWidth margin="normal" label="Описание" name="description" value={formData.description} onChange={handleChange} multiline rows={2} />
                <TextField fullWidth margin="normal" label="Дата" name="date" type="date" value={formData.date} onChange={handleChange} required InputLabelProps={{ shrink: true }} />

                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={!formData.categoryId}>
                    Добавить
                </Button>
            </Box>
        </Paper>
    );
};

export default TransactionForm;