'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Store, Star, Package } from 'lucide-react';
import { buyerService } from '@/services/buyer-service';
import { cartService } from '@/services/cart-service';
import { useI18n } from '@/services/i18n-context';

const formatBirr = (n: number) => `Br ${Number(n || 0).toLocaleString()}`;

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
        setRelated(rel?.data ?? rel ?? []);
      })
      .catch((err) => {
        console.log(err);
        router.push('/');
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  const addToCart = async () => {
    setAddingToCart(true);

    try {
      await cartService.addItem(id, qty);
      setCartMsg('Added to cart successfully');
      setTimeout(() => setCartMsg(''), 3000);
    } catch (err) {
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
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="aspect-square rounded-2xl bg-gray-200" />
            <div className="space-y-4">
              <div className="h-8 rounded bg-gray-200" />
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-12 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images =
    product.images?.length
      ? product.images
      : product.imageUrl
      ? [product.imageUrl]
      : [];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* BACK */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* IMAGES */}
          <div>
            <div className="aspect-square overflow-hidden rounded-2xl border bg-gray-100">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-4xl">
                  📦
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                      selectedImage === i ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>

            <div className="mt-4 text-3xl font-bold text-blue-600">
              {formatBirr(product.price)}
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <Package className="w-4 h-4" />
              {product.quantity > 0
                ? `${product.quantity} in stock`
                : 'Out of stock'}
            </div>

            <p className="mt-4 text-gray-600">{product.description}</p>

            {/* QTY */}
            {product.quantity > 0 && (
              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 border rounded"
                >
                  -
                </button>

                <span>{qty}</span>

                <button
                  onClick={() =>
                    setQty((q) => Math.min(product.quantity, q + 1))
                  }
                  className="px-3 py-1 border rounded"
                >
                  +
                </button>
              </div>
            )}

            {/* ADD TO CART */}
            <button
              onClick={addToCart}
              disabled={addingToCart || product.quantity === 0}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white disabled:opacity-50"
            >
              <ShoppingCart className="w-5 h-5" />
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>

            {cartMsg && (
              <div className="mt-3 text-sm text-green-600">{cartMsg}</div>
            )}

            <Link href="/cart" className="mt-3 block text-center text-blue-600">
              View Cart →
            </Link>

            {/* SHOP */}
            {product.shop && (
              <div className="mt-8 border rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Store className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">
                      {product.shop.name}
                    </div>
                    <div className="text-xs text-gray-500">Seller</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RELATED */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold">Related Products</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p: any) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="border rounded-xl p-3 hover:shadow"
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    📦
                  </div>

                  <div className="mt-2 font-semibold">{p.name}</div>
                  <div className="text-blue-600 font-bold">
                    {formatBirr(p.price)}
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