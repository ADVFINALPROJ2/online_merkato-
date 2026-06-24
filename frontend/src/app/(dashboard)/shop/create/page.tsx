'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { PageHeader } from '@/components/page-header';
import { Breadcrumb } from '@/components/breadcrumb';
import { ShopForm } from '@/components/shop-form';
import { useCreateShop } from '@/hooks/use-shop';
export default function CreateShopPage() {
  const router = useRouter();
  const { mutateAsync: createShop, isPending } = useCreateShop();

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      await createShop(data as unknown as Parameters<typeof createShop>[0]);
      toast.success('Shop created successfully');
      router.push('/shop/location');
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Failed to create shop');
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Create Shop' }]} />
      <PageHeader
        title="Create Your Shop"
        description="Set up your seller profile to start selling on Digital Merkato."
      />
      <ShopForm onSubmit={handleSubmit} isSubmitting={isPending} />
    </div>
  );
}
