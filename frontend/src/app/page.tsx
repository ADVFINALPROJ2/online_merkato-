'use client';

import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8 text-center space-y-4">
      <h1 className="text-2xl font-bold">Welcome to Digital Merkato</h1>
      {isAuthenticated ? (
        <p>Hi {user?.firstName}, start shopping!</p>
      ) : (
        <p>
          <Link href="/login" className="text-amber-600 underline">Sign in</Link>{' '}
          or{' '}
          <Link href="/register?role=BUYER" className="text-amber-600 underline">create a buyer account</Link>
        </p>
      )}
    </div>
  );
}
