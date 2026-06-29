'use client';

import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { PageHeader } from '@/components/page-header';
import { Breadcrumb } from '@/components/breadcrumb';
import { ProductForm } from '@/components/product-form';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Card, CardContent } from '@/components/ui/card';
import { useProduct, useUpdateProduct } from '@/hooks/use-product';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: product, isLoading, isError } = useProduct(id);
  const { mutateAsync: updateProduct, isPending } = useUpdateProduct(id);

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      await updateProduct(data as unknown as Parameters<typeof updateProduct>[0]);
      toast.success('Product updated successfully');
      router.push('/products');
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Failed to update product');
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-[calc(100vh-16rem)]" />;
  }

  if (isError || !product) {
    return (
      <div>
        <PageHeader title="Edit Product" />
        <Card>
          <CardContent className="py-16 text-center text-stone-500">
            Product not found.{' '}
            <a href="/products" className="text-amber-600 hover:underline font-medium">
              Back to products
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Products', href: '/products' }, { label: 'Edit Product' }]} />
      <PageHeader
        title="Edit Product"
        description="Update your product information."
      />
      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
      />
    </div>
  );
}
