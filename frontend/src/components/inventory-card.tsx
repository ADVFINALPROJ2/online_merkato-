'use client';

import { useState } from 'react';
import { Package, Minus, Plus, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ProductStatus } from '@/types/product';

const statusConfig: Record<ProductStatus, { label: string; variant: 'success' | 'danger' | 'warning' | 'default' }> = {
  ACTIVE: { label: 'Active', variant: 'success' },
  INACTIVE: { label: 'Inactive', variant: 'danger' },
  DRAFT: { label: 'Draft', variant: 'default' },
  OUT_OF_STOCK: { label: 'Out of Stock', variant: 'warning' },
};

interface InventoryCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    status: ProductStatus;
    images: string[];
    category?: { name: string } | null;
  };
  onUpdateQuantity: (id: string, quantity: number) => Promise<void>;
  onUpdatePrice: (id: string, price: number) => Promise<void>;
  onUpdateStatus: (id: string, status: ProductStatus) => Promise<void>;
}

export function InventoryCard({ product, onUpdateQuantity, onUpdatePrice, onUpdateStatus }: InventoryCardProps) {
  const [editingQuantity, setEditingQuantity] = useState(false);
  const [editingPrice, setEditingPrice] = useState(false);
  const [newQuantity, setNewQuantity] = useState(product.quantity.toString());
  const [newPrice, setNewPrice] = useState(product.price.toString());
  const [saving, setSaving] = useState<string | null>(null);

  const cfg = statusConfig[product.status] || statusConfig.DRAFT;

  const handleSaveQuantity = async () => {
    const val = parseInt(newQuantity, 10);
    if (isNaN(val) || val < 0) return;
    setSaving('quantity');
    try {
      await onUpdateQuantity(product.id, val);
      setEditingQuantity(false);
    } finally {
      setSaving(null);
    }
  };

  const handleSavePrice = async () => {
    const val = parseFloat(newPrice);
    if (isNaN(val) || val < 0) return;
    setSaving('price');
    try {
      await onUpdatePrice(product.id, val);
      setEditingPrice(false);
    } finally {
      setSaving(null);
    }
  };

  const handleStatusChange = async (status: ProductStatus) => {
    setSaving('status');
    try {
      await onUpdateStatus(product.id, status);
    } finally {
      setSaving(null);
    }
  };

  const thumbnail = product.images?.[0];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-stone-50">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={product.name}
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <Package className="h-6 w-6 text-stone-400" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-stone-900 truncate max-w-56">
                  {product.name}
                </p>
                {product.category && (
                  <p className="text-xs text-stone-500">{product.category.name}</p>
                )}
              </div>
              <Badge variant={cfg.variant} className="shrink-0">
                {cfg.label}
              </Badge>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-stone-500">Quantity</p>
                {editingQuantity ? (
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      min="0"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                      className="h-8 text-sm w-20"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-green-600"
                      onClick={handleSaveQuantity}
                      loading={saving === 'quantity'}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500"
                      onClick={() => setEditingQuantity(false)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-stone-900">{product.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setNewQuantity(product.quantity.toString());
                        setEditingQuantity(true);
                      }}
                    >
                      <Minus className="h-3 w-3" />
                      <span className="sr-only">Edit quantity</span>
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-stone-500">Price (ETB)</p>
                {editingPrice ? (
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="h-8 text-sm w-24"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-green-600"
                      onClick={handleSavePrice}
                      loading={saving === 'price'}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500"
                      onClick={() => setEditingPrice(false)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-stone-900">
                      ETB {product.price.toLocaleString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setNewPrice(product.price.toString());
                        setEditingPrice(true);
                      }}
                    >
                      <Plus className="h-3 w-3" />
                      <span className="sr-only">Edit price</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <p className="text-xs font-medium text-stone-500">Status:</p>
              <div className="flex flex-wrap gap-1">
                {(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'] as ProductStatus[]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleStatusChange(status)}
                    disabled={saving === 'status' || product.status === status}
                    className={cn(
                      'rounded-md px-2 py-0.5 text-xs font-medium transition-colors',
                      product.status === status
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200',
                      saving === 'status' && 'opacity-50 pointer-events-none',
                      product.status !== status && 'cursor-pointer',
                    )}
                  >
                    {status === 'ACTIVE' ? 'Available' : status === 'INACTIVE' ? 'Unavailable' : 'Out of Stock'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
