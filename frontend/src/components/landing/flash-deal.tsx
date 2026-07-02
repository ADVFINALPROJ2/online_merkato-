// 'use client';

// import { useCountdown } from '@/hooks/use-countdown';
// import { ProductCard } from './product-card';

// export const FlashDeals = () => {
//   const { h, m, s } = useCountdown(3600 * 5); // 5 hours example

//   return (
//     <section className="my-8">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-4">
//           <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
//              🔥 Flash Deals
//           </h2>
//           <div className="bg-stone-800 text-white px-3 py-1 rounded text-sm font-mono">
//             Ends in {h} : {m} : {s}
//           </div>
//         </div>
//         <button className="text-blue-600 hover:underline">See all →</button>
//       </div>
      
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//         {/* Map your actual products here */}
//         <ProductCard name="Berbere Spice" price={180} oldPrice={300} discount={40} image="..." />
//       </div>
//     </section>
//   );
// };