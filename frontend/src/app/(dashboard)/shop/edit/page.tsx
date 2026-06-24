'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { PageHeader } from '@/components/page-header';
import { Breadcrumb } from '@/components/breadcrumb';
import { ShopForm } from '@/components/shop-form';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Card, CardContent } from '@/components/ui/card';
import { useMyShop, useUpdateShop } from '@/hooks/use-shop';

export default function EditShopPage() {
  const router = useRouter();
  const { data: shop, isLoading, isError } = useMyShop();
  const { mutateAsync: updateShop, isPending } = useUpdateShop();

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      await updateShop(data as unknown as Parameters<typeof updateShop>[0]);
      toast.success('Shop updated successfully');
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Failed to update shop');
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-[calc(100vh-16rem)]" />;
  }

  if (isError || !shop) {
    return (
      <div>
        <PageHeader title="Edit Shop" />
        <Card>
          <CardContent className="py-16 text-center text-stone-500">
            You haven&apos;t created a shop yet.{' '}
            <a href="/shop/create" className="text-amber-600 hover:underline font-medium">
              Create one here
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Edit Shop' }]} />
      <PageHeader
        title="Edit Shop"
        description="Update your shop profile information."
      />
      <ShopForm
        shop={shop}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
      />
    </div>
  );
}
