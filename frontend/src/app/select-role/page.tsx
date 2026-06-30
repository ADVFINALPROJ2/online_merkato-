'use client';

import Link from 'next/link';
import { ShoppingBag, Store, Truck, KeyRound } from 'lucide-react';

const roles = [
  { role: 'BUYER', label: 'Buyer', description: 'Shop and track orders', icon: ShoppingBag },
  { role: 'SELLER', label: 'Seller', description: 'Manage your store', icon: Store },
  { role: 'DELIVERY', label: 'Delivery', description: 'Accept deliveries', icon: Truck },
];

export default function SelectRolePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4 py-16">
      <h1 className="text-center font-display text-3xl font-bold md:text-4xl">Welcome to Digital Merkato</h1>
      <p className="mt-3 text-center text-[var(--muted-foreground)]">Choose how you want to use the platform.</p>

      <div className="mt-10 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
        {roles.map(({ role, label, description, icon: Icon }) => (
          <Link key={role} href={`/register?role=${role}`}
            className="flex flex-col items-center rounded-2xl border border-[var(--border)] bg-white p-8 text-center transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-[var(--primary)]/10">
              <Icon className="size-8 text-[var(--primary)]" />
            </div>
            <div className="mt-4 font-display text-xl font-bold">{label}</div>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p>
          </Link>
        ))}
      </div>

      <Link href="/login" className="mt-10 flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
        <KeyRound className="size-4" /> Already have an account? Sign in
      </Link>
    </div>
  );
}