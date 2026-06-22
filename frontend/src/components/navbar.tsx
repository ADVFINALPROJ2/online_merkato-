'use client';

import Link from 'next/link';
import { Store, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-amber-700">
          <Store className="h-6 w-6" />
          <span>Merkato</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors">
                Dashboard
              </Link>
              <span className="text-sm text-stone-400">
                {user?.firstName} {user?.lastName}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className={cn(
        'md:hidden border-t border-stone-200 bg-white px-4 pb-4 pt-2 space-y-2',
        open ? 'block' : 'hidden',
      )}>
        {isAuthenticated ? (
          <>
            <Link href="/dashboard" className="block text-sm font-medium text-stone-600 py-2" onClick={() => setOpen(false)}>
              Dashboard
            </Link>
            <button onClick={() => { logout(); setOpen(false); }} className="block text-sm text-stone-600 py-2">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="block text-sm text-stone-600 py-2" onClick={() => setOpen(false)}>
              Login
            </Link>
            <Link href="/register" className="block text-sm text-stone-600 py-2" onClick={() => setOpen(false)}>
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
