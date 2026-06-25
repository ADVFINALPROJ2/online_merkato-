export interface Category {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  parent: { id: string; name: string } | null;
  children: Category[];
  _count: { products: number; children: number };
  createdAt: string;
  updatedAt: string;
}

export interface CategoryTreeNode {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  children: CategoryTreeNode[];
  _count: { products: number; children: number };
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  parentId?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  parentId?: string | null;
}
