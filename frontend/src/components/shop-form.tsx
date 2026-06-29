'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ImageUpload } from '@/components/image-upload';
import type { Shop } from '@/types/shop';

const businessTypes = [
  { value: 'ELECTRONICS', label: 'Electronics' },
  { value: 'FASHION', label: 'Fashion' },
  { value: 'FOOD', label: 'Food' },
  { value: 'AGRICULTURE', label: 'Agriculture' },
  { value: 'HOME', label: 'Home & Living' },
  { value: 'OTHER', label: 'Other' },
] as const;

const shopSchema = z.object({
  name: z
    .string()
    .min(2, 'Shop name must be at least 2 characters')
    .max(100, 'Shop name is too long'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description is too long'),
  contactPhone: z
    .string()
    .regex(/^\+?[1-9]\d{6,14}$/, 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
  businessType: z.string().optional().or(z.literal('')),
});

type ShopFormValues = z.infer<typeof shopSchema>;

interface ShopFormProps {
  shop?: Shop;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isSubmitting: boolean;
}

export function ShopForm({ shop, onSubmit, isSubmitting }: ShopFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ShopFormValues>({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      name: shop?.name || '',
      description: shop?.description || '',
      contactPhone: shop?.contactPhone || '',
      businessType: shop?.businessType || '',
    },
  });

  const [logoUrl, setLogoUrl] = useState<string | null>(shop?.logoUrl || null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(shop?.bannerUrl || null);

  const handleFormSubmit = async (values: ShopFormValues) => {
    const payload: Record<string, unknown> = {
      name: values.name,
      description: values.description,
    };
    if (values.contactPhone) payload.contactPhone = values.contactPhone;
    if (values.businessType) payload.businessType = values.businessType;
    if (logoUrl) payload.logoUrl = logoUrl;
    if (bannerUrl) payload.bannerUrl = bannerUrl;

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Shop Name" error={errors.name?.message}>
              <Input
                placeholder="e.g. John's Electronics"
                {...register('name')}
                error={!!errors.name}
              />
            </FormField>

            <FormField label="Business Type">
              <Select
                value={watch('businessType') || undefined}
                onValueChange={(val) => setValue('businessType', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <FormField label="Description" error={errors.description?.message}>
            <textarea
              className="flex min-h-32 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Describe your shop and what you sell..."
              {...register('description')}
            />
          </FormField>

          <FormField label="Contact Phone" error={errors.contactPhone?.message}>
            <Input
              type="tel"
              placeholder="+251911234567"
              {...register('contactPhone')}
              error={!!errors.contactPhone}
            />
          </FormField>

          <div className="grid gap-6 sm:grid-cols-2">
            <ImageUpload
              label="Logo"
              value={logoUrl}
              onChange={setLogoUrl}
              onRemove={() => setLogoUrl(null)}
            />
            <ImageUpload
              label="Banner"
              value={bannerUrl}
              onChange={setBannerUrl}
              onRemove={() => setBannerUrl(null)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="submit" loading={isSubmitting}>
          <Store className="h-4 w-4" />
          {shop ? 'Update Shop' : 'Create Shop'}
        </Button>
      </div>
    </form>
  );
}
