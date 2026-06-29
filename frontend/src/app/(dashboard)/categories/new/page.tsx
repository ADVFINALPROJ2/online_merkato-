'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { PageHeader } from '@/components/page-header';
import { Breadcrumb } from '@/components/breadcrumb';
import { CategoryForm } from '@/components/category-form';
import { useCreateCategory } from '@/hooks/use-category';

export default function NewCategoryPage() {
  const router = useRouter();
  const { mutateAsync: createCategory, isPending } = useCreateCategory();

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      await createCategory(data as unknown as Parameters<typeof createCategory>[0]);
      toast.success('Category created successfully');
      router.push('/categories');
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Failed to create category');
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Categories', href: '/categories' }, { label: 'New Category' }]} />
      <PageHeader
        title="Create Category"
        description="Add a new product category."
      />
      <CategoryForm onSubmit={handleSubmit} isSubmitting={isPending} />
    </div>
  );
}
