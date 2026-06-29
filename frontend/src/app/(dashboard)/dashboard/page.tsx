'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Store, Settings, MapPin, Package, BadgeCheck, Clock, XCircle, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import { LoadingSpinner } from '@/components/loading-spinner';
import { StatCard } from '@/components/stat-card';
import { DashboardTable } from '@/components/dashboard-table';
import { CategoryChart } from '@/components/category-chart';
import { QuickActions } from '@/components/quick-actions';
import { useAuth } from '@/hooks/use-auth';
import { useMyShop, useShopDashboard } from '@/hooks/use-shop';
import { useProducts } from '@/hooks/use-product';
import type { Product } from '@/types/product';
import type { ProductStatus } from '@/types/product';

const statusConfig: Record<string, { label: string; variant: 'warning' | 'success' | 'danger'; icon: typeof Clock }> = {
  PENDING: { label: 'Pending Verification', variant: 'warning', icon: Clock },
  VERIFIED: { label: 'Verified', variant: 'success', icon: BadgeCheck },
  REJECTED: { label: 'Rejected', variant: 'danger', icon: XCircle },
};

const productStatusBadge: Record<ProductStatus, { label: string; variant: 'success' | 'danger' | 'warning' | 'default' }> = {
  ACTIVE: { label: 'Active', variant: 'success' },
  INACTIVE: { label: 'Inactive', variant: 'danger' },
  DRAFT: { label: 'Draft', variant: 'default' },
  OUT_OF_STOCK: { label: 'Out of Stock', variant: 'warning' },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: shop, isLoading: shopLoading, isError: noShop } = useMyShop();
  const { data: dashboard, isLoading: dashLoading } = useShopDashboard();
  const { data: products, isLoading: productsLoading } = useProducts();

  const isLoading = shopLoading || dashLoading || productsLoading;

  const recentProducts = useMemo(
    () => (products || []).slice(0, 5),
    [products],
  );

  const lowStockProducts = useMemo(
    () => (products || []).filter((p) => p.quantity > 0 && p.quantity <= 5).slice(0, 5),
    [products],
  );

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
  const stats = dashboard?.stats;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome${user ? `, ${user.firstName}` : ''}!`}
        description="Manage your shop, products, and orders from here."
      />

      <Card>
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Products"
          value={stats?.totalProducts ?? 0}
          icon={Package}
          description="All products in your shop"
          iconClassName="rounded-full bg-blue-100 p-3 text-blue-600"
        />
        <StatCard
          title="Active Products"
          value={stats?.activeProducts ?? 0}
          icon={BadgeCheck}
          description="Currently available for sale"
          iconClassName="rounded-full bg-green-100 p-3 text-green-600"
        />
        <StatCard
          title="Out of Stock"
          value={stats?.outOfStockProducts ?? 0}
          icon={AlertTriangle}
          description="Products needing restock"
          iconClassName="rounded-full bg-orange-100 p-3 text-orange-600"
        />
        <StatCard
          title="Inventory Value"
          value={`ETB ${(stats?.totalProductsValue ?? 0).toLocaleString()}`}
          icon={DollarSign}
          description="Total value of all stock"
          iconClassName="rounded-full bg-emerald-100 p-3 text-emerald-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardTable<Product>
          title="Recent Products"
          description="Latest 5 products added"
          viewAllHref="/products"
          columns={[
            {
              key: 'name',
              header: 'Product',
              render: (p) => (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-stone-200 bg-stone-50">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="h-full w-full rounded-md object-cover" />
                    ) : (
                      <Package className="h-4 w-4 text-stone-400" />
                    )}
                  </div>
                  <span className="font-medium text-stone-900 truncate max-w-40">
                    {p.name}
                  </span>
                </div>
              ),
            },
            {
              key: 'price',
              header: 'Price',
              className: 'text-right',
              render: (p) => (
                <span className="font-medium text-stone-900">ETB {p.price.toLocaleString()}</span>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              className: 'text-right',
              render: (p) => {
                const cfg = productStatusBadge[p.status];
                return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
              },
            },
          ]}
          data={recentProducts}
          emptyMessage="Add your first product to see it here."
        />

        <DashboardTable<Product>
          title="Low Stock Products"
          description="Products with 5 or fewer units"
          viewAllHref="/inventory"
          columns={[
            {
              key: 'name',
              header: 'Product',
              render: (p) => (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-stone-200 bg-stone-50">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="h-full w-full rounded-md object-cover" />
                    ) : (
                      <Package className="h-4 w-4 text-stone-400" />
                    )}
                  </div>
                  <span className="font-medium text-stone-900 truncate max-w-36">
                    {p.name}
                  </span>
                </div>
              ),
            },
            {
              key: 'quantity',
              header: 'Qty',
              className: 'text-right',
              render: (p) => (
                <span className={p.quantity <= 2 ? 'font-semibold text-red-600' : 'font-medium text-stone-900'}>
                  {p.quantity}
                </span>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              className: 'text-right',
              render: (p) => {
                const cfg = productStatusBadge[p.status];
                return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
              },
            },
          ]}
          data={lowStockProducts}
          emptyMessage="All products are well-stocked!"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryChart products={products || []} />
        <QuickActions />
      </div>
    </div>
  );
}
