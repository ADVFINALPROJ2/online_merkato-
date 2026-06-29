'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { PageHeader } from '@/components/page-header';
import { Breadcrumb } from '@/components/breadcrumb';
import { ProductForm } from '@/components/product-form';
import { useCreateProduct } from '@/hooks/use-product';

export default function NewProductPage() {
  const router = useRouter();
  const { mutateAsync: createProduct, isPending } = useCreateProduct();

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      await createProduct(data as unknown as Parameters<typeof createProduct>[0]);
      toast.success('Product created successfully');
      router.push('/products');
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Failed to create product');
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Products', href: '/products' }, { label: 'Add Product' }]} />
      <PageHeader
        title="Add Product"
        description="List a new product in your shop."
      />
      <ProductForm onSubmit={handleSubmit} isSubmitting={isPending} />
    </div>
  );
}
