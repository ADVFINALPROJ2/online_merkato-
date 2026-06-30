'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface Order {
  id: string;
  total: number;
  status: string;
  buyer: { firstName: string; lastName: string };
  items: { product: { name: string } }[];
}

interface Stats {
  totalRevenue: number;
  orderCount: number;
  sellerCount: number;
  courierCount: number;
}

export default function AdminPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ totalRevenue: 0, orderCount: 0, sellerCount: 0, courierCount: 0 });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get<Stats>('/admin/stats'),
          api.get<Order[]>('/admin/orders'),
        ]);
        setStats(statsRes.data);
        setOrders(ordersRes.data);
      } catch (err: any) {
        setError(err.response?.status === 401 ? "Unauthorized: Please log in again." : "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) return <div className="flex min-h-screen items-center justify-center"><p>Loading your dashboard...</p></div>;

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-xl font-bold">Access Denied</h1>
        <Button onClick={() => router.push('/login')} className="mt-4">Return to Login</Button>
      </div>
    );
  }

  if (loading) return <div className="p-8">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-red-600 font-bold">{error}</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Platform overview</h1>
          <p className="text-gray-600">Welcome back, {user.email}</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50">
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="TOTAL REVENUE" value={`Br ${stats.totalRevenue.toLocaleString()}`} />
        <StatCard title="ORDERS" value={stats.orderCount.toString()} />
        <StatCard title="SELLERS" value={stats.sellerCount.toString()} />
        <StatCard title="COURIERS" value={stats.courierCount.toString()} />
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
              <th className="p-4 border-b">Order</th>
              <th className="p-4 border-b">Buyer</th>
              <th className="p-4 border-b">Items</th>
              <th className="p-4 border-b">Total</th>
              <th className="p-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono text-sm text-gray-700">{order.id.slice(0, 8)}</td>
                <td className="p-4 text-gray-800">{`${order.buyer.firstName} ${order.buyer.lastName}`}</td>
                <td className="p-4 text-gray-600">{order.items.map(i => i.product.name).join(', ')}</td>
                <td className="p-4 font-medium text-gray-800">Br {order.total}</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
    <p className="text-[10px] text-gray-500 font-bold tracking-wider mb-2">{title}</p>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);
