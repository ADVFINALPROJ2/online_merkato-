'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/loading-spinner';
import { EmptyState } from '@/components/empty-state';
import {
  LogOut,
  ClipboardList,
  MapPin,
  PackageCheck,
  MessageSquare,
  Eye,
  ChevronRight,
  Truck,
  Car,
  Bike,
  Footprints,
  Warehouse,
  CheckCircle2,
  Clock,
  ArrowLeft,
} from 'lucide-react';

interface DeliveryOrder {
  id: string;
  status: string;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  order: {
    id: string;
    status: string;
    totalAmount: number;
    deliveryAddress: string;
    deliveryFee: number;
    buyer: {
      id: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
    };
    items: {
      product: {
        id: string;
        name: string;
        price: number;
        imageUrl: string | null;
        shop: {
          id: string;
          name: string;
          location: {
            region: string;
            city: string | null;
            subCity: string | null;
            landmark: string | null;
          } | null;
          seller: {
            id: string;
            firstName: string;
            lastName: string;
            phoneNumber: string;
          };
        };
      };
    }[];
  };
}

const STATUS_CONFIG: Record<string, { className: string; icon: typeof Clock }> = {
  ASSIGNED: { className: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  ACCEPTED: { className: 'bg-blue-50 text-blue-700 border-blue-200', icon: CheckCircle2 },
  PICKED_UP: { className: 'bg-purple-50 text-purple-700 border-purple-200', icon: PackageCheck },
  OUT_FOR_DELIVERY: { className: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Truck },
  COMPLETED: { className: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  PENDING: { className: 'bg-rose-50 text-rose-700 border-rose-200', icon: Clock },
};

const STATUS_SECTIONS = [
  { key: 'pending', label: 'Pending Assignments', icon: ClipboardList, statuses: ['ASSIGNED'], emptyMsg: 'No pending assignments', emptyDesc: 'New delivery assignments will appear here.', accentColor: 'border-l-amber-500' },
  { key: 'active', label: 'Active Pickups', icon: MapPin, statuses: ['ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY'], emptyMsg: 'No active deliveries', emptyDesc: 'Accept an assignment to start.', accentColor: 'border-l-blue-500' },
  { key: 'completed', label: 'Order Fulfillment', icon: PackageCheck, statuses: ['COMPLETED'], emptyMsg: 'No completed orders', emptyDesc: 'Completed deliveries will appear here.', accentColor: 'border-l-emerald-500' },
];

export default function DriverDashboard() {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: string; message: string }>({ type: '', message: '' });
  const [token, setToken] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem('token');
    setToken(t);
    if (t) fetchOrders();
    else setLoading(false);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/delivery/orders');
      setOrders(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setToken(null);
      }
      setStatusMsg({ type: 'error', message: 'Failed to load orders.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoginLoading(true);
    setStatusMsg({ type: '', message: '' });
    try {
      const res = await fetch('/api/driver/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.access_token);
      fetchOrders();
    } catch (err: any) {
      setStatusMsg({ type: 'error', message: err.message || 'Login failed.' });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setOrders([]);
  };

  const updateStatus = async (orderId: string, action: string) => {
    try {
      const res = await api.patch(`/delivery/orders/${orderId}/${action}`);
      if (res.status === 200 || res.status === 201) {
        setStatusMsg({ type: 'success', message: `Status updated to ${action.replace(/-/g, ' ')}!` });
        fetchOrders();
      } else {
        throw new Error('Update failed');
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', message: err.response?.data?.message || err.message || 'Update failed.' });
    }
  };

  const sectionOrders = (statuses: string[]) =>
    orders.filter((d) => statuses.includes(d.status));

  if (!token) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 antialiased">
        <div className="w-full max-w-md space-y-4">
          <button 
            onClick={() => router.push('/')} 
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors group mb-2"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Choose a different role
          </button>

          <Card className="w-full border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl bg-white p-2">
            <CardHeader className="items-start text-left pt-6 px-6 pb-4">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100/60 shadow-sm">
                <Truck className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Sign In</span>
                <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">as Delivery</CardTitle>
                <CardDescription className="text-slate-500 text-sm">Log in to manage and accept assignments</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-2">
              {statusMsg.message && (
                <div
                  className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium border text-center ${
                    statusMsg.type === 'error'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  {statusMsg.message}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-semibold text-slate-700">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="name@example.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                    required
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-semibold text-slate-700">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                    required
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
                  />
                </div>
                <div className="pt-2">
                  <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 active:scale-[0.98]" disabled={loginLoading}>
                    {loginLoading ? 'Logging in...' : 'Sign In'}
                  </Button>
                </div>
              </form>
            </CardContent>

            <div className="px-6 pb-6 pt-0 text-center text-sm font-medium">
              <p className="text-slate-400">
                Don&apos;t have an account?{' '}
                <Link href="/driver/register" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                  Register as a driver
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const pending = sectionOrders(['ASSIGNED']);
  const active = sectionOrders(['ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY']);
  const done = sectionOrders(['COMPLETED']);

  return (
    <div className="min-h-screen bg-[#f8fafc] antialiased">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100/50 shadow-sm">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Deliveries</h1>
              <p className="text-sm font-medium text-slate-400 mt-0.5">
                {orders.length} delivery{orders.length !== 1 ? 'ies' : 'y'} total routing
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="h-10 px-4 rounded-xl border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 gap-2 font-medium self-end sm:self-auto">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Dynamic Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="border-l-4 border-l-amber-500 border-y-slate-100 border-r-slate-100 shadow-sm rounded-xl">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-amber-600">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{pending.length}</p>
                <p className="text-sm font-semibold text-slate-400">Pending</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500 border-y-slate-100 border-r-slate-100 shadow-sm rounded-xl">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-blue-600">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{active.length}</p>
                <p className="text-sm font-semibold text-slate-400">Active</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 border-y-slate-100 border-r-slate-100 shadow-sm rounded-xl">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-emerald-600">
                <PackageCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{done.length}</p>
                <p className="text-sm font-semibold text-slate-400">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {statusMsg.message && (
          <div
            className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium border text-center ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {statusMsg.message}
          </div>
        )}

        {loading ? (
          <LoadingSpinner size="lg" className="py-20" />
        ) : orders.length === 0 ? (
          <Card className="border-slate-100 shadow-sm rounded-2xl">
            <CardContent className="p-12">
              <EmptyState
                icon={<Truck className="h-10 w-10 text-slate-300" />}
                title="No deliveries assigned"
                description="When you receive delivery assignments, they will appear here."
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-10">
            {STATUS_SECTIONS.map((section) => {
              const items = sectionOrders(section.statuses);
              const SectionIcon = section.icon;
              return (
                <section key={section.key} className="space-y-4">
                  <div className="flex items-center gap-2.5 pb-1">
                    <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg">
                      <SectionIcon className="h-4 w-4" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">{section.label}</h2>
                    <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-600 border border-slate-200/40 rounded-md px-2 py-0.5 font-semibold text-xs">
                      {items.length}
                    </Badge>
                  </div>

                  {items.length === 0 ? (
                    <Card className="bg-slate-50/40 border-slate-100/70 border-dashed rounded-xl">
                      <CardContent className="p-8">
                        <EmptyState
                          icon={<SectionIcon className="h-6 w-6 text-slate-300" />}
                          title={section.emptyMsg}
                          description={section.emptyDesc}
                        />
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3.5">
                      {items.map((delivery) => {
                        const statusConfig = STATUS_CONFIG[delivery.status] || STATUS_CONFIG.PENDING;
                        const StatusIcon = statusConfig.icon;
                        const firstItem = delivery.order.items[0]?.product;
                        return (
                          <Card key={delivery.id} className={`border-slate-100 border-l-4 ${section.accentColor} shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all duration-200 rounded-xl overflow-hidden`}>
                            <CardContent className="p-5">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                                <div className="flex-1 min-w-0 space-y-2.5">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="font-bold text-slate-900 tracking-tight text-base">
                                      Order #{delivery.order.id.slice(0, 8).toUpperCase()}
                                    </h3>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusConfig.className}`}>
                                      <StatusIcon className="h-3 w-3" />
                                      {delivery.status.replace(/_/g, ' ')}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                                    <p className="text-slate-500 truncate">
                                      <span className="font-semibold text-slate-700">Buyer:</span>{' '}
                                      <span className="text-slate-600 font-medium">{delivery.order.buyer.firstName} {delivery.order.buyer.lastName}</span>
                                      <span className="text-slate-400 font-normal ml-1">({delivery.order.buyer.phoneNumber})</span>
                                    </p>
                                    <p className="text-slate-500 truncate">
                                      <span className="font-semibold text-slate-700">Total:</span>{' '}
                                      <span className="text-blue-600 font-bold">${delivery.order.totalAmount.toFixed(2)}</span>
                                    </p>
                                    <p className="text-slate-500 truncate col-span-full flex items-start gap-1">
                                      <span className="font-semibold text-slate-700 shrink-0">Deliver to:</span>{' '}
                                      <span className="text-slate-600 font-medium truncate">{delivery.order.deliveryAddress}</span>
                                    </p>
                                    {firstItem && (
                                      <p className="text-slate-500 truncate col-span-full flex items-start gap-1">
                                        <span className="font-semibold text-slate-700 shrink-0">Pickup Shop:</span>{' '}
                                        <span className="text-slate-600 font-medium truncate">
                                          {firstItem.shop.name}
                                          {firstItem.shop.location?.city && (
                                            <span className="text-slate-400 font-normal"> &mdash; {firstItem.shop.location.city}</span>
                                          )}
                                        </span>
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Action Buttons Panel */}
                                <div className="flex flex-wrap items-center gap-2 bg-slate-50/80 md:bg-transparent p-3 md:p-0 rounded-xl border border-slate-100 md:border-none shrink-0 justify-end">
                                  {delivery.status === 'ASSIGNED' && (
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl h-9 px-4 shadow-sm gap-1.5 transition-all" onClick={() => updateStatus(delivery.order.id, 'accept')}>
                                      <CheckCircle2 className="h-4 w-4" />
                                      Accept
                                    </Button>
                                  )}
                                  {delivery.status === 'ACCEPTED' && (
                                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl h-9 px-4 shadow-sm gap-1.5 transition-all" onClick={() => updateStatus(delivery.order.id, 'pickup')}>
                                      <PackageCheck className="h-4 w-4" />
                                      Picked Up
                                    </Button>
                                  )}
                                  {delivery.status === 'PICKED_UP' && (
                                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl h-9 px-4 shadow-sm gap-1.5 transition-all" onClick={() => updateStatus(delivery.order.id, 'out-for-delivery')}>
                                      <Truck className="h-4 w-4" />
                                      Out for Delivery
                                    </Button>
                                  )}
                                  {delivery.status === 'OUT_FOR_DELIVERY' && (
                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl h-9 px-4 shadow-sm gap-1.5 transition-all" onClick={() => updateStatus(delivery.order.id, 'complete')}>
                                      <CheckCircle2 className="h-4 w-4" />
                                      Complete
                                    </Button>
                                  )}
                                  
                                  <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end mt-2 sm:mt-0">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold gap-1 shadow-sm"
                                      onClick={() => router.push(`/driver/orders/${delivery.order.id}`)}
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                      Details
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold gap-1 shadow-sm"
                                      onClick={() => router.push(`/driver/orders/${delivery.order.id}/chat`)}
                                    >
                                      <MessageSquare className="h-3.5 w-3.5" />
                                      Chat
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}