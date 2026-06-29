"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ShoppingBag, CreditCard, ChevronRight } from 'lucide-react';
import { PaymentSelector } from '@/components/PaymentSelector';

export default function CheckoutPage() {
  const router = useRouter();
  
  // State for Tasks #33, #35
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  
  // Task #36: Delivery Fee Calculation Constants
  const itemTotal = 1290;
  const deliveryFee = address.trim().toLowerCase() === 'addis ababa' ? 50 : 150;
  const grandTotal = itemTotal + deliveryFee;

  // Task #28: Place Order Handler
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      alert("Please specify a delivery address first.");
      return;
    }
    
    // Smoothly routes directly to your capital "O" Orders tracking tab!
    router.push('/Orders');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-stone-900 mb-8">Checkout Checkout</h1>
      
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: Inputs */}
        <div className="space-y-6">
          {/* Task #35: Delivery Address Section */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-amber-600" /> 1. Delivery Location (#35)
            </h2>
            <input
              type="text"
              placeholder="e.g., Addis Ababa, Bole Atlas"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600 text-sm"
              required
            />
            <p className="text-xs text-stone-400 mt-2">
              Tip: Type "Addis Ababa" to trigger discounted regional delivery pricing!
            </p>
          </div>

          {/* Task #33: Select Payment Method Section */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-amber-600" /> 2. Payment Method (#33)
            </h2>
            <PaymentSelector onMethodChange={(method) => setPaymentMethod(method)} />
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary & Calculations */}
        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 h-fit space-y-6">
          <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" /> Order Summary
          </h2>

          <div className="space-y-3 border-b border-stone-200 pb-4 text-sm font-medium text-stone-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="text-stone-900">Br {itemTotal}</span>
            </div>
            {/* Task #36: Live Fee Calculation display */}
            <div className="flex justify-between">
              <span>Delivery Fee (#36)</span>
              <span className="text-stone-900">Br {deliveryFee}</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-lg font-bold text-stone-900">
            <span>Total to Pay</span>
            <span className="text-amber-600 text-xl">Br {grandTotal}</span>
          </div>

          {/* Task #28: Submit Button */}
          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            Place Secure Order (#28)
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
}