interface ProductCardProps {
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  image: string;
}

export const ProductCard = ({ name, price, oldPrice, discount, image }: ProductCardProps) => (
  <div className="bg-white p-3 rounded-xl border hover:shadow-md transition-shadow">
    <div className="relative h-40 bg-gray-100 rounded-lg mb-3">
      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
        {discount}%
      </span>
      {/* Add your Image tag here */}
    </div>
    <h4 className="font-medium text-sm truncate">{name}</h4>
    <div className="flex items-center gap-2 mt-2">
      <span className="font-bold text-red-600">Br {price}</span>
      <span className="text-xs text-gray-400 line-through">Br {oldPrice}</span>
    </div>
  </div>
);