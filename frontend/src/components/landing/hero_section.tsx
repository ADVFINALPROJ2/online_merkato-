'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
      {/* Main Banner */}
      <div className="lg:col-span-2 bg-blue-600 rounded-2xl p-12 text-white flex items-center justify-between">
        <div>
          <span className="bg-blue-500/30 px-3 py-1 rounded-full text-sm">✨ Mega Sale</span>
          <h1 className="text-5xl font-bold my-4">Up to 70% OFF on Ethiopian goods</h1>
          <p className="mb-6 opacity-90">Authentic spices, coffee, textiles & more. Free delivery in Addis Ababa.</p>
          <Button variant="secondary" className="gap-2">
            Shop now <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="hidden md:block w-48 h-48 bg-white/10 rounded-full" />
      </div>

      {/* Side Cards */}
      <div className="flex flex-col gap-4">
        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
          <h3 className="font-bold text-lg">Br 200 OFF</h3>
          <p className="text-sm text-gray-600">on your first order over Br 1,000</p>
          <Button variant="outline" className="w-full mt-4">Claim coupon</Button>
        </div>
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
          <h3 className="font-bold text-lg">Free shipping</h3>
          <p className="text-sm text-gray-600">on orders over Br 500 in Addis</p>
        </div>
      </div>
    </section>
  );
};