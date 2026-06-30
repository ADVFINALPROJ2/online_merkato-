'use client';
import { useAuth } from '@/hooks/use-auth';

export default function SellerDashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  
  // Security check: Only allow 'seller' role
  if (user?.role !== 'delivery') {
     return <div className="p-8 text-red-600">Access Denied: You are not authorized to view this page.</div>;
  }

  return <div>Welcome to your Seller Dashboard</div>;
}