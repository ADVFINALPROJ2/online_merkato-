'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Truck, Package, CheckCircle, Clock, User as UserIcon,
  Mail, Phone, LogOut, ArrowLeft, Shield,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { deliveryService } from '@/services/delivery-service';

const statusStyles: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  ASSIGNED: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-purple-100 text-purple-700',
  PICKED_UP: 'bg-indigo-100 text-indigo-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

const formatBirr = (n: number) => `Br ${n.toLocaleString()}`;

interface ProfileData {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    createdAt: string;
  };
  driverProfile: {
    vehicleType: string;
    licensePlate: string | null;
    status: string;
  } | null;
  stats: {
    totalDeliveries: number;
    completedDeliveries: number;
    activeDeliveries: number;
  };
  recentDeliveries: {
    id: string;
    status: string;
    createdAt: string;
    order: {
      id: string;
      totalAmount: number;
      deliveryAddress: string;
      status: string;
      createdAt: string;
    };
  }[];
}

export default function DeliveryProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user?.id) return;
    const fetchProfile = async () => {
      try {
        const data = await deliveryService.getDriverProfile(user.id);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (isLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-40 rounded-2xl bg-gray-200" />
          <div className="h-24 rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'DELIVERY') {
    return <div className="p-8 text-red-600 font-semibold">Access Denied</div>;
  }

  const driver = profile?.driverProfile;
  const stats = profile?.stats ?? { totalDeliveries: 0, completedDeliveries: 0, activeDeliveries: 0 };
  const deliveries = profile?.recentDeliveries ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8">

        {/* Back link */}
        <Link
          href="/delivery"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="size-4" /> Back to Dashboard
        </Link>

        {/* Profile header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex size-20 items-center justify-center rounded-full bg-white/20 text-3xl font-bold backdrop-blur">
              {user.firstName?.[0]?.toUpperCase() ?? <UserIcon className="size-8" />}
            </div>
            <div className="flex-1">
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                DELIVERY
              </span>
              <h1 className="mt-2 text-3xl font-bold">{user.firstName} {user.lastName}</h1>
              {/* <p className="mt-1 text-sm text-white/85">Driver since {memberSince}</p> */}
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-white/90"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Package className="size-5" />
            </div>
            <div className="mt-3 text-xs font-medium uppercase tracking-wider text-gray-500">Total Deliveries</div>
            <div className="text-2xl font-bold">{stats.totalDeliveries}</div>
          </div>
          <div className="rounded-2xl border bg-white p-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle className="size-5" />
            </div>
            <div className="mt-3 text-xs font-medium uppercase tracking-wider text-gray-500">Completed</div>
            <div className="text-2xl font-bold">{stats.completedDeliveries}</div>
          </div>
          <div className="rounded-2xl border bg-white p-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
              <Clock className="size-5" />
            </div>
            <div className="mt-3 text-xs font-medium uppercase tracking-wider text-gray-500">In Progress</div>
            <div className="text-2xl font-bold">{stats.activeDeliveries}</div>
          </div>
        </div>

        {/* Driver Details */}
        <div className="mt-6 rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold">Driver Details</h2>
          <div className="mt-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <UserIcon className="size-4" />
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Name</div>
                <div className="font-medium">{user.firstName} {user.lastName}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Mail className="size-4" />
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Email</div>
                <div className="font-medium">{user.email ?? 'Not provided'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Phone className="size-4" />
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Phone</div>
                <div className="font-medium">{user.phoneNumber}</div>
              </div>
            </div>
            {driver && (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Truck className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Vehicle Type</div>
                    <div className="font-medium">{driver.vehicleType}</div>
                  </div>
                </div>
                {driver.licensePlate && (
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Shield className="size-4" />
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-500">License Plate</div>
                      <div className="font-medium">{driver.licensePlate}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Shield className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Verification Status</div>
                    <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
                      driver.status === 'APPROVED'
                        ? 'bg-green-100 text-green-700'
                        : driver.status === 'REJECTED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {driver.status}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Delivery History */}
        <div className="mt-6 rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold">Delivery History</h2>
          {error ? (
            <p className="mt-4 text-red-500">{error}</p>
          ) : deliveries.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed p-8 text-center text-gray-500">
              No deliveries yet.
            </div>
          ) : (
            <div className="mt-4 divide-y">
              {deliveries.map((del) => (
                <div key={del.id} className="flex items-center justify-between py-4">
                  <div>
                    <div className="font-semibold">ORD-{del.order.id.slice(0, 6).toUpperCase()}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(del.createdAt).toLocaleDateString()} - {del.order.deliveryAddress}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[del.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      {del.status}
                    </span>
                    <div className="mt-1 font-bold">{formatBirr(del.order.totalAmount)}</div>
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