'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Search, ShoppingCart, Package, LogIn, UserCircle, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export const Navbar = () => {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (q) router.push(`/buyer?q=${encodeURIComponent(q)}`);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    router.push('/');
  };

  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        <Link href="/" className="text-2xl font-bold text-blue-600">Digital Merkato</Link>

        <form onSubmit={handleSearch} className="flex-1 flex items-center bg-gray-50 border rounded-full overflow-hidden focus-within:ring-2 ring-blue-500">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-2.5 bg-transparent outline-none"
          />
          <button type="submit" className="bg-blue-600 text-white p-3 hover:bg-blue-700">
            <Search className="w-5 h-5" />
          </button>
        </form>

        <div className="flex items-center gap-6 text-gray-600">
          <button className="flex items-center gap-2 hover:text-blue-600">
            <Package className="w-5 h-5" /> Orders
          </button>
          
          <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-blue-600" />
          
          {!isAuthenticated ? (
            <Link href="/login">
              <Button className="rounded-full gap-2 bg-blue-600 hover:bg-blue-700">
                <LogIn className="w-4 h-4" /> Signin 
              </Button>
            </Link>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2"
              >
                <UserCircle className="w-4 h-4" /> Profile
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-1 z-50">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4" /> Personal Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
