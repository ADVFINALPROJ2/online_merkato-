'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, DollarSign, Star, User as UserIcon, Mail, Phone, MapPin, Pencil, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

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

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState('Bole, Addis Ababa');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    import('@/services/api').then(({ default: api }) => {
      api.get('/orders').then(({ data }) => setOrders(data ?? [])).catch(() => setOrders([]));
    });
  }, [isAuthenticated]);

  if (isLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-40 rounded-2xl bg-[var(--muted)]" />
          <div className="h-24 rounded-2xl bg-[var(--muted)]" />
        </div>
      </div>
    );
  }

  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0);
  const memberSince = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-8">
        <div className="relative overflow-hidden rounded-2xl p-8 text-white" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-glow, #4f8ef7))' }}>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex size-20 items-center justify-center rounded-full bg-white/20 text-3xl font-bold backdrop-blur">
              {user.firstName?.[0]?.toUpperCase() ?? <UserIcon className="size-8" />}
            </div>
            <div className="flex-1">
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">Buyer</span>
              <h1 className="mt-2 font-display text-3xl font-bold">{user.firstName} {user.lastName}</h1>
              <p className="mt-1 text-sm text-white/85">Member since {memberSince} - {address}</p>
            </div>
            <button onClick={logout} className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[var(--primary)] hover:bg-white/90">
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Package className="size-5" /></div>
            <div className="mt-3 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Orders</div>
            <div className="font-display text-2xl font-bold">{orders.length}</div>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-green-50 text-green-600"><DollarSign className="size-5" /></div>
            <div className="mt-3 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Total Spent</div>
            <div className="font-display text-2xl font-bold">{formatBirr(totalSpent)}</div>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600"><Star className="size-5" /></div>
            <div className="mt-3 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Reviews Written</div>
            <div className="font-display text-2xl font-bold">0</div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Contact information</h2>
            <button onClick={() => setEditing(!editing)} className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--secondary)]">
              <Pencil className="size-3.5" /> {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          <div className="mt-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><UserIcon className="size-4" /></div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Name</div>
                <div className="font-medium">{user.firstName} {user.lastName}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Mail className="size-4" /></div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Email</div>
                <div className="font-medium">{user.email ?? 'Not provided'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Phone className="size-4" /></div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Phone</div>
                <div className="font-medium">{user.phoneNumber}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><MapPin className="size-4" /></div>
              <div className="flex-1">
                <div className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Address</div>
                {editing ? (
                  <input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 w-full max-w-sm rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm outline-none focus:border-[var(--primary)]" />
                ) : (
                  <div className="font-medium">{address}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Recent orders</h2>
            <Link href="/orders" className="text-sm font-semibold text-[var(--primary)] hover:underline">View all</Link>
          </div>
          {orders.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-[var(--muted-foreground)]">
              No orders yet. <Link href="/browse" className="text-[var(--primary)] hover:underline">Browse products</Link>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-[var(--border)]">
              {orders.slice(0, 4).map((order) => (
                <div key={order.id} className="flex items-center justify-between py-4">
                  <div>
                    <div className="font-semibold">ORD-{order.id.slice(0, 6).toUpperCase()}</div>
                    <div className="text-sm text-[var(--muted-foreground)]">{new Date(order.createdAt).toISOString().slice(0, 10)} - {order.items?.length ?? 0} item(s)</div>
                  </div>
                  <div className="text-right">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status] ?? 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
                    <div className="mt-1 font-display font-bold">{formatBirr(order.totalAmount)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}