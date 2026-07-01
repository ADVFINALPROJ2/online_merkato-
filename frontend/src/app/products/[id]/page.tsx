'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Store, Star, Package } from 'lucide-react';
import { buyerService } from '@/services/buyer-service';
import { cartService } from '@/services/cart-service';
import { useI18n } from '@/services/i18n-context';

const formatBirr = (n: number) => `Br ${n.toLocaleString()}`;

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useI18n();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [cartMsg, setCartMsg] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      buyerService.getProductDetail(id),
      buyerService.getRelatedProducts(id),
    ])
      .then(([prod, rel]) => {
        setProduct(prod);
        setRelated(rel.data ?? []);
      })
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    setAddingToCart(true);
    try {
      await cartService.addItem(id, qty);
      setCartMsg(t('cart.itemAdded'));
      setTimeout(() => setCartMsg(''), 3000);
    } catch {
      setCartMsg('Please login to add to cart');
      setTimeout(() => setCartMsg(''), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-[var(--muted)]" />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="aspect-square rounded-2xl bg-[var(--muted)]" />
            <div className="space-y-4">
              <div className="h-8 rounded bg-[var(--muted)]" />
              <div className="h-4 w-32 rounded bg-[var(--muted)]" />
              <div className="h-12 rounded bg-[var(--muted)]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;
  const images = product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
          <ArrowLeft className="size-4" /> {t('common.back')} to Browse
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="aspect-square overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--muted)]">
              {images.length > 0 ? (
                <img src={images[selectedImage]} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl">Ã°Å¸â€œÂ¦</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`size-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${selectedImage === i ? 'border-[var(--primary)]' : 'border-[var(--border)]'}`}>
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.category && (
              <div className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">{product.category.name}</div>
            )}
            <h1 className="mt-1 font-display text-3xl font-bold">{product.name}</h1>
            {product._count?.reviews > 0 && (
              <div className="mt-2 flex items-center gap-1 text-sm text-[var(--muted-foreground)]">
                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                <span>{product._count.reviews} reviews</span>
              </div>
            )}
            <div className="mt-4 font-display text-4xl font-extrabold text-[var(--primary)]">{formatBirr(product.price)}</div>
            <div className="mt-2 flex items-center gap-2">
              <Package className="size-4 text-[var(--muted-foreground)]" />
              <span className={`text-sm font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.quantity > 0 ? `${product.quantity} in stock` : t('product.outOfStock')}
              </span>
            </div>
            {product.description && <p className="mt-4 text-[var(--muted-foreground)]">{product.description}</p>}

            {product.quantity > 0 && (
              <div className="mt-6 flex items-center gap-4">
                <span className="text-sm font-medium">{t('cart.quantity')}:</span>
                <div className="flex items-center rounded-xl border border-[var(--border)]">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 text-lg hover:bg-[var(--secondary)]">Ã¢Ë†â€™</button>
                  <span className="w-10 text-center font-semibold">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.quantity, q + 1))} aria-label="Increase quantity" className="px-3 py-2 text-lg hover:bg-[var(--secondary)]">+</button>
                </div>
              </div>
            )}

            <button onClick={addToCart} disabled={addingToCart || product.quantity === 0}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3.5 font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50">
              <ShoppingCart className="size-5" />
              {addingToCart ? 'Adding...' : t('product.addToCart')}
            </button>
            {cartMsg && <div className="mt-3 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">{cartMsg}</div>}
            <Link href="/cart" className="mt-3 block text-center text-sm text-[var(--primary)] hover:underline">View cart Ã¢â€ â€™</Link>

            {product.shop && (
              <div className="mt-8 rounded-2xl border border-[var(--border)] p-4">
                <div className="flex items-center gap-3">
                  {product.shop.logoUrl ? (
                    <img src={product.shop.logoUrl} alt={product.shop.name} className="size-12 rounded-full object-cover" />
                  ) : (
                    <div className="flex size-12 items-center justify-center rounded-full bg-[var(--primary)]/10">
                      <Store className="size-6 text-[var(--primary)]" />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">{product.shop.name}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">{t('shop.seller')}</div>
                  </div>
                  <Link href={`/browse?shopId=${product.shop.id}`}
                    className="ml-auto rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--secondary)]">
                    {t('shop.visit')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {product.reviews?.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold">Customer Reviews</h2>
            <div className="mt-4 space-y-4">
              {product.reviews.map((r: any) => (
                <div key={r.id} className="rounded-xl border border-[var(--border)] p-4">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-sm font-bold text-[var(--primary)]">
                      {r.buyer?.firstName?.[0] ?? 'U'}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{r.buyer?.firstName} {r.buyer?.lastName}</div>
                      <div className="flex">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="size-3 fill-yellow-400 text-yellow-400" />)}</div>
                    </div>
                  </div>
                  {r.comment && <p className="mt-2 text-sm text-[var(--muted-foreground)]">{r.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold">{t('product.relatedProducts')}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.slice(0, 4).map((p: any) => (
                <Link key={p.id} href={`/products/${p.id}`} className="group">
                  <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white transition-all hover:-translate-y-1 hover:shadow-md">
                    <div className="aspect-square overflow-hidden bg-[var(--muted)]">
                      {p.imageUrl || p.images?.[0] ? (
                        <img src={p.imageUrl || p.images[0]} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-3xl">Ã°Å¸â€œÂ¦</div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="line-clamp-1 text-sm font-semibold">{p.name}</div>
                      <div className="mt-1 font-display font-bold text-[var(--primary)]">{formatBirr(p.price)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}