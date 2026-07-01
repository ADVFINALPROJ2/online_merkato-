'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/loading-spinner';
import { EmptyState } from '@/components/empty-state';
import {
  Truck,
  Package,
  PackageCheck,
  MapPin,
  User,
  Phone,
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  UserCheck,
} from 'lucide-react';

interface SellerDelivery {
  id: string;
  orderId: string;
  status: string;
  order: {
    id: string;
    totalAmount: number;
    deliveryAddress: string;
    deliveryFee: number;
    status: string;
    createdAt: string;
    buyer: {
      id: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
    };
  };
  runner: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  } | null;
}

interface AvailableDriver {
  id: string;
  userId: string;
  status: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  _count: {
    driverDeliveries: number;
  };
}

const STATUS_BADGE: Record<string, { variant: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline'; label: string }> = {
  PENDING: { variant: 'warning', label: 'Pending' },
  ASSIGNED: { variant: 'default', label: 'Assigned' },
  ACCEPTED: { variant: 'secondary', label: 'Accepted' },
  PICKED_UP: { variant: 'outline', label: 'Picked Up' },
  OUT_FOR_DELIVERY: { variant: 'warning', label: 'Out for Delivery' },
  COMPLETED: { variant: 'success', label: 'Completed' },
};

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
] as const;

type FilterTab = (typeof FILTER_TABS)[number]['key'];

