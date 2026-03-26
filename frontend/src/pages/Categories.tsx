import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, MenuItem, Alert, Snackbar, Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Category } from '../types';
import { categoryApi } from '../services/api';


const Categories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);

    // Состояние для диалога
    const [openDialog, setOpenDialog] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // Форма
    const [formData, setFormData] = useState({
        name: '',
        parentId: '' as string | null,
        type: 'EXPENSE' as 'EXPENSE' | 'INCOME'
    });

    // Уведомления
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });

    // Загрузка категорий
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryApi.getAll();
                setCategories(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCategories();
    }, [refreshKey]);

    // Открытие диалога (Создание или Редактирование)
    const handleOpenDialog = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                parentId: category.parentId ? String(category.parentId) : '',
                type: category.type || 'EXPENSE'
            });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', parentId: '', type: 'EXPENSE' });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingCategory(null);
    };

    // Сохранение (Create or Update)
    const handleSave = async () => {
        if (!formData.name.trim()) {
            setSnackbar({ open: true, message: 'Введите имя категории', severity: 'error' });
            return;
        }

        try {
            const payload = {
                name: formData.name,
                parentId: formData.parentId ? Number(formData.parentId) : null,
                type: formData.type
            };

            if (editingCategory) {
                await categoryApi.update(editingCategory.id!, payload);
                setSnackbar({ open: true, message: 'Категория обновлена', severity: 'success' });
            } else {
                await categoryApi.create(payload);
                setSnackbar({ open: true, message: 'Категория создана', severity: 'success' });
            }

            handleCloseDialog();
            setRefreshKey(prev => prev + 1);
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Ошибка при сохранении',
                severity: 'error'
            });
        }
    };

    // Удаление
    const handleDelete = async (id: number) => {
        if (!window.confirm('Удалить категорию? Если есть подкатегории или транзакции - будет ошибка.')) return;

        try {
            await categoryApi.delete(id);
            setSnackbar({ open: true, message: 'Категория удалена', severity: 'success' });
            setRefreshKey(prev => prev + 1);
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Не удалось удалить',
                severity: 'error'
            });
        }
    };

    // Фильтруем корни для селекта родителей (нельзя выбрать себя же родителем при редактировании)
    const parentOptions = categories.filter(c => !editingCategory || c.id !== editingCategory.id);

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Paper sx={{ p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5">Управление категориями</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
                        Добавить
                    </Button>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Имя</TableCell>
                                <TableCell>Тип</TableCell>
                                <TableCell>Родитель</TableCell>
                                <TableCell align="right">Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map((cat) => (
                                <TableRow key={cat.id}>
                                    <TableCell>{cat.id}</TableCell>
                                    <TableCell>{cat.name}</TableCell>
                                    <TableCell>{cat.type}</TableCell>
                                    <TableCell>
                                        {cat.parentId
                                            ? categories.find(c => c.id === cat.parentId)?.name || cat.parentId
                                            : '-'}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" size="small" onClick={() => handleOpenDialog(cat)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" size="small" onClick={() => handleDelete(cat.id!)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Диалог Создания/Редактирования */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingCategory ? 'Редактировать категорию' : 'Новая категория'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Имя категории"
                        fullWidth
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <TextField
                        select
                        margin="dense"
                        label="Тип"
                        fullWidth
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    >
                        <MenuItem value="EXPENSE">Расход</MenuItem>
                        <MenuItem value="INCOME">Доход</MenuItem>
                    </TextField>

                    <TextField
                        select
                        margin="dense"
                        label="Родительская категория (опционально)"
                        fullWidth
                        value={formData.parentId || ''}
                        onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
                    >
                        <MenuItem value=""><em>Без родителя (Корневая)</em></MenuItem>
                        {parentOptions.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Отмена</Button>
                    <Button onClick={handleSave} variant="contained">
                        {editingCategory ? 'Сохранить' : 'Создать'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Уведомления */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Categories;
