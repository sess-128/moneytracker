import React, { useState, useEffect } from 'react';
import {
    Box, TextField, Button, FormControl, InputLabel, Select, MenuItem,
    Paper, Typography, Accordion, AccordionSummary, AccordionDetails,
    Slider, Chip, Stack, Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import CategoryTree from './CategoryTree';
import { Category, TransactionFilters } from '../types';
import { categoryApi } from '../services/api';

interface TransactionFiltersProps {
    filters: TransactionFilters;
    onFiltersChange: (filters: TransactionFilters) => void;
}

const TransactionFiltersComponent: React.FC<TransactionFiltersProps> = ({ filters, onFiltersChange }) => {
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [selectedParentIds, setSelectedParentIds] = useState<number[]>(filters.parentCategoryIds || []);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(filters.categoryIds || []);
    const [localFilters, setLocalFilters] = useState<TransactionFilters>(filters);
    const [amountRange, setAmountRange] = useState<number[]>([
        filters.minAmount || 0,
        filters.maxAmount || 250000
    ]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await categoryApi.getAll();
                setAllCategories(res.data);
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        };
        loadCategories();
    }, []);

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

    const handleAmountChange = (_event: Event, newValue: number | number[]) => {
        setAmountRange(newValue as number[]);
        setLocalFilters(prev => ({
            ...prev,
            minAmount: (newValue as number[])[0],
            maxAmount: (newValue as number[])[1]
        }));
    };

    const handleApplyFilters = () => {
        onFiltersChange({
            ...localFilters,
            parentCategoryIds: selectedParentIds,
            categoryIds: selectedCategoryIds
        });
    };

    const handleResetFilters = () => {
        const emptyFilters: TransactionFilters = {};
        setSelectedParentIds([]);
        setSelectedCategoryIds([]);
        setAmountRange([0, 10000]);
        setLocalFilters(emptyFilters);
        onFiltersChange(emptyFilters);
    };

    const activeFiltersCount =
        (selectedParentIds.length) +
        (selectedCategoryIds.length) +
        (localFilters.type ? 1 : 0) +
        (localFilters.startDate ? 1 : 0) +
        (localFilters.endDate ? 1 : 0) +
        (localFilters.description ? 1 : 0) +
        ((localFilters.minAmount && localFilters.minAmount > 0) ? 1 : 0) +
        ((localFilters.maxAmount && localFilters.maxAmount < 10000) ? 1 : 0);

    return (
        <Paper sx={{ p: 2, mb: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center">
                    <FilterListIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Фильтры</Typography>
                    {activeFiltersCount > 0 && (
                        <Chip
                            label={activeFiltersCount}
                            size="small"
                            color="primary"
                            sx={{ ml: 1 }}
                        />
                    )}
                </Box>
                <Button size="small" onClick={handleResetFilters}>
                    Сбросить всё
                </Button>
            </Box>

            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>По дате</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TextField
                        label="Дата от"
                        type="date"
                        fullWidth
                        margin="dense"
                        value={localFilters.startDate || ''}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, startDate: e.target.value }))}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Дата до"
                        type="date"
                        fullWidth
                        margin="dense"
                        value={localFilters.endDate || ''}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, endDate: e.target.value }))}
                        InputLabelProps={{ shrink: true }}
                    />
                </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>По типу</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormControl fullWidth margin="dense">
                        <Select
                            value={localFilters.type || ''}
                            onChange={(e) => setLocalFilters(prev => ({ ...prev, type: e.target.value as any || undefined }))}
                            displayEmpty
                        >
                            <MenuItem value="">Все</MenuItem>
                            <MenuItem value="INCOME">💰 Доходы</MenuItem>
                            <MenuItem value="EXPENSE">💸 Расходы</MenuItem>
                        </Select>
                    </FormControl>
                </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>По категориям</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <CategoryTree
                        categories={allCategories}
                        selectedParentIds={selectedParentIds}
                        selectedCategoryIds={selectedCategoryIds}
                        onParentToggle={handleParentToggle}
                        onCategoryToggle={handleCategoryToggle}
                    />
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>По сумме</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Slider
                        value={amountRange}
                        onChange={handleAmountChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={250000}
                        step={100}
                    />
                    <Box display="flex" justifyContent="space-between" mt={1}>
                        <TextField
                            label="От"
                            type="number"
                            size="small"
                            value={amountRange[0]}
                            onChange={(e) => setAmountRange([Number(e.target.value), amountRange[1]])}
                            sx={{ width: '45%' }}
                            InputProps={{ inputProps: { min: 0 } }}
                        />
                        <TextField
                            label="До"
                            type="number"
                            size="small"
                            value={amountRange[1]}
                            onChange={(e) => setAmountRange([amountRange[0], Number(e.target.value)])}
                            sx={{ width: '45%' }}
                            InputProps={{ inputProps: { min: 0, max: 250000 } }}
                        />
                    </Box>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Описание</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TextField
                        label="Поиск в описании"
                        fullWidth
                        margin="dense"
                        value={localFilters.description || ''}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Введите текст..."
                    />
                </AccordionDetails>
            </Accordion>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" gap={2}>
                <Button variant="contained" onClick={handleApplyFilters} fullWidth>
                    Применить
                </Button>
                <Button variant="outlined" onClick={handleResetFilters} fullWidth>
                    Сбросить
                </Button>
            </Box>
        </Paper>
    );
};

export default TransactionFiltersComponent;