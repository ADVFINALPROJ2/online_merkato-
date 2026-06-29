'use client';

import { useMemo } from 'react';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/product';

interface CategoryChartProps {
  products: Product[];
  className?: string;
}

const barColors = [
  'bg-amber-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-indigo-500',
];

export function CategoryChart({ products, className }: CategoryChartProps) {
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    let uncategorized = 0;

    for (const p of products) {
      const name = p.category?.name;
      if (name) {
        map.set(name, (map.get(name) || 0) + 1);
      } else {
        uncategorized++;
      }
    }

    if (uncategorized > 0) {
      map.set('Uncategorized', uncategorized);
    }

    const sorted = Array.from(map.entries())
      .sort(([, a], [, b]) => b - a);

    const total = sorted.reduce((sum, [, count]) => sum + count, 0);

    return { items: sorted, total };
  }, [products]);

  if (categories.items.length === 0) {
    return (
      <div className={cn('rounded-xl border border-stone-200 bg-white shadow-sm', className)}>
        <div className="border-b border-stone-200 px-5 py-4">
          <h3 className="text-sm font-semibold text-stone-900">Product Categories</h3>
        </div>
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="rounded-full bg-stone-100 p-3">
            <Package className="h-5 w-5 text-stone-400" />
          </div>
          <p className="text-sm text-stone-500">No products with categories yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border border-stone-200 bg-white shadow-sm', className)}>
      <div className="border-b border-stone-200 px-5 py-4">
        <h3 className="text-sm font-semibold text-stone-900">Product Categories</h3>
        <p className="text-xs text-stone-500 mt-0.5">
          {categories.total} products across {categories.items.length} categories
        </p>
      </div>
      <div className="space-y-3 p-5">
        {categories.items.map(([name, count], index) => {
          const percentage = (count / categories.total) * 100;
          return (
            <div key={name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-stone-700 truncate max-w-[70%]">
                  {name}
                </span>
                <span className="text-sm text-stone-500 tabular-nums">
                  {count} ({percentage.toFixed(0)}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', barColors[index % barColors.length])}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
