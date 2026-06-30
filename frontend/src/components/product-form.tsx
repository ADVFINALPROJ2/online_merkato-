'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Package, AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ImageUpload } from '@/components/image-upload';
import { useCategories } from '@/hooks/use-category';
import type { Product, ProductStatus } from '@/types/product';

const productSchema = z.object({
  name: z
    .string()
    .min(2, 'Product name must be at least 2 characters')
    .max(200, 'Product name is too long'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description is too long'),
  sku: z.string().max(50, 'SKU is too long').optional().or(z.literal('')),
  unit: z.string().max(20, 'Unit is too long').optional().or(z.literal('')),
  price: z
    .string()
    .min(1, 'Price is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid price'),
  quantity: z
    .string()
    .min(1, 'Quantity is required')
    .regex(/^\d+$/, 'Enter a valid whole number'),
  categoryId: z.string().min(1, 'Category is required'),
  status: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const statusOptions: { value: ProductStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
];

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isSubmitting: boolean;
}

export function ProductForm({ product, onSubmit, isSubmitting }: ProductFormProps) {
  const { data: categories, isLoading: catLoading, isError: catError } = useCategories();
  const [images, setImages] = useState<string[]>(product?.images || []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      sku: '',
      unit: '',
      price: product?.price?.toString() || '',
      quantity: product?.quantity?.toString() || '',
      categoryId: product?.categoryId || '',
      status: product?.status || 'ACTIVE',
    },
  });

  const handleAddImage = (url: string) => {
    setImages((prev) => [...prev, url]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (values: ProductFormValues) => {
    const payload: Record<string, unknown> = {
      name: values.name,
      description: values.description,
      price: parseFloat(values.price),
      quantity: parseInt(values.quantity, 10),
      categoryId: values.categoryId,
      images,
    };
    if (product && values.status) {
      payload.status = values.status;
    }
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Product Name" error={errors.name?.message}>
              <Input
                placeholder="e.g. Wireless Bluetooth Headphones"
                {...register('name')}
                error={!!errors.name}
              />
            </FormField>

            <FormField label="Category" error={errors.categoryId?.message}>
              {catError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Failed to load categories. Please try again later.</span>
                </div>
              ) : categories && categories.length === 0 ? (
                <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm text-stone-500 flex flex-col gap-2">
                  <span>No categories yet.</span>
                  <Link
                    href="/categories/new"
                    className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Create a category first
                  </Link>
                </div>
              ) : (
                <Select
                  value={watch('categoryId') || undefined}
                  onValueChange={(val) => setValue('categoryId', val)}
                  disabled={catLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={catLoading ? 'Loading...' : 'Select category'} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
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
              className="flex min-h-32 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Describe your product in detail..."
              {...register('description')}
            />
          </FormField>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="SKU (optional)">
              <Input
                placeholder="e.g. WBH-001"
                {...register('sku')}
              />
            </FormField>

            <FormField label="Unit (optional)">
              <Input
                placeholder="e.g. piece, kg, meter"
                {...register('unit')}
              />
            </FormField>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Price (ETB)" error={errors.price?.message}>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 199.99"
                {...register('price')}
                error={!!errors.price}
              />
            </FormField>

            <FormField label="Quantity" error={errors.quantity?.message}>
              <Input
                type="number"
                min="0"
                placeholder="e.g. 50"
                {...register('quantity')}
                error={!!errors.quantity}
              />
            </FormField>
          </div>

          {product && (
            <FormField label="Status">
              <Select
                value={watch('status') || undefined}
                onValueChange={(val) => setValue('status', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          )}

          <FormField label="Product Images">
            <div className="flex flex-wrap gap-3">
              {images.map((url, index) => (
                <ImageUpload
                  key={index}
                  label={`Image ${index + 1}`}
                  value={url}
                  onChange={() => {}}
                  onRemove={() => handleRemoveImage(index)}
                />
              ))}
              <ImageUpload
                label="Add Image"
                value={null}
                onChange={handleAddImage}
                onRemove={() => {}}
              />
            </div>
          </FormField>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="submit" loading={isSubmitting}>
          <Package className="h-4 w-4" />
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
}
