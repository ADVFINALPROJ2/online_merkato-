'use client';

import { useState, useMemo } from 'react';
import { Search, Package } from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { PageHeader } from '@/components/page-header';
import { Breadcrumb } from '@/components/breadcrumb';
import { Input } from '@/components/ui/input';
import { InventoryCard } from '@/components/inventory-card';
import { Pagination } from '@/components/pagination';
import { EmptyState } from '@/components/empty-state';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useProducts, useUpdateProductQuantity, useUpdateProductPrice, useUpdateProductStatus } from '@/hooks/use-product';
import type { ProductStatus } from '@/types/product';

const ITEMS_PER_PAGE = 12;

export default function InventoryPage() {
  const { data: products, isLoading } = useProducts();
  const { mutateAsync: updateQuantity } = useUpdateProductQuantity();
  const { mutateAsync: updatePrice } = useUpdateProductPrice();
  const { mutateAsync: updateStatus } = useUpdateProductStatus();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    if (!products) return [];
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q),
    );
  }, [products, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    try {
      await updateQuantity({ id, quantity });
      toast.success('Quantity updated');
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Failed to update quantity');
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  const handleUpdatePrice = async (id: string, price: number) => {
    try {
      await updatePrice({ id, price });
      toast.success('Price updated');
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Failed to update price');
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  const handleUpdateStatus = async (id: string, status: ProductStatus) => {
    try {
      await updateStatus({ id, status });
      toast.success(`Product marked as ${status === 'ACTIVE' ? 'Available' : status === 'INACTIVE' ? 'Unavailable' : 'Out of Stock'}`);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Failed to update status');
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-[calc(100vh-16rem)]" />;
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Inventory' }]} />
      <PageHeader
        title="Inventory"
        description="Manage product quantities, prices, and availability."
      />

      <div className="mb-6 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <Input
          placeholder="Search inventory..."
          value={searchQuery}
          onChange={handleSearch}
          className="pl-9"
        />
      </div>

      {paginated.length === 0 ? (
        <EmptyState
          icon={<Package className="h-8 w-8 text-stone-400" />}
          title={searchQuery ? 'No products match your search' : 'No products yet'}
          description={
            searchQuery
              ? 'Try adjusting your search query.'
              : 'Add products to your shop to manage inventory.'
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paginated.map((product) => (
              <InventoryCard
                key={product.id}
                product={product}
                onUpdateQuantity={handleUpdateQuantity}
                onUpdatePrice={handleUpdatePrice}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-8"
          />
        </>
      )}
    </div>
  );
}
