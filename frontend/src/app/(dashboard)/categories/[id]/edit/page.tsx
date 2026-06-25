'use client';

import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { PageHeader } from '@/components/page-header';
import { Breadcrumb } from '@/components/breadcrumb';
import { CategoryForm } from '@/components/category-form';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Card, CardContent } from '@/components/ui/card';
import { useCategory, useUpdateCategory } from '@/hooks/use-category';

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: category, isLoading, isError } = useCategory(id);
  const { mutateAsync: updateCategory, isPending } = useUpdateCategory(id);

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      await updateCategory(data as unknown as Parameters<typeof updateCategory>[0]);
      toast.success('Category updated successfully');
      router.push('/categories');
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Failed to update category');
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-[calc(100vh-16rem)]" />;
  }

  if (isError || !category) {
    return (
      <div>
        <PageHeader title="Edit Category" />
        <Card>
          <CardContent className="py-16 text-center text-stone-500">
            Category not found.{' '}
            <a href="/categories" className="text-amber-600 hover:underline font-medium">
              Back to categories
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Categories', href: '/categories' }, { label: 'Edit Category' }]} />
      <PageHeader
        title="Edit Category"
        description="Update category information."
      />
      <CategoryForm
        category={category}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
      />
    </div>
  );
}
