export interface CategoryResponse {
    id: number;
    name: string;
    parentId: number | null;
    hasChildren: boolean;
}