'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import api from '@/services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/loading-spinner';
import {
  Package,
  PackageCheck,
  Clock,
  Truck,
  MapPin,
  Phone,
  User,
  Store,
  CheckCircle2,
  Navigation,
  MapIcon,
  RefreshCw,
} from 'lucide-react';

interface TrackingData {
  id: string;
  status: string;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  runner: { id: string; firstName: string; lastName: string; phoneNumber: string } | null;
  order: {
    id: string;
    status: string;
    totalAmount: number;
    deliveryAddress: string;
    deliveryFee: number;
    paymentMethod: string;
    createdAt: string;
    buyer: { id: string; firstName: string; lastName: string };
  };
}

const STEPS = [
  { key: 'PENDING', label: 'Pending', icon: Clock },
  { key: 'ASSIGNED', label: 'Assigned', icon: User },
  { key: 'PICKED_UP', label: 'Picked Up', icon: PackageCheck },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
  { key: 'COMPLETED', label: 'Delivered', icon: CheckCircle2 },
];

const STEP_INDEX: Record<string, number> = {
  PENDING: 0,
  ASSIGNED: 1,
  PICKED_UP: 2,
  OUT_FOR_DELIVERY: 3,
  COMPLETED: 4,
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  ASSIGNED: 'bg-blue-50 text-blue-700 border-blue-200',
  PICKED_UP: 'bg-purple-50 text-purple-700 border-purple-200',
  OUT_FOR_DELIVERY: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-amber-600',
  ASSIGNED: 'text-blue-600',
  PICKED_UP: 'text-purple-600',
  OUT_FOR_DELIVERY: 'text-indigo-600',
  COMPLETED: 'text-emerald-600',
};

export default function TrackingPage() {
  const params = useParams();
  const orderId = params?.orderId as string;

  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTracking = useCallback(async () => {
    if (!orderId) return;
    try {
      const res = await api.get(`/delivery/track/${orderId}`);
      setTracking(res.data);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Delivery not found for this order.');
      } else {
        setError(err.response?.data?.message || 'Failed to load tracking information.');
      }
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchTracking();
  }, [fetchTracking]);

  useEffect(() => {
    if (!orderId) return;
    const interval = setInterval(fetchTracking, 15000);
    return () => clearInterval(interval);
  }, [orderId, fetchTracking]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !tracking) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12">
            <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Order not found</h2>
            <p className="text-sm font-semibold text-slate-400 mb-6">{error || 'No tracking data available.'}</p>
            <Button
              variant="outline"
              onClick={fetchTracking}
              className="rounded-xl border-slate-200 bg-white text-slate-600 font-semibold gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentStep = STEP_INDEX[tracking.status] ?? -1;
  const runner = tracking.runner;

  const getStatusStyle = (s: string) => STATUS_STYLES[s] || 'bg-slate-50 text-slate-700 border-slate-200';
  const getStatusColor = (s: string) => STATUS_COLORS[s] || 'text-slate-600';

  return (
    <div className="min-h-screen bg-[#f8fafc] antialiased">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Order #{tracking.order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-sm font-semibold text-slate-400 mt-1">
              Placed on {new Date(tracking.order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border uppercase tracking-wide shadow-sm ${getStatusStyle(tracking.status)}`}>
              {tracking.status.replace(/_/g, ' ')}
            </span>
            <Button
              variant="ghost"
              onClick={fetchTracking}
              className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 shadow-sm"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Stepper */}
        <Card className="mb-6 border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-2">
              {STEPS.map((step, i) => {
                const StepIcon = step.icon;
                const isActive = i <= currentStep;
                const isCurrent = i === currentStep;
                return (
                  <div key={step.key} className="flex flex-col md:flex-row items-center flex-1 last:flex-none w-full md:w-auto">
                    <div className="flex flex-row md:flex-col items-center gap-3 md:gap-0 w-full md:w-auto">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 transition-all shadow-sm ${
                          isActive
                            ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold'
                            : 'border-slate-100 bg-slate-50 text-slate-300'
                        } ${isCurrent ? 'ring-4 ring-blue-500/10' : ''}`}
                      >
                        <StepIcon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col md:items-center text-left md:text-center mt-0 md:mt-2">
                        <span className={`text-xs font-bold tracking-tight ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                          {step.label}
                        </span>
                      </div>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`hidden md:block flex-1 h-0.5 mx-4 min-w-[2rem] ${
                          i < currentStep ? 'bg-blue-600' : 'bg-slate-100'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {(tracking.pickedUpAt || tracking.deliveredAt) && (
              <>
                <Separator className="my-5 border-slate-100" />
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {tracking.pickedUpAt && (
                    <p>
                      <span className="text-slate-700 mr-1">Picked up:</span>{' '}
                      {new Date(tracking.pickedUpAt).toLocaleString()}
                    </p>
                  )}
                  {tracking.deliveredAt && (
                    <p>
                      <span className="text-slate-700 mr-1">Delivered:</span>{' '}
                      {new Date(tracking.deliveredAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Driver Info Card */}
        {runner ? (
          <Card className="mb-6 border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                Your Driver
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0">
                    {runner.firstName.charAt(0)}{runner.lastName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900 text-base">
                      {runner.firstName} {runner.lastName}
                    </p>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">Delivery Driver</p>
                  </div>
                </div>
                <a
                  href={`tel:${runner.phoneNumber}`}
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all"
                >
                  <Phone className="h-4 w-4" />
                  Call Driver
                </a>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-base">Awaiting Driver Assignment</p>
                  <p className="text-sm font-semibold text-slate-400 mt-0.5">
                    A driver will be assigned to your order shortly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pickup & Delivery Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Pickup - Shop */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Store className="h-4 w-4 text-blue-500" />
                Pickup Location
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-extrabold text-slate-900">Shop</p>
                  <p className="text-sm font-semibold text-slate-500 mt-1 leading-relaxed">
                    Pickup from the merchant store
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Destination */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-500" />
                Delivery Destination
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Navigation className="h-5 w-5 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-extrabold text-slate-900">
                    {tracking.order.buyer.firstName} {tracking.order.buyer.lastName}
                  </p>
                  <p className="text-sm font-semibold text-slate-500 mt-1 leading-relaxed">
                    {tracking.order.deliveryAddress}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <Card className="mb-6 border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Package className="h-4 w-4 text-slate-500" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wide">Total Amount</span>
                <p className="font-black text-blue-600 text-lg mt-0.5">${tracking.order.totalAmount.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wide">Delivery Fee</span>
                <p className="font-extrabold text-slate-800 text-lg mt-0.5">${tracking.order.deliveryFee.toFixed(2)}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wide">Payment Method</span>
                <p className="font-extrabold text-slate-800 text-lg mt-0.5 capitalize">{tracking.order.paymentMethod.replace(/_/g, ' ').toLowerCase()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auto-refresh indicator */}
        <p className="text-center text-xs font-semibold text-slate-400 flex items-center justify-center gap-1.5">
          <RefreshCw className="h-3 w-3" />
          Updates automatically every 15 seconds
        </p>
      </div>
    </div>
  );
}
