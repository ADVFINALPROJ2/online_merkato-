'use client';

import { Store, MapPin, BadgeCheck, Clock, XCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Shop } from '@/types/shop';

const verificationStyles: Record<string, { label: string; variant: 'default' | 'success' | 'danger' | 'warning'; icon: typeof Clock }> = {
  PENDING: { label: 'Pending', variant: 'warning', icon: Clock },
  VERIFIED: { label: 'Verified', variant: 'success', icon: BadgeCheck },
  REJECTED: { label: 'Rejected', variant: 'danger', icon: XCircle },
};

interface ShopHeaderProps {
  shop: Shop;
}

export function ShopHeader({ shop }: ShopHeaderProps) {
  const vStatus = verificationStyles[shop.verificationStatus] || verificationStyles.PENDING;
  const VIcon = vStatus.icon;

  return (
    <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-amber-500 to-amber-600 sm:h-40">
        {shop.bannerUrl && (
          <img
            src={shop.bannerUrl}
            alt="Shop banner"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="relative px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
          <Avatar className="h-20 w-20 border-4 border-white shadow-md">
            {shop.logoUrl ? (
              <img src={shop.logoUrl} alt={shop.name} className="object-cover" />
            ) : (
              <AvatarFallback className="bg-amber-100 text-amber-700 text-xl">
                {shop.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1 pt-4 sm:pt-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-xl font-bold text-stone-900">{shop.name}</h1>
              <Badge variant={vStatus.variant} className="w-fit">
                <VIcon className="h-3 w-3 mr-1" />
                {vStatus.label}
              </Badge>
            </div>
            {shop.businessType && (
              <p className="text-sm text-stone-500 mt-0.5">
                <Store className="h-3.5 w-3.5 inline mr-1" />
                {shop.businessType}
              </p>
            )}
          </div>
        </div>

        {shop.description && (
          <p className="mt-4 text-sm text-stone-600 leading-relaxed">{shop.description}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-500">
          {shop.contactPhone && (
            <span className="flex items-center gap-1">
              <span>&#9742;</span>
              {shop.contactPhone}
            </span>
          )}
          {shop.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {shop.location.city}, {shop.location.region}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
