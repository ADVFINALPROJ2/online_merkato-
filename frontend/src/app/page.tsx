import Link from 'next/link';
import { Store, ArrowRight, ShoppingCart } from 'lucide-react';

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="flex flex-col items-center text-center">
        <div className="rounded-full bg-amber-100 p-4 mb-6">
          <Store className="h-10 w-10 text-amber-600" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
          Welcome to{' '}
          <span className="text-amber-600">Digital Merkato</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-stone-500 sm:text-xl">
          The AI-powered marketplace connecting Ethiopian sellers with buyers.
        </p>
        
        {/* Buttons Section */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-8 py-3 text-base font-medium text-white hover:bg-amber-700 transition-colors shadow-sm w-full sm:w-auto"
          >
            Start Selling
            <ArrowRight className="h-5 w-5" />
          </Link>
          
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-8 py-3 text-base font-medium text-stone-700 hover:bg-stone-50 transition-colors w-full sm:w-auto"
          >
            Sign In
          </Link>

          {/* NEW: Quick link to your checkout task  */}
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto"
          >
            <ShoppingCart className="h-5 w-5" />
            View Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}