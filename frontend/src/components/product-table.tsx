'use client';

import Link from 'next/link';
import { Edit, Trash2, Eye, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/empty-state';
import { LoadingSpinner } from '@/components/loading-spinner';
import type { Product, ProductStatus } from '@/types/product';

const statusConfig: Record<ProductStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' }> = {
  ACTIVE: { label: 'Active', variant: 'success' },
  INACTIVE: { label: 'Inactive', variant: 'danger' },
  DRAFT: { label: 'Draft', variant: 'default' },
  OUT_OF_STOCK: { label: 'Out of Stock', variant: 'warning' },
};

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  searchQuery: string;
  onDelete: (product: Product) => void;
}

export function ProductTable({ products, isLoading, searchQuery, onDelete }: ProductTableProps) {
  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-64" />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<Package className="h-8 w-8 text-stone-400" />}
        title={searchQuery ? 'No products match your search' : 'No products yet'}
        description={
          searchQuery
            ? 'Try adjusting your search query.'
            : 'Add your first product to start selling.'
        }
        action={searchQuery ? undefined : { label: 'Add Product', href: '/products/new' }}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
              Product
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
              Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
              Quantity
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {products.map((product) => {
            const cfg = statusConfig[product.status] || statusConfig.DRAFT;
            return (
              <tr key={product.id} className="group hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-stone-50">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full rounded-lg object-cover"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-stone-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-stone-900 truncate max-w-64">
                        {product.name}
                      </p>
                      {product.category && (
                        <p className="text-xs text-stone-500">{product.category.name}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-stone-900 whitespace-nowrap">
                  ETB {product.price.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-stone-600 whitespace-nowrap">
                  {product.quantity}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/products/${product.id}/edit`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => onDelete(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
