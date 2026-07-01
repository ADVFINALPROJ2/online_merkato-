'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sellerName: string;
}

const fetchProducts = async (): Promise<Product[]> => {
  const res = await api.get('/buyer/products');
  const raw = Array.isArray(res.data) ? res.data : (res.data?.data || []);
  return raw.map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category?.name || 'General',
    sellerName: p.shop?.name || 'Seller',
  }));
};

export const ProductListing = () => {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Products</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-gray-500">Loading products...</div>
      ) : !products || products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No products available.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-white p-3 rounded-xl border hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                Image
              </div>
              <p className="text-xs text-gray-500 uppercase">{product.category}</p>
              <h4 className="font-medium text-sm truncate">{product.name}</h4>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-bold text-blue-600">Br {product.price}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
