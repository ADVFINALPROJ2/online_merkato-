"use client";

import React, { useState } from 'react';
import { Clock, CheckCircle2, Truck, PackageCheck, XCircle, MapPin } from 'lucide-react';

type ProgressStatus = 'PENDING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

interface MockOrder {
  id: string;
  date: string;
  total: number;
  status: ProgressStatus;
  items: { name: string; qty: number; description: string }[];
  courier: string;
  location: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<MockOrder[]>([
    {
      id: 'ORD-1042',
      date: '2026-06-06',
      total: 1040,
      status: 'IN_TRANSIT',
      courier: 'Daniel M.',
      location: 'Bole, Addis Ababa',
      items: [
        { name: 'Yirgacheffe Coffee 500g', qty: 2, description: 'Sidamo Beans' }
      ]
    }
  ]);

  const handleCancelOrder = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'CANCELLED' } : o));
  };

  const handleConfirmDelivery = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'DELIVERED' } : o));
  };

  const getStatusStep = (status: ProgressStatus) => {
    const steps: ProgressStatus[] = ['PENDING', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED'];
    return steps.indexOf(status);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">My orders</h1>
        <p className="text-slate-500 mb-8">Track every step from order to doorstep.</p>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-16 text-center bg-white">
            <p className="text-slate-400 text-lg">No orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const currentStep = getStatusStep(order.status);
              return (
                <div key={order.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  
                  {/* Header Information */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-2 mb-6">
                    <div>
                      <span className="text-xs font-bold text-blue-600 font-mono bg-blue-50 px-2.5 py-1 rounded-md">
                        {order.id}
                    </span>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
                        <MapPin className="w-3 h-3" />
                        <span>{order.location} • {order.date}</span>
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        order.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Product Box Display */}
                  <div className="bg-slate-50 rounded-xl p-4 mb-6 flex justify-between items-center">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex flex-col">
                        <span className="font-semibold text-slate-800">{item.name}</span>
                        <span className="text-xs text-slate-500">Qty {item.qty} · {item.description}</span>
                      </div>
                    ))}
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Total</span>
                      <span className="font-bold text-slate-900">Br {order.total}</span>
                    </div>
                  </div>

                  {/* Timeline UI Component */}
                  {order.status === 'CANCELLED' ? (
                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-xl mb-6">
                      <XCircle className="w-5 h-5" />
                      <span>Order Cancelled</span>
                    </div>
                  ) : (
                    <div className="mb-8">
                      <div className="relative flex justify-between items-center max-w-xl mx-auto mb-4 mt-4">
                        <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-100 -z-10" />
                        <div 
                          className="absolute top-4 left-4 h-0.5 bg-blue-600 -z-10 transition-all duration-500" 
                          style={{ width: `${(Math.max(0, currentStep) / 3) * 100}%` }}
                        />

                        {/* Timeline Steps */}
                        {['Pending', 'Assigned', 'In Transit', 'Delivered'].map((label, index) => {
                          const Icons = [Clock, CheckCircle2, Truck, PackageCheck];
                          const StepIcon = Icons[index];
                          const isDone = currentStep >= index;
                          const isCurrentDelivered = order.status === 'DELIVERED' && index === 3;

                          return (
                            <div key={label} className="flex flex-col items-center">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                                isCurrentDelivered ? 'bg-green-600 border-green-600 text-white' :
                                isDone ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-400'
                              }`}>
                                <StepIcon className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-medium mt-2 text-slate-500 uppercase tracking-wider text-[10px]">{label}</span>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-slate-500 max-w-xl mx-auto px-4">Courier: <span className="font-semibold text-slate-700">{order.courier}</span></p>
                    </div>
                  )}

                  {/* Live Tracking Map Integration Layout */}
                  {order.status !== 'CANCELLED' && (
                    <div className="mt-6 border border-slate-100 rounded-xl overflow-hidden shadow-inner">
                      <div className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 uppercase tracking-wider flex justify-between">
                        <span>Live Tracking Map</span>
                        <span className="text-blue-600 animate-pulse">● Live</span>
                      </div>
                      
                      <div className="h-64 w-full bg-sky-50 relative flex items-center justify-center border-t border-slate-100">
                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
                        <div className="text-center z-10 p-4">
                          <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-bounce" />
                          <p className="text-sm font-semibold text-slate-700">Displaying route in Addis Ababa</p>
                          <p className="text-xs text-slate-400">Tracking courier package en route to Bole</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Interactive State Actions */}
                  <div className="flex justify-end gap-3 border-t border-slate-50 pt-4 mt-6">
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 px-4 py-2 rounded-xl transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                    {order.status === 'IN_TRANSIT' && (
                      <button
                        onClick={() => handleConfirmDelivery(order.id)}
                        className="text-xs font-semibold text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl transition-colors shadow-sm"
                      >
                        Confirm Delivery
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}