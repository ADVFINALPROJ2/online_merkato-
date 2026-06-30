'use client';

import { Search, ShoppingCart, Package, LogIn, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();

  // Helper to determine where the dashboard link goes
  const getDashboardPath = () => {
    if (user?.role === 'ADMIN') return '/admin';
    if (user?.role === 'SELLER') return '/seller';
    return '/dashboard';
  };

  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        <div className="text-2xl font-bold text-blue-600">Digital Merkato</div>

        <div className="flex-1 flex items-center bg-gray-50 border rounded-full overflow-hidden focus-within:ring-2 ring-blue-500">
          <input type="text" placeholder="Search products..." className="w-full px-4 py-2.5 bg-transparent outline-none" />
          <button className="bg-blue-600 text-white p-3 hover:bg-blue-700">
            <Search className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-6 text-gray-600">
          <button className="flex items-center gap-2 hover:text-blue-600">
            <Package className="w-5 h-5" /> Orders
          </button>
          
          <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-blue-600" />
          
          {isAuthenticated ? (
            // If logged in, show Profile/Dashboard button
            <Link href={getDashboardPath()}>
              <Button className="rounded-full gap-2 bg-green-600 hover:bg-green-700">
                <UserCircle className="w-4 h-4" /> My Dashboard
              </Button>
            </Link>
          ) : (
            // If not logged in, show Signin button
            <Link href="/login">
              <Button className="rounded-full gap-2 bg-blue-600 hover:bg-blue-700">
                <LogIn className="w-4 h-4" /> Signin 
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};