'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Package, Heart, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { cartService } from '@/services/cart-service';
import { LanguageSwitcher } from './LanguageSwitcher';

export function BuyerHeader() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [q, setQ] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      cartService.getCart().then((cart) => setCartCount(cart.itemCount)).catch(() => setCartCount(0));
    }
  }, [isAuthenticated]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/${q ? `?q=${encodeURIComponent(q)}` : ''}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white">
      <div className="container mx-auto flex h-20 items-center gap-6 px-4">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="flex size-10 items-center justify-center rounded-full bg-[var(--primary)] text-white font-bold">DM</div>
          <div>
            <div className="font-display text-lg font-bold leading-tight">Digital Merkato</div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">Ethiopia</div>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, brands and sellers"
              className="w-full rounded-full border border-[var(--border)] bg-[var(--secondary)]/50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary)]/20" />
          </div>
        </form>

        <div className="flex items-center gap-2 flex-shrink-0">
          <LanguageSwitcher />
          <Link href="/orders" className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)] md:flex">
            <Package className="size-4" /> Orders
          </Link>
          <button className="hidden rounded-lg p-2.5 hover:bg-[var(--secondary)] md:block">
            <Heart className="size-5" />
          </button>
          <Link href="/cart" className="relative rounded-lg p-2.5 hover:bg-[var(--secondary)]">
            <ShoppingCart className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">{cartCount}</span>
            )}
          </Link>
          {isAuthenticated ? (
            <Link href="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-[var(--secondary)]">
              <div className="flex size-8 items-center justify-center rounded-full bg-[var(--primary)]/10 text-sm font-bold text-[var(--primary)]">
                {user?.firstName?.[0] ?? <UserIcon className="size-4" />}
              </div>
              <span className="hidden text-sm font-medium lg:inline">{user?.firstName}</span>
            </Link>
          ) : (
            <Link href="/login" className="flex items-center gap-1.5 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
              <UserIcon className="size-4" /> Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}