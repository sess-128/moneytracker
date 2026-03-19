import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Box, Paper, Typography, CircularProgress, Autocomplete
} from '@mui/material';
import { Transaction, Category } from '../types';
import { transactionApi, categoryApi } from '../services/api';

interface TransactionFormProps {
    onSuccess?: () => void;
    onNotify?: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSuccess, onNotify }) => {
    const [formData, setFormData] = useState<Partial<Transaction>>({
        amount: undefined,
        categoryId: undefined,
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    useEffect(() => {
        const loadCategories = async () => {
            setLoadingCategories(true);
            try {
                // Используем новый метод getAll
                const res = await categoryApi.getAll();
                // Убираем дубликаты по ID
                const uniqueCategories = Array.from(
                    new Map(res.data.map(cat => [cat.id, cat])).values()
                );
                setAllCategories(uniqueCategories);
            } catch (e) {
                console.error(e);
                if(onNotify) onNotify('Ошибка загрузки категорий', 'error');
            } finally {
                setLoadingCategories(false);
            }
        };
        loadCategories();
    }, []);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.categoryId || !formData.amount || !selectedCategory) {
            if (onNotify) onNotify('Заполните сумму и выберите категорию!', 'warning');
            return;
        }

        try {
            await transactionApi.create(formData);

            if (onNotify) {
                // ПРОВЕРКА: Строго верхний регистр
                const typeRu = selectedCategory.type === 'INCOME' ? 'Доход' : 'Расход';
                onNotify(`Транзакция (${typeRu}) успешно добавлена!`, 'success');
            }

            setFormData({
                amount: undefined,
                categoryId: undefined,
                description: '',
                date: new Date().toISOString().split('T')[0]
            });
            setSelectedCategory(null);

            if (onSuccess) onSuccess();
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || 'Ошибка при добавлении';
            if (onNotify) onNotify(msg, 'error');
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 3 }}>
            <Typography variant="h6" gutterBottom>Новая транзакция</Typography>

            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth margin="normal" label="Сумма" name="amount" type="number"
                    value={formData.amount || ''} onChange={handleChange}
                    placeholder="0" required
                />

                <Box sx={{ mt: 2, mb: 1 }}>
                    <Autocomplete
                        fullWidth
                        options={allCategories}
                        loading={loadingCategories}
                        value={selectedCategory}
                        onChange={(event, newValue) => {
                            setSelectedCategory(newValue);
                            setFormData(prev => ({
                                ...prev,
                                categoryId: newValue ? newValue.id : undefined
                            }));
                        }}
                        getOptionKey={(option) => `cat-${option.id}`}
                        getOptionLabel={(option) => option.name}
                        renderOption={(props, option) => {
                            // ПРОВЕРКА: Строго верхний регистр
                            const isIncome = option.type?.toUpperCase() === 'INCOME';
                            const color = isIncome ? 'green' : 'red';
                            const typeText = isIncome ? 'Доход' : 'Расход';

                            const parentName = option.parentId
                                ? allCategories.find(c => c.id === option.parentId)?.name
                                : '';

                            return (
                                <Box component="li" {...props} key={`list-item-${option.id}`}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="body1">{option.name}</Typography>
                                        <Typography variant="caption" color={color} fontWeight="bold">
                                            {typeText} {parentName ? `• Родитель: ${parentName}` : ''}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Категория (поиск)"
                                placeholder="Начните вводить название..."
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loadingCategories ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                                required
                            />
                        )}
                        filterOptions={(options, state) => {
                            return options.filter((option) =>
                                option.name.toLowerCase().includes(state.inputValue.toLowerCase())
                            );
                        }}
                    />
                </Box>

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
                    sx={{ mt: 3 }}
                    disabled={!formData.categoryId || !formData.amount}
                >
                    Добавить
                </Button>
            </Box>
        </Paper>
    );
};

export default TransactionForm;