"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { ProductCard } from "./product-card";
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

const fetchProducts = async (): Promise<Product[]> => {
  const res = await api.get("/buyer/products");
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const ProductListing = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  return (
    <section className="my-8">
      <h2 className="text-xl font-bold mb-6">Products</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : !products?.length ? (
        <p>No products</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              price={p.price}
              image={p.image}
            />
          ))}
        </div>
      )}
    </section>
  );
};