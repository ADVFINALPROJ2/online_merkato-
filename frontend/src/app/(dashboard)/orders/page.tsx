"use client";

import React, { useState } from 'react';
import { Clock, CheckCircle2, Truck, PackageCheck, XCircle } from 'lucide-react';

type ProgressStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

interface MockOrder {
  id: string;
  date: string;
  total: number;
  status: ProgressStatus;
  items: string[];
}

export default function MyOrdersPage() {
  // Start with an empty array [] if you want to test the empty state.
  // Change to include data below to see what it looks like "when it has orders".
  const [orders, setOrders] = useState<MockOrder[]>([]);

  const handleCancelOrder = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'CANCELLED' } : o));
  };

  const handleConfirmDelivery = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'DELIVERED' } : o));
  };

  const getStatusStep = (status: ProgressStatus) => {
    const steps: ProgressStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
    return steps.indexOf(status);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">My orders</h1>
      <p className="text-slate-500 mb-8">Track every step from order to doorstep.</p>

      {/* Conditional Rendering: Checking if we have orders */}
      {orders.length === 0 ? (
        /* YOUR EXACT EMPTY STATE (From image_a76dc2.png) */
        <div className="rounded-2xl border border-dashed border-slate-200 p-16 text-center bg-white/50">
          <p className="text-slate-400 text-lg">No orders yet.</p>
        </div>
      ) : (
        /* STATE WHEN ORDERS EXIST */
        <div className="space-y-6">
          {orders.map(order => {
            const currentStep = getStatusStep(order.status);
            return (
              <div key={order.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-2 mb-6">
                  <div>
                    <span className="text-xs font-bold text-blue-600 font-mono bg-blue-50 px-2.5 py-1 rounded-md">
                      {order.id}
                    </span>
                    <p className="text-xs text-slate-400 mt-2">Placed on {order.date}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xs text-slate-400">Total Amount</p>
                    <p className="text-xl font-bold text-slate-900">Br {order.total}</p>
                  </div>
                </div>

                {/* Timeline UI Component */}
                {order.status === 'CANCELLED' ? (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-xl mb-6">
                    <XCircle className="w-5 h-5" />
                    <span>Order Cancelled</span>
                  </div>
                ) : (
                  <div className="relative flex justify-between items-center max-w-xl mx-auto mb-8 mt-4">
                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-100 -z-10" />
                    <div 
                      className="absolute top-4 left-4 h-0.5 bg-blue-600 -z-10 transition-all duration-500" 
                      style={{ width: `${(Math.max(0, currentStep) / 3) * 100}%` }}
                    />

                    {/* Timeline Steps */}
                    {['Pending', 'Confirmed', 'Shipped', 'Delivered'].map((label, index) => {
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
                          <span className="text-xs font-medium mt-2 text-slate-600">{label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Action Items (#29 & #32) */}
                <div className="flex justify-end gap-3 border-t border-slate-50 pt-4">
                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 px-4 py-2 rounded-xl transition-colors"
                    >
                      Cancel Order (#29)
                    </button>
                  )}
                  {order.status === 'SHIPPED' && (
                    <button
                      onClick={() => handleConfirmDelivery(order.id)}
                      className="text-xs font-semibold text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl transition-colors shadow-sm"
                    >
                      Confirm Delivery (#32)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}