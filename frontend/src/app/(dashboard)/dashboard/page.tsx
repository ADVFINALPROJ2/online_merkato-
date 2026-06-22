'use client';

import { Store } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { useAuth } from '@/hooks/use-auth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader
        title={`Welcome${user ? `, ${user.firstName}` : ''}!`}
        description="Manage your shop, products, and orders from here."
      />
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16">
          <div className="rounded-full bg-amber-100 p-4">
            <Store className="h-8 w-8 text-amber-600" />
          </div>
          <p className="text-lg font-medium text-stone-700">Welcome Seller</p>
          <p className="text-sm text-stone-500 text-center max-w-md">
            Your seller dashboard is ready. Start by creating your shop profile and adding products.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
