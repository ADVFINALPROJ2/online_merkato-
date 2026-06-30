'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FolderTree, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useCategories } from '@/hooks/use-category';
import type { Category } from '@/types/category';

const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name is too long'),
  description: z
    .string()
    .max(500, 'Description is too long')
    .optional()
    .or(z.literal('')),
  parentId: z.string().optional().or(z.literal('')),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isSubmitting: boolean;
}

export function CategoryForm({ category, onSubmit, isSubmitting }: CategoryFormProps) {
  const { data: allCategories, isLoading: catLoading, isError: catError } = useCategories();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      parentId: category?.parentId || '',
    },
  });

  const availableParents = category
    ? allCategories?.filter((c) => c.id !== category.id)
    : allCategories;

  const selectedParentId = watch('parentId');

  const handleFormSubmit = async (values: CategoryFormValues) => {
    const payload: Record<string, unknown> = {
      name: values.name,
    };
    if (values.description) payload.description = values.description;
    if (values.parentId) {
      payload.parentId = values.parentId;
    } else if (category?.parentId) {
      payload.parentId = null;
    }
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Category Name" error={errors.name?.message}>
              <Input
                placeholder="e.g. Electronics"
                {...register('name')}
                error={!!errors.name}
              />
            </FormField>

            <FormField label="Parent Category (optional)">
              {catError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Failed to load categories.</span>
                </div>
              ) : (
                <Select
                  value={selectedParentId || undefined}
                  onValueChange={(val) => setValue('parentId', val)}
                  disabled={catLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={catLoading ? 'Loading...' : 'None (top-level)'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (top-level)</SelectItem>
                    {availableParents?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormField>
          </div>

          <FormField label="Description" error={errors.description?.message}>
            <textarea
              className="flex min-h-24 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Optional description for this category..."
              {...register('description')}
            />
          </FormField>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="submit" loading={isSubmitting}>
          <FolderTree className="h-4 w-4" />
          {category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
}
