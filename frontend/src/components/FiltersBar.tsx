import React, { useState, useEffect } from 'react';
import {
    Box, TextField, FormControl, InputLabel, Select, MenuItem,
    Button, Chip, Stack, Popover, Paper, Typography
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { Category, TransactionFilters } from '../types';
import { categoryApi } from '../services/api';
import CategoryTree from './CategoryTree';

interface FiltersBarProps {
    filters: TransactionFilters;
    onFiltersChange: (filters: TransactionFilters) => void;
}

const FiltersBar: React.FC<FiltersBarProps> = ({ filters, onFiltersChange }) => {
    const [localFilters, setLocalFilters] = useState<TransactionFilters>(filters);
    const [categories, setCategories] = useState<Category[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    // Состояния для множественного выбора категорий
    const [selectedParentIds, setSelectedParentIds] = useState<number[]>([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await categoryApi.getAll();
                setCategories(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        loadCategories();
    }, []);

    // Инициализация выбранных категорий из filters
    useEffect(() => {
        if (filters.categoryIds) {
            setSelectedCategoryIds(filters.categoryIds);
        }
        if (filters.parentCategoryIds) {
            setSelectedParentIds(filters.parentCategoryIds);
        }
    }, [filters.categoryIds, filters.parentCategoryIds]);

    const handleApply = () => {
        // Применяем выбранные категории к фильтрам
        const updatedFilters = {
            ...localFilters,
            categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
            parentCategoryIds: selectedParentIds.length > 0 ? selectedParentIds : undefined
        };
        onFiltersChange(updatedFilters);
        setAnchorEl(null);
    };

    const handleReset = () => {
        const emptyFilters: TransactionFilters = {};
        setLocalFilters(emptyFilters);
        setSelectedParentIds([]);
        setSelectedCategoryIds([]);
        onFiltersChange(emptyFilters);
        setAnchorEl(null);
    };

    const handleParentToggle = (parentId: number) => {
        setSelectedParentIds(prev =>
            prev.includes(parentId)
                ? prev.filter(id => id !== parentId)
                : [...prev, parentId]
        );
    };

    const handleCategoryToggle = (categoryId: number) => {
        setSelectedCategoryIds(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const activeFiltersCount = [
        localFilters.startDate,
        localFilters.endDate,
        localFilters.type,
        selectedCategoryIds.length > 0 || selectedParentIds.length > 0,
        localFilters.minAmount,
        localFilters.maxAmount,
        localFilters.description
    ].filter(Boolean).length;

    const selectedCount = selectedCategoryIds.length + selectedParentIds.length;

    return (
        <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                {/* Дата */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        label="С"
                        type="date"
                        size="small"
                        value={localFilters.startDate || ''}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, startDate: e.target.value }))}
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 130 }}
                    />
                    <TextField
                        label="По"
                        type="date"
                        size="small"
                        value={localFilters.endDate || ''}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, endDate: e.target.value }))}
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 130 }}
                    />
                </Box>

                {/* Тип */}
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Тип</InputLabel>
                    <Select
                        value={localFilters.type || ''}
                        label="Тип"
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, type: e.target.value as any || undefined }))}
                    >
                        <MenuItem value="">Все</MenuItem>
                        <MenuItem value="INCOME">Доходы</MenuItem>
                        <MenuItem value="EXPENSE">Расходы</MenuItem>
                    </Select>
                </FormControl>

                {/* Категории (кнопка с popover) */}
                <Button
                    variant={selectedCount > 0 ? 'contained' : 'outlined'}
                    size="small"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    startIcon={<FilterListIcon />}
                    sx={{ minWidth: 150, justifyContent: 'flex-start' }}
                >
                    {selectedCount > 0
                        ? `Выбрано: ${selectedCount}`
                        : 'Все категории'}
                </Button>

                {/* Popover с CategoryTree */}
                <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <Paper sx={{ p: 2, width: 400, maxWidth: '90vw' }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Выберите категории:
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                            • Родительская категория = все подкатегории<br />
                            • Дочерняя = конкретная категория
                        </Typography>

                        <CategoryTree
                            categories={categories}
                            selectedParentIds={selectedParentIds}
                            selectedCategoryIds={selectedCategoryIds}
                            onParentToggle={handleParentToggle}
                            onCategoryToggle={handleCategoryToggle}
                        />

                        <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button
                                size="small"
                                onClick={() => {
                                    setSelectedParentIds([]);
                                    setSelectedCategoryIds([]);
                                }}
                            >
                                Очистить выбор
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                onClick={handleApply}
                            >
                                Применить
                            </Button>
                        </Box>
                    </Paper>
                </Popover>

                {/* Сумма */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        label="Сумма от"
                        type="number"
                        size="small"
                        placeholder="0"
                        value={localFilters.minAmount || ''}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, minAmount: e.target.value ? Number(e.target.value) : undefined }))}
                        sx={{ width: 110 }}
                    />
                    <TextField
                        label="до"
                        type="number"
                        size="small"
                        placeholder="250000"
                        value={localFilters.maxAmount || ''}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, maxAmount: e.target.value ? Number(e.target.value) : undefined }))}
                        sx={{ width: 110 }}
                    />
                </Box>

                {/* Поиск */}
                <TextField
                    label="Поиск"
                    size="small"
                    placeholder="Описание..."
                    value={localFilters.description || ''}
                    onChange={(e) => setLocalFilters(prev => ({ ...prev, description: e.target.value || undefined }))}
                    sx={{ minWidth: 180 }}
                />

                {/* Кнопка сброса */}
                <Button
                    variant="outlined"
                    size="small"
                    onClick={handleReset}
                    startIcon={<ClearIcon />}
                >
                    Сбросить
                </Button>

                {/* Индикатор активных фильтров */}
                {activeFiltersCount > 0 && (
                    <Chip
                        label={`Активно: ${activeFiltersCount}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                )}
            </Stack>
        </Box>
    );
};

export default FiltersBar;