'use client';

import { useSearchParams } from 'next/navigation';
import { Clock, CheckCircle2, Truck, PackageCheck, MapPin, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type ProgressStatus = 'PENDING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED';

const mockTrackedOrder = {
  id: 'ORD-1042',
  status: 'IN_TRANSIT' as ProgressStatus,
  courier: 'Daniel M.',
  courierPhone: '+251 911 234 567',
  location: 'Bole, Addis Ababa',
  items: [{ name: 'Yirgacheffe Coffee 500g', qty: 2 }],
  history: [
    { label: 'Order placed', time: 'Jun 30, 9:02 AM', done: true },
    { label: 'Confirmed by seller', time: 'Jun 30, 9:18 AM', done: true },
    { label: 'Out for delivery', time: 'Jun 30, 11:40 AM', done: true },
    { label: 'Delivered', time: 'Pending', done: false },
  ],
};

export default function OrderTrackingPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id') || mockTrackedOrder.id;

  const steps: { key: ProgressStatus; label: string; icon: React.ElementType }[] = [
    { key: 'PENDING', label: 'Pending', icon: Clock },
    { key: 'CONFIRMED', label: 'Assigned', icon: CheckCircle2 },
    { key: 'IN_TRANSIT', label: 'In Transit', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: PackageCheck },
  ];
  const stepOrder: ProgressStatus[] = ['PENDING', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED'];
  const currentStep = stepOrder.indexOf(mockTrackedOrder.status);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Track Order</h1>
        <p className="text-stone-500 text-sm mt-1">
          Order <span className="font-mono font-semibold text-stone-700">{orderId}</span>
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative flex justify-between items-center max-w-xl mx-auto mb-6 mt-2">
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-stone-100 -z-10" />
            <div
              className="absolute top-4 left-4 h-0.5 bg-blue-600 -z-10 transition-all duration-500"
              style={{ width: `${(Math.max(0, currentStep) / 3) * 100}%` }}
            />
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isDone = currentStep >= index;
              return (
                <div key={step.key} className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isDone ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-stone-200 text-stone-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium mt-2 text-stone-500 uppercase tracking-wider">
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Courier Section Wrapper */}
          <div className="rounded-xl bg-stone-50 p-4 flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-stone-900">{mockTrackedOrder.courier}</p>
              <p className="text-xs text-stone-500">Your courier</p>
            </div>
            
            <a 
              href={`tel:${mockTrackedOrder.courierPhone}`}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg"
            >
              <Phone className="h-3.5 w-3.5" />
              Call
            </a>
          </div> {/* 💡 FIXED: Closed this div layout beautifully right here! */}

          <div className="border border-stone-100 rounded-xl overflow-hidden mb-6">
            <div className="bg-stone-100 px-4 py-2 text-xs font-bold text-stone-700 uppercase tracking-wider flex justify-between">
              <span>Live Tracking Map</span>
              <span className="text-blue-600 animate-pulse">● Live</span>
            </div>
            <div className="h-56 w-full bg-sky-50 relative flex items-center justify-center border-t border-stone-100">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="text-center z-10 p-4">
                <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-bounce" />
                <p className="text-sm font-semibold text-stone-700">En route to {mockTrackedOrder.location}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">Order history</p>
            <div className="space-y-3">
              {mockTrackedOrder.history.map((h, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${h.done ? 'bg-blue-600' : 'bg-stone-200'}`} />
                  <span className={`text-sm flex-1 ${h.done ? 'text-stone-700 font-medium' : 'text-stone-400'}`}>
                    {h.label}
                  </span>
                  <span className="text-xs text-stone-400">{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}