'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, User, Mail, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { deliveryService } from '@/services/delivery-service';

interface Delivery {
  id: string;
  status: string;
  createdAt: string;
  order: {
    id: string;
    status: string;
    totalAmount: number;
    deliveryAddress: string;
    buyer: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
    };
    items: {
      quantity: number;
      product: {
        name: string;
      };
    }[];
  };
}

export default function DeliveryDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loadingDeliveries, setLoadingDeliveries] = useState(true);
  const [error, setError] = useState('');
  const [completingId, setCompletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      if (!user?.id) return;

      try {
        const data = await deliveryService.getMyDeliveries(user.id);
        setDeliveries(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load deliveries');
      } finally {
        setLoadingDeliveries(false);
      }
    };

    fetchDeliveries();
  }, [user]);

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user || user.role !== 'DELIVERY') {
    return <div className="p-8 text-red-600 font-semibold">Access Denied</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Truck className="h-8 w-8 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold">Driver Dashboard</h1>
              <p className="text-gray-500">
                Welcome back, {user.firstName}
              </p>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-5">
            <User className="h-5 w-5" />
            <p>{user.firstName} {user.lastName}</p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <Mail className="h-5 w-5" />
            <p>{user.email}</p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <Phone className="h-5 w-5" />
            <p>{user.phoneNumber}</p>
          </div>
        </div>

        {/* Delivery Status */}
        <div className="mt-6 rounded-xl border bg-white p-6">
          <h2 className="text-xl font-semibold mb-4">
            Delivery Status
          </h2>

          <div className="rounded-lg bg-green-50 p-4 text-green-700">
            {deliveries.length > 0
              ? `You have ${deliveries.length} assigned deliveries`
              : 'No active deliveries'}
          </div>
        </div>

        {/* Deliveries */}
        <div className="mt-6 rounded-xl border bg-white p-6">
          <h2 className="text-xl font-semibold mb-4">
            Assigned Deliveries
          </h2>

          {loadingDeliveries ? (
            <p>Loading deliveries...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : deliveries.length === 0 ? (
            <p className="text-gray-500">No deliveries assigned yet.</p>
          ) : (
            <div className="space-y-4">
              {deliveries.map((d) => (
                <div key={d.id} className="border p-4 rounded-lg bg-gray-50">

                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold">
                        Order #{d.order.id.slice(0, 6)}
                      </p>

                      <p>Status: {d.status}</p>
                      <p>To: {d.order.deliveryAddress}</p>

                      <p className="mt-2 text-sm text-gray-600">
                        Buyer: {d.order.buyer.firstName} {d.order.buyer.lastName}
                      </p>

                      <p className="text-sm text-gray-600">
                        Items:
                        {d.order.items.map((i, idx) => (
                          <span key={idx}> {i.product.name} x{i.quantity}</span>
                        ))}
                      </p>
                    </div>

                    {d.status !== 'COMPLETED' && (
                      <button
                        onClick={async () => {
                          setCompletingId(d.id);
                          try {
                            await deliveryService.markAsDelivered(d.id);
                            setDeliveries((prev) =>
                              prev.map((del) =>
                                del.id === d.id
                                  ? { ...del, status: 'COMPLETED' }
                                  : del
                              )
                            );
                          } catch (err: any) {
                            alert(err.response?.data?.message || err.message || 'Failed to mark as delivered');
                          } finally {
                            setCompletingId(null);
                          }
                        }}
                        disabled={completingId === d.id}
                        className="shrink-0 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        {completingId === d.id ? 'Completing...' : 'Mark as Delivered'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

