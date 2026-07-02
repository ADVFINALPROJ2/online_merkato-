'use client';
import { ShoppingBag, Store, Truck, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
export default function RoleSelectionPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const roles = [
    { name: 'Buyer', desc: 'Shop and track orders', icon: ShoppingBag, path: '/register?role=buyer' },
    { name: 'Seller', desc: 'Manage your store', icon: Store, path: '/register?role=seller' },
    { name: 'Delivery', desc: 'Accept deliveries', icon: Truck, path: '/driver/register' },
  ];
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Welcome to Digital Merkato</h1>
      <p className="text-gray-600 mb-10">Choose how you want to use the platform.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {roles.map((role) => (
          <button
            key={role.name}
            onClick={() => router.push(role.path)}
            className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col items-center text-center"
          >
            <div className="bg-blue-50 p-4 rounded-full mb-4">
              <role.icon className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">{role.name}</h2>
            <p className="text-gray-500 text-sm">{role.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
