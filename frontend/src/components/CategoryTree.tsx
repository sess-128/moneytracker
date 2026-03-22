import React, { useState, useEffect } from 'react';
import {
    Box, Checkbox, FormControlLabel, Collapse, ListItemButton,
    Typography, Chip, Stack, IconButton, Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Category } from '../types';

interface CategoryTreeProps {
    categories: Category[];
    selectedParentIds: number[];
    selectedCategoryIds: number[];
    onParentToggle: (parentId: number) => void;
    onCategoryToggle: (categoryId: number) => void;
}

interface TreeNode {
    category: Category;
    children: TreeNode[];
}

const CategoryTree: React.FC<CategoryTreeProps> = ({
                                                       categories,
                                                       selectedParentIds,
                                                       selectedCategoryIds,
                                                       onParentToggle,
                                                       onCategoryToggle
                                                   }) => {
    const [expandedParents, setExpandedParents] = useState<Set<number>>(new Set());
    const [tree, setTree] = useState<TreeNode[]>([]);

    useEffect(() => {
        const buildTree = (): TreeNode[] => {
            const map = new Map<number, TreeNode>();
            const roots: TreeNode[] = [];

            categories.forEach(cat => {
                map.set(cat.id, { category: cat, children: [] });
            });

            categories.forEach(cat => {
                const node = map.get(cat.id)!;
                if (cat.parentId && map.has(cat.parentId)) {
                    map.get(cat.parentId)!.children.push(node);
                } else {
                    roots.push(node);
                }
            });

            return roots;
        };

        setTree(buildTree());
    }, [categories]);

    const toggleExpand = (parentId: number) => {
        setExpandedParents(prev => {
            const newSet = new Set(prev);
            if (newSet.has(parentId)) {
                newSet.delete(parentId);
            } else {
                newSet.add(parentId);
            }
            return newSet;
        });
    };

    const getSelectedChildrenCount = (children: TreeNode[]): number => {
        return children.filter(child =>
            selectedCategoryIds.includes(child.category.id) ||
            selectedParentIds.includes(child.category.id)
        ).length;
    };

    const renderTreeNode = (node: TreeNode, level: number = 0) => {
        const hasChildren = node.children.length > 0;
        const isExpanded = expandedParents.has(node.category.id);
        const isParentSelected = selectedParentIds.includes(node.category.id);
        const isCategorySelected = selectedCategoryIds.includes(node.category.id);
        const selectedChildrenCount = getSelectedChildrenCount(node.children);
        const isPartiallySelected = !isParentSelected && selectedChildrenCount > 0 && selectedChildrenCount < node.children.length;
        const isAllChildrenSelected = !isParentSelected && selectedChildrenCount === node.children.length && node.children.length > 0;

        return (
            <Box key={node.category.id} sx={{ ml: level * 2 }}>
                <ListItemButton dense sx={{ pl: 1 }}>
                    {hasChildren && (
                        <IconButton size="small" onClick={() => toggleExpand(node.category.id)}>
                            {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    )}
                    {!hasChildren && <Box sx={{ width: 28 }} />}

                    {/* Главное исправление здесь */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={hasChildren ? (isParentSelected || isAllChildrenSelected) : isCategorySelected}
                                indeterminate={hasChildren ? isPartiallySelected : false}
                                onChange={() => {
                                    if (hasChildren) {
                                        onParentToggle(node.category.id);
                                    } else {
                                        onCategoryToggle(node.category.id);
                                    }
                                }}
                                size="small"
                            />
                        }
                        label={
                            <Box>
                                <Typography variant="body2" fontWeight={isParentSelected || isCategorySelected ? 'bold' : 'normal'}>
                                    {node.category.name}
                                    {hasChildren && ` (${node.children.length})`}
                                </Typography>
                                {hasChildren && selectedChildrenCount > 0 && !isParentSelected && (
                                    <Typography variant="caption" color="text.secondary">
                                        Выбрано: {selectedChildrenCount} из {node.children.length}
                                    </Typography>
                                )}
                            </Box>
                        }
                    />
                </ListItemButton>

                {hasChildren && (
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ pl: 2 }}>
                            {node.children.map(child => renderTreeNode(child, level + 1))}
                        </Box>
                    </Collapse>
                )}
            </Box>
        );
    };

    const selectedCategoriesList = categories.filter(c => selectedCategoryIds.includes(c.id));
    const selectedParentsList = categories.filter(c => selectedParentIds.includes(c.id));

    return (
        <Box>
            {}
            <Paper variant="outlined" sx={{ p: 1, maxHeight: 400, overflow: 'auto' }}>
                {tree.map(node => renderTreeNode(node))}
            </Paper>

            {(selectedParentsList.length > 0 || selectedCategoriesList.length > 0) && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Выбранные категории:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {selectedParentsList.map(parent => (
                            <Chip
                                key={parent.id}
                                label={`${parent.name} (все подкатегории)`}
                                onDelete={() => onParentToggle(parent.id)}
                                color="primary"
                                size="small"
                            />
                        ))}
                        {selectedCategoriesList.map(cat => (
                            <Chip
                                key={cat.id}
                                label={cat.name}
                                onDelete={() => onCategoryToggle(cat.id)}
                                color="secondary"
                                size="small"
                                variant="outlined"
                            />
                        ))}
                    </Stack>
                </Box>
            )}
        </Box>
    );
};

export default CategoryTree;