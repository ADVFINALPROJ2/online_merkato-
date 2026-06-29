'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { PageHeader } from '@/components/page-header';
import { Breadcrumb } from '@/components/breadcrumb';
import { Button } from '@/components/ui/button';
import { CategoryTree } from '@/components/category-tree';
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useCategoryTree, useDeleteCategory } from '@/hooks/use-category';
import type { CategoryTreeNode } from '@/types/category';

export default function CategoriesPage() {
  const { data: tree, isLoading } = useCategoryTree();
  const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategory();
  const [deleteTarget, setDeleteTarget] = useState<CategoryTreeNode | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget.id);
      toast.success('Category deleted successfully');
      setDeleteTarget(null);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Failed to delete category');
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-[calc(100vh-16rem)]" />;
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Categories' }]} />
      <div className="flex items-center justify-between mb-8">
        <PageHeader
          title="Categories"
          description="Organize your products with categories and subcategories."
          className="mb-0"
        />
        <Link href="/categories/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </Link>
      </div>

      <CategoryTree nodes={tree || []} onDelete={setDeleteTarget} />

      <DeleteConfirmationModal
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
