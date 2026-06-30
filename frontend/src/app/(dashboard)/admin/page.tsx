'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function AdminPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and user is not authenticated, kick them out
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Show a loading screen while the AuthProvider checks LocalStorage
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // Handle unauthorized access or wrong role
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-xl font-bold">Access Denied</h1>
        <Button onClick={() => router.push('/login')} className="mt-4">
          Return to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.email}</p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleLogout} 
          className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </div>

      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <p>This is your protected admin workspace.</p>
      </div>
    </div>
  );
}