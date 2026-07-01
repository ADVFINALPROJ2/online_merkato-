'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/services/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sellerName: string;
}

function BuyerContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async (q: string, categoryId: string) => {
    setLoading(true);
    try {
      if (q) {
        const res = await api.get('/buyer/search', { params: { q } });
        const raw = Array.isArray(res.data?.data) ? res.data.data : [];
        setProducts(raw.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category?.name || 'General',
          sellerName: p.shop?.name || 'Seller',
        })));
      } else if (categoryId) {
        const res = await api.get(`/buyer/categories/${categoryId}/products`);
        const raw = Array.isArray(res.data?.data) ? res.data.data : [];
        setProducts(raw.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category?.name || 'General',
          sellerName: p.shop?.name || 'Seller',
        })));
      } else {
        const res = await api.get('/buyer/products');
        const raw = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setProducts(raw.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category?.name || 'General',
          sellerName: p.shop?.name || 'Seller',
        })));
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(searchParams.get('q') || '', searchParams.get('categoryId') || '');
  }, [searchParams, fetchProducts]);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 w-full min-h-[calc(100vh-200px)]">
      <h1 className="text-3xl font-bold mb-8">
        {searchParams.get('q') ? `Results for "${searchParams.get('q')}"` : searchParams.get('categoryId') ? 'Browse category' : 'Browse the marketplace'}
      </h1>

      {loading ? (
        <div className="text-center py-20">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No products available.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-2xl p-4 hover:shadow-lg transition-all">
              <div className="h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                Image Placeholder
              </div>

              <p className="text-xs text-gray-500 uppercase">{product.category}</p>
              <h2 className="font-bold text-lg">{product.name}</h2>
              <p className="text-sm text-gray-600 truncate">{product.description}</p>

              <div className="flex justify-between items-center mt-4">
                <span className="font-bold text-blue-600">Br {product.price}</span>
                <span className="text-xs text-gray-500">{product.sellerName}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <BuyerContent />
    </Suspense>
  );
}
