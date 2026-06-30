'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { cartService } from '@/services/cart-service';
import { useI18n } from '@/services/i18n-context';

const formatBirr = (n: number) => `Br ${n.toLocaleString()}`;
const DELIVERY_FEE = 60;

export default function CartPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [address, setAddress] = useState('Bole, Addis Ababa');

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQty = async (itemId: string, qty: number) => {
    if (qty < 1) return removeItem(itemId);
    setUpdating(itemId);
    try {
      const data = await cartService.updateItem(itemId, qty);
      setCart(data);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: string) => {
    setUpdating(itemId);
    try {
      const data = await cartService.removeItem(itemId);
      setCart(data);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl bg-[var(--muted)]" />)}
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="container mx-auto flex flex-col items-center px-4 py-24 text-center">
          <ShoppingBag className="size-16 text-[var(--muted-foreground)]" />
          <h1 className="mt-4 font-display text-2xl font-bold">{t('cart.empty')}</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">Browse the marketplace to find something you will love.</p>
          <Link href="/" className="mt-6 rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white hover:opacity-90">
            {t('cart.continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.total;
  const total = subtotal + DELIVERY_FEE;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
          <ArrowLeft className="size-4" /> {t('cart.continueShopping')}
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <h1 className="font-display text-3xl font-bold">{t('cart.title')}</h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{cart.itemCount} items</p>

            {cart.hasUnavailableItems && (
              <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                Some items are no longer available and will not be included in checkout.
              </div>
            )}

            <div className="mt-6 space-y-3">
              {cart.items.map((item: any) => (
                <div key={item.id} className={`rounded-2xl border p-4 ${!item.isAvailable ? 'border-red-200 bg-red-50 opacity-60' : 'border-[var(--border)] bg-white'}`}>
                  <div className="flex items-center gap-4">
                    <div className="size-20 flex-shrink-0 overflow-hidden rounded-xl bg-[var(--muted)]">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-2xl">P</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.productId}`} className="font-semibold hover:underline line-clamp-1">{item.name}</Link>
                      <div className="text-xs text-[var(--muted-foreground)]">{item.shop?.name}</div>
                      {!item.isAvailable && <div className="text-xs text-red-500">{t('cart.unavailable')}</div>}
                      <div className="mt-1 font-display font-bold text-[var(--primary)]">{formatBirr(item.price)}</div>
                    </div>
                    {item.isAvailable && (
                      <div className="flex items-center rounded-xl border border-[var(--border)]">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)} disabled={updating === item.id} aria-label="Decrease quantity" className="px-2.5 py-2 hover:bg-[var(--secondary)] disabled:opacity-40">
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} disabled={updating === item.id} aria-label="Increase quantity" className="px-2.5 py-2 hover:bg-[var(--secondary)] disabled:opacity-40">
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    )}
                    <div className="text-sm font-semibold w-20 text-right">{formatBirr(item.subtotal)}</div>
                    <button onClick={() => removeItem(item.id)} disabled={updating === item.id} aria-label="Remove item" className="ml-2 rounded-lg p-2 text-[var(--destructive)] hover:bg-red-50 disabled:opacity-40">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-fit rounded-2xl border border-[var(--border)] bg-white p-6">
            <div className="font-display text-lg font-bold">Order summary</div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">{t('cart.subtotal')}</span><span>{formatBirr(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">Delivery</span><span>{formatBirr(DELIVERY_FEE)}</span></div>
              <div className="my-3 border-t border-[var(--border)]" />
              <div className="flex justify-between font-display text-lg font-bold"><span>{t('cart.total')}</span><span className="text-[var(--primary)]">{formatBirr(total)}</span></div>
            </div>
            <div className="mt-5">
              <label className="block text-sm font-medium">{t('order.deliveryAddress')}</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1.5 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]" />
            </div>
            <button onClick={() => alert('Checkout coming soon!')} className="mt-5 w-full rounded-xl bg-[var(--primary)] py-3.5 font-semibold text-white transition-all hover:opacity-90">
              {t('cart.checkout')}
            </button>
            <p className="mt-3 text-center text-xs text-[var(--muted-foreground)]">Secure checkout powered by Chapa</p>
          </div>
        </div>
      </div>
    </div>
  );
}