export default function SellerDeliveryPage() {
  const [deliveries, setDeliveries] = useState<SellerDelivery[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<AvailableDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [selectedDrivers, setSelectedDrivers] = useState<Record<string, string>>({});
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    Promise.all([fetchDeliveries(), fetchDrivers()]).finally(() => setLoading(false));
  }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await api.get('/delivery/seller/orders');
      setDeliveries(res.data);
    } catch {
      setStatusMsg({ type: 'error', message: 'Failed to load deliveries.' });
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await api.get('/delivery/drivers/available');
      setAvailableDrivers(res.data);
    } catch {
      setStatusMsg({ type: 'error', message: 'Failed to load available drivers.' });
    }
  };

  const handleAssign = async (orderId: string) => {
    const driverUserId = selectedDrivers[orderId];
    if (!driverUserId) return;
    setAssigningId(orderId);
    setStatusMsg(null);
    try {
      await api.post('/delivery/assign', { orderId, driverUserId });
      setStatusMsg({ type: 'success', message: 'Driver assigned successfully!' });
      setSelectedDrivers((prev) => ({ ...prev, [orderId]: '' }));
      await Promise.all([fetchDeliveries(), fetchDrivers()]);
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Failed to assign driver.',
      });
    } finally {
      setAssigningId(null);
    }
  };

  const filteredDeliveries = deliveries.filter((d) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return !d.runner;
    if (activeTab === 'active') return d.runner && d.status !== 'COMPLETED';
    if (activeTab === 'completed') return d.status === 'COMPLETED';
    return true;
  });

  const tabCounts = {
    all: deliveries.length,
    pending: deliveries.filter((d) => !d.runner).length,
    active: deliveries.filter((d) => d.runner && d.status !== 'COMPLETED').length,
    completed: deliveries.filter((d) => d.status === 'COMPLETED').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center antialiased">
        <LoadingSpinner size="lg" className="py-20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] antialiased">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100/50 shadow-sm">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Deliveries</h1>
              <p className="text-sm font-medium text-slate-400 mt-0.5">
                {deliveries.length} delivery{deliveries.length !== 1 ? 'ies' : 'y'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-xl border-slate-200 text-slate-600 gap-1.5"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </div>

        {/* Status message */}
        {statusMsg && (
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

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-slate-400 border-y-slate-100 border-r-slate-100 shadow-sm rounded-xl">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-slate-600">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{tabCounts.all}</p>
                <p className="text-sm font-semibold text-slate-400">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500 border-y-slate-100 border-r-slate-100 shadow-sm rounded-xl">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-amber-600">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{tabCounts.pending}</p>
                <p className="text-sm font-semibold text-slate-400">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500 border-y-slate-100 border-r-slate-100 shadow-sm rounded-xl">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-blue-600">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{tabCounts.active}</p>
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
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{tabCounts.completed}</p>
                <p className="text-sm font-semibold text-slate-400">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-6 bg-white p-1 rounded-xl border border-slate-100 shadow-sm w-fit">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-bold ${
                  activeTab === tab.key
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tabCounts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Delivery list */}
        {filteredDeliveries.length === 0 ? (
          <Card className="border-slate-100 shadow-sm rounded-2xl">
            <CardContent className="p-12">
              <EmptyState
                icon={<Truck className="h-10 w-10 text-slate-300" />}
                title={
                  activeTab === 'pending'
                    ? 'No pending deliveries'
                    : activeTab === 'active'
                      ? 'No active deliveries'
                      : activeTab === 'completed'
                        ? 'No completed deliveries'
                        : 'No deliveries found'
                }
                description={
                  activeTab === 'pending'
                    ? 'All your orders have been assigned to drivers.'
                    : activeTab === 'active'
                      ? 'There are no deliveries in progress right now.'
                      : activeTab === 'completed'
                        ? 'Completed deliveries will appear here.'
                        : 'Deliveries for your shop will appear here once orders are placed.'
                }
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3.5">
            {filteredDeliveries.map((delivery) => {
              const badge = STATUS_BADGE[delivery.status] || STATUS_BADGE.PENDING;
              return (
                <Card
                  key={delivery.id}
                  className="border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all duration-200 rounded-xl overflow-hidden"
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                      <div className="flex-1 min-w-0 space-y-3">
                        {/* Top row: Order ID + Status */}
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-900 tracking-tight text-base">
                            Order #{delivery.order.id.slice(0, 8).toUpperCase()}
                          </h3>
                          <Badge variant={badge.variant} className="rounded-md">
                            {badge.label}
                          </Badge>
                        </div>

                        {/* Buyer info */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-sm">
                          <span className="text-slate-500 inline-flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            <span className="font-semibold text-slate-700">
                              {delivery.order.buyer.firstName} {delivery.order.buyer.lastName}
                            </span>
                          </span>
                          <span className="text-slate-500 inline-flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            <span>{delivery.order.buyer.phoneNumber}</span>
                          </span>
                        </div>

                        {/* Address + Amount */}
                        <div className="flex flex-wrap items-start gap-x-6 gap-y-1.5 text-sm">
                          <span className="text-slate-500 inline-flex items-start gap-1.5 max-w-md">
                            <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                            <span className="text-slate-600">{delivery.order.deliveryAddress}</span>
                          </span>
                          <span className="text-slate-500 inline-flex items-center gap-1.5 font-medium">
                            <span className="text-slate-400">Total:</span>
                            <span className="text-blue-600 font-bold">
                              ${delivery.order.totalAmount.toFixed(2)}
                            </span>
                          </span>
                        </div>

                        <Separator className="my-2" />

                        {/* Driver section */}
                        {delivery.runner ? (
                          <div className="inline-flex items-center gap-2 text-sm bg-emerald-50 border border-emerald-100 rounded-xl px-3.5 py-2">
                            <UserCheck className="h-4 w-4 text-emerald-600" />
                            <span className="font-semibold text-emerald-700">Driver:</span>
                            <span className="text-emerald-600 font-medium">
                              {delivery.runner.firstName} {delivery.runner.lastName}
                            </span>
                            <span className="text-emerald-400">({delivery.runner.phoneNumber})</span>
                          </div>
                        ) : (
                          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 space-y-3">
                            <p className="text-sm font-semibold text-amber-700 inline-flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              No driver assigned yet
                            </p>
                            {availableDrivers.length > 0 ? (
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                                <div className="flex-1 min-w-0">
                                  <Select
                                    value={selectedDrivers[delivery.orderId] || ''}
                                    onValueChange={(val) =>
                                      setSelectedDrivers((prev) => ({
                                        ...prev,
                                        [delivery.orderId]: val,
                                      }))
                                    }
                                  >
                                    <SelectTrigger className="h-10 rounded-lg border-amber-200 bg-white text-sm">
                                      <SelectValue placeholder="Select a driver..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {availableDrivers.map((driver) => (
                                        <SelectItem key={driver.userId} value={driver.userId}>
                                          {driver.user.firstName} {driver.user.lastName} &mdash;{' '}
                                          {driver._count.driverDeliveries} active
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button
                                  size="sm"
                                  className="h-10 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-1.5 shrink-0"
                                  disabled={!selectedDrivers[delivery.orderId]}
                                  loading={assigningId === delivery.orderId}
                                  onClick={() => handleAssign(delivery.orderId)}
                                >
                                  <UserCheck className="h-4 w-4" />
                                  Assign
                                </Button>
                              </div>
                            ) : (
                              <p className="text-xs text-amber-500 font-medium">
                                No available drivers at the moment.
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right action */}
                      <div className="flex items-center lg:self-center shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold gap-1 shadow-sm"
                          onClick={() => router.push(`/dashboard/orders/${delivery.order.id}`)}
                        >
                          View Order
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
