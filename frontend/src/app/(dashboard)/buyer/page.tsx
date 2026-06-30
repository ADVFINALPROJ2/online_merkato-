'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sellerName: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/product');
        // Handle different possible API response structures
        const data = Array.isArray(response.data) 
          ? response.data 
          : (response.data.data || []);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    // We removed Navbar and Footer from here because they are handled in RootLayout
    <main className="max-w-7xl mx-auto px-6 py-10 w-full min-h-[calc(100vh-200px)]">
      <h1 className="text-3xl font-bold mb-8">Browse the marketplace</h1>
      
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
              
              <p className="text-xs text-gray-500 uppercase">{String(product.category || 'General')}</p>
              <h2 className="font-bold text-lg">{String(product.name || 'Unnamed')}</h2>
              <p className="text-sm text-gray-600 truncate">{String(product.description || '')}</p>
              
              <div className="flex justify-between items-center mt-4">
                <span className="font-bold text-blue-600">Br {Number(product.price) || 0}</span>
                <span className="text-xs text-gray-500">{String(product.sellerName || 'Seller')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}