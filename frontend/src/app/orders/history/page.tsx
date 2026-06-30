'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils"; // Import it using your alia

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

interface HistoryOrder {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  itemsSummary: string;
}

const mockOrders: HistoryOrder[] = [
  { id: 'ORD-1042', date: '2026-06-30', total: 2280, status: 'IN_TRANSIT', itemsSummary: 'Berbere Spice Blend +2 more' },
  { id: 'ORD-1038', date: '2026-06-24', total: 540, status: 'DELIVERED', itemsSummary: 'Teff Flour 2kg' },
  { id: 'ORD-1029', date: '2026-06-15', total: 1520, status: 'DELIVERED', itemsSummary: 'Carved Wooden Jebena' },
  { id: 'ORD-1017', date: '2026-06-02', total: 320, status: 'CANCELLED', itemsSummary: 'Yirgacheffe Coffee 500g' },
];

const statusStyles: Record<OrderStatus, { label: string; variant: 'success' | 'danger' | 'warning' | 'default' }> = {
  PENDING: { label: 'Pending', variant: 'warning' },
  CONFIRMED: { label: 'Confirmed', variant: 'default' },
  IN_TRANSIT: { label: 'In Transit', variant: 'default' },
  DELIVERED: { label: 'Delivered', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'danger' },
};
export function StatusBadge({ status }: { status: string }) {
  return (
    <div className={cn(
      "px-3 py-1 rounded-full text-sm font-medium", // Base classes
      status === "PAID" ? "bg-green-500 text-white" : "bg-yellow-500 text-black" // Conditional classes
    )}>
      {status}
    </div>
  );
}

export default function OrderHistoryPage() {
  const [search, setSearch] = useState('');

  const filtered = mockOrders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.itemsSummary.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Order History</h1>
          <p className="text-stone-500 text-sm mt-1">{mockOrders.length} orders total</p>
        </div>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <Input
          placeholder="Search by order ID or item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 p-16 text-center bg-white">
          <Package className="h-8 w-8 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-400">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const s = statusStyles[order.status];
            return (
              <Link key={order.id} href={`/orders/track?id=${order.id}`}>
                <Card className="hover:border-stone-300 transition-colors cursor-pointer">
                  <CardContent className="py-4 flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-50 border border-stone-100">
                      <Package className="h-5 w-5 text-stone-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-semibold text-stone-900">{order.id}</span>
                        <Badge variant={s.variant}>{s.label}</Badge>
                      </div>
                      <p className="text-sm text-stone-500 truncate mt-0.5">{order.itemsSummary}</p>
                      <p className="text-xs text-stone-400 mt-0.5">{order.date}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-stone-900">Br {order.total.toLocaleString()}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-stone-300 shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}