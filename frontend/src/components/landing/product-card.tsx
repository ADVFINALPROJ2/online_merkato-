"use client";

import { useRouter } from "next/navigation";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image?: string;
}

export const ProductCard = ({
  id,
  name,
  price,
  oldPrice,
  discount,
  image,
}: ProductCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (!id) return;
    router.push(`/products/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white p-3 rounded-xl border hover:shadow-md transition-shadow"
    >
      {/* IMAGE */}
      <div className="relative h-40 bg-gray-100 rounded-lg mb-3 overflow-hidden">
        {discount ? (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {discount}% OFF
          </span>
        ) : null}

        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* NAME */}
      <h4 className="font-medium text-sm truncate">{name}</h4>

      {/* PRICE */}
      <div className="flex items-center gap-2 mt-2">
        <span className="font-bold text-blue-600">Br {price}</span>

        {oldPrice ? (
          <span className="text-xs text-gray-400 line-through">
            Br {oldPrice}
          </span>
        ) : null}
      </div>
    </div>
  );
};