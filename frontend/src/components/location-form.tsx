'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import type { ShopLocation, ShopLocationDto } from '@/types/shop';

const locationSchema = z.object({
  region: z.string().min(1, 'Region is required'),
  city: z.string().min(1, 'City is required'),
  subCity: z.string().min(1, 'Sub city is required'),
  woreda: z.string().min(1, 'Woreda is required'),
  terra: z.string().min(1, 'Terra is required'),
  latitude: z.string().min(1, 'Latitude is required'),
  longitude: z.string().min(1, 'Longitude is required'),
  landmark: z.string().optional().or(z.literal('')),
});

type LocationFormValues = z.infer<typeof locationSchema>;

interface LocationFormProps {
  location?: ShopLocation | null;
  onSubmit: (data: ShopLocationDto) => Promise<void>;
  isSubmitting: boolean;
}

export function LocationForm({ location, onSubmit, isSubmitting }: LocationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      region: location?.region || '',
      city: location?.city || '',
      subCity: location?.subCity || '',
      woreda: location?.woreda || '',
      terra: location?.terra || '',
      latitude: location?.latitude?.toString() || '',
      longitude: location?.longitude?.toString() || '',
      landmark: location?.landmark || '',
    },
  });

  const handleFormSubmit = async (values: LocationFormValues) => {
    const payload: ShopLocationDto = {
      region: values.region,
      city: values.city,
      subCity: values.subCity,
      woreda: values.woreda,
      terra: values.terra,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
    };
    if (values.landmark) payload.landmark = values.landmark;

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Region" error={errors.region?.message}>
              <Input
                placeholder="e.g. Addis Ababa"
                {...register('region')}
                error={!!errors.region}
              />
            </FormField>

            <FormField label="City" error={errors.city?.message}>
              <Input
                placeholder="e.g. Addis Ababa"
                {...register('city')}
                error={!!errors.city}
              />
            </FormField>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <FormField label="Sub City" error={errors.subCity?.message}>
              <Input
                placeholder="e.g. Bole"
                {...register('subCity')}
                error={!!errors.subCity}
              />
            </FormField>

            <FormField label="Woreda" error={errors.woreda?.message}>
              <Input
                placeholder="e.g. Bole 01"
                {...register('woreda')}
                error={!!errors.woreda}
              />
            </FormField>

            <FormField label="Terra" error={errors.terra?.message}>
              <Input
                placeholder="e.g. 01"
                {...register('terra')}
                error={!!errors.terra}
              />
            </FormField>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Latitude" error={errors.latitude?.message}>
              <Input
                type="number"
                step="any"
                placeholder="e.g. 9.0222"
                {...register('latitude')}
                error={!!errors.latitude}
              />
            </FormField>

            <FormField label="Longitude" error={errors.longitude?.message}>
              <Input
                type="number"
                step="any"
                placeholder="e.g. 38.7467"
                {...register('longitude')}
                error={!!errors.longitude}
              />
            </FormField>
          </div>

          <FormField label="Landmark (optional)" error={errors.landmark?.message}>
            <Input
              placeholder="e.g. Near Bole Medhanealem"
              {...register('landmark')}
              error={!!errors.landmark}
            />
          </FormField>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="submit" loading={isSubmitting}>
          <MapPin className="h-4 w-4" />
          {location ? 'Update Location' : 'Save Location'}
        </Button>
      </div>
    </form>
  );
}
