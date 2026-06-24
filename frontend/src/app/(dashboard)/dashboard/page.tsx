'use client';

import Link from 'next/link';
import { Store, Settings, MapPin, ShoppingBag, ArrowRight, Package, BadgeCheck, Clock, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useAuth } from '@/hooks/use-auth';
import { useMyShop, useShopDashboard } from '@/hooks/use-shop';

const statusConfig = {
  PENDING: { label: 'Pending Verification', variant: 'warning' as const, icon: Clock },
  VERIFIED: { label: 'Verified', variant: 'success' as const, icon: BadgeCheck },
  REJECTED: { label: 'Rejected', variant: 'danger' as const, icon: XCircle },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: shop, isLoading: shopLoading, isError: noShop } = useMyShop();
  const { data: dashboard, isLoading: dashLoading } = useShopDashboard();

  const isLoading = shopLoading || dashLoading;

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-[calc(100vh-16rem)]" />;
  }

  if (noShop || !shop) {
    return (
      <div>
        <PageHeader
          title={`Welcome${user ? `, ${user.firstName}` : ''}!`}
          description="Get started by creating your shop profile."
        />
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16">
            <div className="rounded-full bg-amber-100 p-4">
              <Store className="h-8 w-8 text-amber-600" />
            </div>
            <p className="text-lg font-medium text-stone-700">No shop yet</p>
            <p className="text-sm text-stone-500 text-center max-w-md">
              Create your shop to start selling on Digital Merkato.
            </p>
            <Link href="/shop/create">
              <Button>
                <Store className="h-4 w-4" />
                Create Your Shop
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const v = statusConfig[shop.verificationStatus] || statusConfig.PENDING;
  const VIcon = v.icon;

  return (
    <div>
      <PageHeader
        title={`Welcome${user ? `, ${user.firstName}` : ''}!`}
        description="Manage your shop, products, and orders from here."
      />

      <Card className="mb-6">
        <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 pt-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="rounded-full bg-amber-100 p-3">
              <Store className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-stone-900">{shop.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={v.variant}>
                  <VIcon className="h-3 w-3 mr-1" />
                  {v.label}
                </Badge>
                {shop.businessType && (
                  <span className="text-xs text-stone-500">{shop.businessType}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/shop/edit">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Link href="/shop/location">
              <Button variant="outline" size="sm">
                <MapPin className="h-4 w-4" />
                Location
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-blue-100 p-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">
                {dashboard?.stats.totalProducts ?? 0}
              </p>
              <p className="text-sm text-stone-500">Total Products</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-green-100 p-3">
              <BadgeCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">
                {dashboard?.stats.activeProducts ?? 0}
              </p>
              <p className="text-sm text-stone-500">Active Products</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-amber-100 p-3">
              <ShoppingBag className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">0</p>
              <p className="text-sm text-stone-500">Total Orders</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
