'use client';

import Link from 'next/link';
import { LayoutDashboard, Store, Package, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/shop', label: 'Shop', icon: Store },
  { href: '/products', label: 'Products', icon: Package },
];

export function Sidebar() {
  const pathname = usePathname();

  const nav = (
    <nav className="flex-1 space-y-1 p-4">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
            pathname === href || pathname.startsWith(href + '/')
              ? 'bg-amber-50 text-amber-700'
              : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900',
          )}
        >
          <Icon className="h-5 w-5" />
          {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <aside className="hidden lg:flex w-64 flex-col border-r border-stone-200 bg-white min-h-[calc(100vh-4rem)]">
        <div className="flex h-16 items-center border-b border-stone-200 px-6">
          <span className="text-sm font-semibold text-stone-500 uppercase tracking-wider">Navigation</span>
        </div>
        {nav}
      </aside>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 bottom-4 z-40 rounded-full shadow-lg bg-white border border-stone-200 lg:hidden"
            aria-label="Open sidebar"
          >
            <Store className="h-5 w-5 text-amber-600" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <SheetHeader className="flex h-16 flex-row items-center justify-between border-b border-stone-200 px-6">
            <SheetTitle className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
              Navigation
            </SheetTitle>
          </SheetHeader>
          {nav}
        </SheetContent>
      </Sheet>
    </>
  );
}
