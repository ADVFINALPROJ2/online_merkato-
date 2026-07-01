'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/loading-spinner';
import {
  ArrowLeft,
  MapPin,
  Store,
  User,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  Navigation,
  Phone,
  MapIcon,
  MessageSquare,
} from 'lucide-react';

interface DeliveryDetail {
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
    paymentMethod: string;
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
          contactPhone: string | null;
          location: {
            region: string;
            city: string | null;
            subCity: string | null;
            woreda: string | null;
            terra: string | null;
            landmark: string | null;
            latitude: number | null;
            longitude: number | null;
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

const STEPS = [
  { key: 'ASSIGNED', label: 'Assigned', icon: Clock },
  { key: 'ACCEPTED', label: 'Accepted', icon: CheckCircle2 },
  { key: 'PICKED_UP', label: 'Picked Up', icon: PackageCheck },
  { key: 'OUT_FOR_DELIVERY', label: 'In Transit', icon: Truck },
  { key: 'COMPLETED', label: 'Delivered', icon: CheckCircle2 },
];

const STEP_INDEX: Record<string, number> = {
  ASSIGNED: 0,
  ACCEPTED: 1,
  PICKED_UP: 2,
  OUT_FOR_DELIVERY: 3,
  COMPLETED: 4,
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [delivery, setDelivery] = useState<DeliveryDetail | null>(null);
  const [status, setStatus] = useState<{ type: string; message: string }>({ type: '', message: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/delivery/orders/${id}`);
      setDelivery(res.data);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to load order details.' });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (action: string) => {
    try {
      const res = await api.patch(`/delivery/orders/${id}/${action}`);
      if (res.status === 200 || res.status === 201) {
        setStatus({ type: 'success', message: `Status updated successfully!` });
        fetchDetails();
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Update failed.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-8">
        <div className="mx-auto max-w-3xl">
          <Button variant="ghost" onClick={() => router.push('/driver/dashboard')} className="mb-4 gap-2 border border-slate-200 bg-white text-slate-600 rounded-xl">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          {status.message && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 text-sm font-semibold text-center shadow-sm">
              {status.message}
            </div>
          )}
        </div>
      </div>
    );
  }

  const shop = delivery.order.items[0]?.product.shop;
  const loc = shop?.location;
  const currentStep = STEP_INDEX[delivery.status] ?? -1;

  const getStatusBadgeStyles = (s: string) => {
    switch (s) {
      case 'ASSIGNED': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ACCEPTED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PICKED_UP': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'OUT_FOR_DELIVERY': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] antialiased">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Navigation Action bar */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/driver/dashboard')} 
            className="h-10 rounded-xl px-4 border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold gap-1.5 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide shadow-sm ${getStatusBadgeStyles(delivery.status)}`}>
            {delivery.status.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Dynamic Title and Details Info */}
        <div className="mb-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Order #{delivery.order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-sm font-semibold text-slate-400 mt-1">
              Consignment Bundle: {delivery.order.items.length} item{delivery.order.items.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">Total Compensation</span>
            <span className="text-2xl font-black text-blue-600">${delivery.order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {status.message && (
          <div
            className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium border text-center shadow-sm ${
              status.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {status.message}
          </div>
        )}

        {/* Route Progress Tracking Map */}
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

            {(delivery.pickedUpAt || delivery.deliveredAt) && (
              <>
                <Separator className="my-5 border-slate-100" />
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {delivery.pickedUpAt && (
                    <p>
                      <span className="text-slate-700 mr-1">Manifest Loaded:</span>{' '}
                      {new Date(delivery.pickedUpAt).toLocaleString()}
                    </p>
                  )}
                  {delivery.deliveredAt && (
                    <p>
                      <span className="text-slate-700 mr-1">Fulfillment Closed:</span>{' '}
                      {new Date(delivery.deliveredAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Logistics Side-by-Side Node Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Pickup Shop Card */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Store className="h-4 w-4 text-blue-500" />
                Pickup Distribution Hub
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-sm">
              <div>
                <p className="font-extrabold text-slate-900 text-base">{shop?.name}</p>
                {loc && (
                  <div className="mt-2 space-y-1 text-slate-500 font-medium leading-relaxed">
                    <p className="text-slate-700 font-bold">{loc.region}{loc.city ? `, ${loc.city}` : ''}</p>
                    <p><span className="text-slate-400 font-semibold">Sub City:</span> {loc.subCity || 'N/A'}</p>
                    <p><span className="text-slate-400 font-semibold">Woreda:</span> {loc.woreda || 'N/A'}</p>
                    <p><span className="text-slate-400 font-semibold">Mesa / Terra:</span> {loc.terra || 'N/A'}</p>
                    <p><span className="text-slate-400 font-semibold">Landmark:</span> {loc.landmark || 'N/A'}</p>
                  </div>
                )}
              </div>
              
              <Separator className="border-slate-100" />
              
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Merchant Contact</span>
                  <p className="font-bold text-slate-700 truncate">{shop?.seller.firstName} {shop?.seller.lastName}</p>
                </div>
                <a 
                  href={`tel:${shop?.seller.phoneNumber}`}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-bold shadow-sm shrink-0"
                >
                  <Phone className="h-3.5 w-3.5 text-blue-500" />
                  Call Hub
                </a>
              </div>

              {loc?.latitude && loc?.longitude ? (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-10 px-4 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 font-bold hover:bg-blue-100/70 transition-colors text-xs mt-2 shadow-sm"
                >
                  <MapIcon className="h-4 w-4" />
                  Launch GPS Navigation &rarr;
                </a>
              ) : (
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                  <MapPin className="h-4 w-4 text-slate-300" />
                  Precise coordinates unmapped. Use text details.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Drop-off Card */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-500" />
                Customer Delivery Target
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-extrabold text-slate-900 text-base">
                    {delivery.order.buyer.firstName} {delivery.order.buyer.lastName}
                  </p>
                  <span className="text-xs font-medium text-slate-400 block mt-0.5">Consignee Buyer</span>
                </div>
                <a 
                  href={`tel:${delivery.order.buyer.phoneNumber}`}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-bold shadow-sm shrink-0"
                >
                  <Phone className="h-3.5 w-3.5 text-indigo-500" />
                  Call Buyer
                </a>
              </div>
              
              <Separator className="border-slate-100" />
              
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Destination Address</span>
                <div className="flex items-start gap-2 text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <span className="font-semibold leading-relaxed text-slate-700">{delivery.order.deliveryAddress}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Core Cargo Invoicing Grid */}
        <Card className="mb-6 border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Package className="h-4 w-4 text-slate-500" />
              Waybill Order Manifesto
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm bg-slate-50/50 p-4 rounded-xl border border-slate-100 mb-5">
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wide">Item Count</span>
                <p className="font-extrabold text-slate-800 text-lg mt-0.5">{delivery.order.items.length}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wide">Delivery Fee</span>
                <p className="font-extrabold text-slate-800 text-lg mt-0.5">${delivery.order.deliveryFee.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wide">Total Value</span>
                <p className="font-black text-blue-600 text-lg mt-0.5">${delivery.order.totalAmount.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wide">Payment Terms</span>
                <p className="font-extrabold text-slate-800 text-lg mt-0.5 truncate">{delivery.order.paymentMethod}</p>
              </div>
            </div>

            {delivery.order.items.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Itemized Cargo Rollout</span>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {delivery.order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        {item.product.imageUrl && (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="h-11 w-11 rounded-lg object-cover border border-slate-100 shrink-0 shadow-sm"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate text-sm">{item.product.name}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-0.5">SKU Unit Verified</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-slate-700 shrink-0">${item.product.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Core Global Action Button Control Panel */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {delivery.status === 'ASSIGNED' && (
            <Button size="lg" className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 gap-2 transition-all active:scale-[0.99]" onClick={() => updateStatus('accept')}>
              <CheckCircle2 className="h-5 w-5" />
              Accept Assignment
            </Button>
          )}
          {delivery.status === 'ACCEPTED' && (
            <Button size="lg" className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 gap-2 transition-all active:scale-[0.99]" onClick={() => updateStatus('pickup')}>
              <PackageCheck className="h-5 w-5" />
              Confirm Cargo Pickup
            </Button>
          )}
          {delivery.status === 'PICKED_UP' && (
            <Button size="lg" className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 gap-2 transition-all active:scale-[0.99]" onClick={() => updateStatus('out-for-delivery')}>
              <Truck className="h-5 w-5" />
              Initialize Transit Route
            </Button>
          )}
          {delivery.status === 'OUT_FOR_DELIVERY' && (
            <Button size="lg" className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 gap-2 transition-all active:scale-[0.99]" onClick={() => updateStatus('complete')}>
              <CheckCircle2 className="h-5 w-5" />
              Complete Delivery Drop-off
            </Button>
          )}
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push(`/driver/orders/${delivery.order.id}/chat`)}
            className="h-12 px-6 rounded-xl border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-bold gap-2 shadow-sm"
          >
            <MessageSquare className="h-5 w-5 text-blue-500" />
            Open Routing Chat
          </Button>
        </div>
      </div>
    </div>
  );
}