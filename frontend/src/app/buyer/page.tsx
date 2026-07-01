'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ShoppingBag, User as UserIcon, LogOut, ShoppingCart, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { BuyerHeader } from '@/components/BuyerHeader';
import api from '@/services/api';

const formatBirr = (n: number) => `Br ${n.toLocaleString()}`;

const statusStyles: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

interface OrderSummary {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: { id: string }[];
}

export default function BuyerDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    api.get('/orders')
      .then(({ data }) => setOrders(data ?? []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [isAuthenticated]);

  if (isLoading || !user) {
    return (
      <>
        <BuyerHeader />
        <div className="container mx-auto px-4 py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-40 rounded-2xl bg-[var(--muted)]" />
            <div className="h-24 rounded-2xl bg-[var(--muted)]" />
          </div>
        </div>
      </>
    );
  }

  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0);
  const recentOrders = orders.slice(0, 3);

  return (
    <>
      <BuyerHeader />
      <div className="min-h-screen bg-[var(--background)]">
        <div className="container mx-auto px-4 py-8">
          <div
            className="relative overflow-hidden rounded-2xl p-8 text-white"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
          >
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex size-20 items-center justify-center rounded-full bg-white/20 text-3xl font-bold backdrop-blur">
                {user.firstName?.[0]?.toUpperCase() ?? <UserIcon className="size-8" />}
              </div>
              <div className="flex-1">
                <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                  Buyer
                </span>
                <h1 className="mt-2 font-display text-3xl font-bold">
                  Welcome back, {user.firstName}!
                </h1>
                <p className="mt-1 text-sm text-white/85">
                  Browse products, track orders, and manage your account.
                </p>
              </div>
              <button
                onClick={() => { logout(); router.push('/'); }}
                className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-amber-600 hover:bg-white/90"
              >
                <LogOut className="size-4" /> Sign out
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Link
              href="/profile"
              className="rounded-2xl border border-[var(--border)] bg-white p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UserIcon className="size-5" />
              </div>
              <div className="mt-3 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                My Profile
              </div>
              <div className="mt-1 font-display text-lg font-bold">View Profile</div>
            </Link>

            <Link
              href="/orders"
              className="rounded-2xl border border-[var(--border)] bg-white p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <Package className="size-5" />
              </div>
              <div className="mt-3 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                Orders
              </div>
              <div className="mt-1 font-display text-lg font-bold">{orders.length} Orders</div>
            </Link>

            <Link
              href="/cart"
              className="rounded-2xl border border-[var(--border)] bg-white p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <ShoppingCart className="size-5" />
              </div>
              <div className="mt-3 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                Cart
              </div>
              <div className="mt-1 font-display text-lg font-bold">View Cart</div>
            </Link>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-5 text-amber-600" />
                  <h2 className="font-display text-xl font-bold">Shopping Stats</h2>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-stone-50 p-4">
                  <div className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                    Total Spent
                  </div>
                  <div className="mt-1 font-display text-2xl font-bold text-amber-600">
                    {formatBirr(totalSpent)}
                  </div>
                </div>
                <div className="rounded-xl bg-stone-50 p-4">
                  <div className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                    Orders Placed
                  </div>
                  <div className="mt-1 font-display text-2xl font-bold">
                    {orders.length}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="size-5 text-amber-600" />
                  <h2 className="font-display text-xl font-bold">Recent Orders</h2>
                </div>
                <Link
                  href="/orders"
                  className="text-sm font-semibold text-amber-600 hover:underline"
                >
                  View all
                </Link>
              </div>

              {ordersLoading ? (
                <div className="mt-4 animate-pulse space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 rounded-xl bg-stone-100" />
                  ))}
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-[var(--muted-foreground)]">
                  <ShoppingBag className="mx-auto size-8 mb-2" />
                  No orders yet.{' '}
                  <Link href="/" className="text-amber-600 hover:underline">
                    Browse products
                  </Link>
                </div>
              ) : (
                <div className="mt-4 divide-y divide-[var(--border)]">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-3">
                      <div>
                        <div className="font-semibold">
                          ORD-{order.id.slice(0, 6).toUpperCase()}
                        </div>
                        <div className="text-sm text-[var(--muted-foreground)]">
                          {new Date(order.createdAt).toISOString().slice(0, 10)} &middot;{' '}
                          {order.items?.length ?? 0} item(s)
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            statusStyles[order.status] ?? 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {order.status}
                        </span>
                        <div className="mt-1 font-display font-bold">
                          {formatBirr(order.totalAmount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-8 py-3 font-semibold text-white hover:bg-amber-700 transition-colors"
            >
              <ShoppingBag className="size-5" />
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
