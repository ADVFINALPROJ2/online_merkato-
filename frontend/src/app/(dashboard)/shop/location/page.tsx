'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { PageHeader } from '@/components/page-header';
import { Breadcrumb } from '@/components/breadcrumb';
import { LocationForm } from '@/components/location-form';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Card, CardContent } from '@/components/ui/card';
import { useMyShop, useSetLocation } from '@/hooks/use-shop';
import type { ShopLocationDto } from '@/types/shop';

export default function ShopLocationPage() {
  const router = useRouter();
  const { data: shop, isLoading, isError } = useMyShop();
  const { mutateAsync: setLocation, isPending } = useSetLocation();

  const handleSubmit = async (data: ShopLocationDto) => {
    try {
      await setLocation(data);
      toast.success('Location saved successfully');
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Failed to save location');
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
        <PageHeader title="Shop Location" />
        <Card>
          <CardContent className="py-16 text-center text-stone-500">
            You need to create a shop first.{' '}
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
      <Breadcrumb items={[{ label: 'Shop Location' }]} />
      <PageHeader
        title="Shop Location"
        description="Set your shop's physical location for pickup and delivery."
      />
      <LocationForm
        location={shop.location}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
      />
    </div>
  );
}
