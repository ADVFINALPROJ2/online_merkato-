'use client';

import Link from 'next/link';
import { Store, LogOut, User, ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : '';

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-amber-700">
          <Store className="h-6 w-6" />
          <span>Merkato</span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors"
              >
                Dashboard
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-stone-100 transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-amber-100 text-amber-700">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium text-stone-700 lg:inline">
                      {user?.firstName}
                    </span>
                    <ChevronDown className="h-4 w-4 text-stone-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user?.firstName} {user?.lastName}</span>
                      <span className="text-xs font-normal text-stone-500">{user?.email || user?.phoneNumber}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <User className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
            <div className="flex items-center gap-3 py-2 border-b border-stone-100 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-amber-100 text-amber-700">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-stone-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-stone-500">{user?.email || user?.phoneNumber}</p>
              </div>
            </div>
            <Link href="/dashboard" className="block text-sm font-medium text-stone-600 py-2" onClick={() => setOpen(false)}>
              Dashboard
            </Link>
            <button onClick={() => { logout(); setOpen(false); }} className="block text-sm text-red-600 py-2">
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
