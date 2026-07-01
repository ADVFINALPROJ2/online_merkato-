import { ProductCard } from './product-card';

export const BestSellers = () => {
  const products = [ /* Mock this with real data later */ ];

  return (
    <section className="my-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Best Sellers</h2>
        <a href="#" className="text-blue-600">See all →</a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Render your ProductCards here */}
      </div>
    </section>
  );
};