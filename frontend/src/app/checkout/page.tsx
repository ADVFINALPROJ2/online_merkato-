'use client';

import '../globals.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Smartphone, CreditCard, Landmark, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type PaymentMethod = 'telebirr' | 'card' | 'cbe' | 'mpesa';

interface CartItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  image: string;
}

const paymentMethods: { id: PaymentMethod; label: string; sub: string; icon: React.ElementType; iconBg: string }[] = [
  { id: 'telebirr', label: 'Telebirr', sub: 'Mobile Money', icon: Smartphone, iconBg: 'bg-amber-500' },
  { id: 'card', label: 'Credit / Debit Card', sub: 'Visa · Mastercard', icon: CreditCard, iconBg: 'bg-blue-600' },
  { id: 'cbe', label: 'CBE Birr', sub: 'Bank Transfer', icon: Landmark, iconBg: 'bg-emerald-600' },
  { id: 'mpesa', label: 'M-Pesa', sub: 'Mobile Money', icon: Smartphone, iconBg: 'bg-green-600' },
];

export default function PaymentPage() {
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>('telebirr');
  const [mobileNumber, setMobileNumber] = useState('0911 234 567');
  const [email, setEmail] = useState('demo@merkato.et');
  const [address, setAddress] = useState('Bole, Addis Ababa');
  const [isPaying, setIsPaying] = useState(false);

  // 💡 TRACKING CAPABILITIES: Set to an empty array so it is empty by default
  // NOTE: If you have a custom hook context like const { cart } = useCart(); swap it here!
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = cartItems.length > 0 ? 60 : 0; // Only charge delivery if items exist
  const total = subtotal + delivery;

  const handlePay = async () => {
    if (cartItems.length === 0) return;
    setIsPaying(true);
    // replace with real Chapa initialize call to backend, then redirect to checkout_url
    await new Promise((r) => setTimeout(r, 1200));
    const txRef = `tx-${Date.now()}`;
    router.push(`/orders/confirmation?tx=${txRef}`);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Top Secure Banner Header */}
      <div className="overflow-hidden rounded-2xl bg-slate-900 px-6 py-5 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-600 font-bold">
            C
          </div>
          <div>
            <p className="text-white font-semibold leading-tight">chapa</p>
          </div>
          <div className="ml-4 border-l border-slate-700 pl-4">
            <p className="text-white font-semibold leading-tight">Secure Checkout</p>
            <p className="text-slate-400 text-xs">Powered by Chapa Payments</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400">
          <Lock className="h-3 w-3" />
          256-bit SSL
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Forms Field Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                  Choose a payment method
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((pm) => {
                    const Icon = pm.icon;
                    const selected = method === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setMethod(pm.id)}
                        className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                          selected
                            ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${pm.iconBg} text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-stone-900">{pm.label}</p>
                          <p className="text-xs text-stone-500">{pm.sub}</p>
                        </div>
                        <span
                          className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                            selected ? 'border-blue-600 bg-blue-600' : 'border-stone-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {(method === 'telebirr' || method === 'mpesa') && (
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1.5 block">Mobile money number</label>
                  <Input value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                  <p className="text-xs text-stone-400 mt-1.5">You&apos;ll receive a USSD prompt to confirm payment.</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-stone-700 mb-1.5 block">Receipt email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
              </div>

              <div>
                <label className="text-sm font-medium text-stone-700 mb-1.5 block">Delivery address</label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Side panel */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold text-stone-900 mb-4">Order summary</h2>
              
              {/* Dynamic display logic handles empty carts */}
              {cartItems.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-stone-200 rounded-xl bg-stone-50/50 px-4">
                  <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-stone-600">Your cart is empty</p>
                  <p className="text-xs text-stone-400 mt-0.5">No products currently selected for purchase.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 rounded-lg bg-stone-100 border border-stone-200" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-900 truncate">{item.name}</p>
                        <p className="text-xs text-stone-400">Qty {item.qty}</p>
                      </div>
                      <p className="text-sm font-semibold text-stone-900">Br {item.price * item.qty}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-stone-100 mt-5 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Subtotal</span>
                  <span>Br {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Delivery</span>
                  <span>Br {delivery}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-100">
                  <span className="font-bold text-stone-900">Total</span>
                  <span className="font-bold text-blue-600 text-lg">Br {total.toLocaleString()}</span>
                </div>
              </div>

              <Button
                onClick={handlePay}
                disabled={cartItems.length === 0}
                loading={isPaying}
                className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="h-4 w-4" />
                {cartItems.length === 0 ? 'Cart Empty' : `Pay Br ${total.toLocaleString()} with Chapa`}
              </Button>
              <p className="text-center text-xs text-stone-400 mt-2">
                Prototype: no real payment is processed.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}