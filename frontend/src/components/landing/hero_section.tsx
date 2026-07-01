'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

export const HeroSection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
      {/* Main Banner */}
      <div className="lg:col-span-2 bg-blue-600 rounded-2xl p-12 text-white flex items-center justify-between">
        <div>
          <span className="bg-blue-500/30 px-3 py-1 rounded-full text-sm">✨ Mega Sale</span>
          <h1 className="text-5xl font-bold my-4">Up to 70% OFF on Ethiopian goods</h1>
          <p className="mb-6 opacity-90">Authentic spices, coffee, textiles & more. Free delivery in Addis Ababa.</p>
          {!isAuthenticated && (
            <Link href="/login">
              <Button variant="secondary" className="gap-2">
                Shop now <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
        <div className="hidden md:block w-48 h-48 bg-white/10 rounded-full" />
      </div>

      {/* Side Cards - placeholder for future promotions */}
    </section>
  );
};