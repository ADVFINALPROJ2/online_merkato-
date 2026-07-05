'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const ordersRes = await api.get('/admin/orders/unassigned');
      const driversRes = await api.get('/admin/drivers/approved');

      setOrders(ordersRes.data);
      setDrivers(driversRes.data);

      console.log('DRIVERS:', driversRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const assignDriver = async (
    orderId: string,
    driverUserId: string
  ) => {
    if (!driverUserId) return;

    console.log('ORDER:', orderId);
    console.log('DRIVER:', driverUserId);

    try {
      await api.patch(
        `/admin/orders/${orderId}/assign`,
        {
          driverUserId,
        }
      );

      alert('Driver assigned successfully');
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Failed to assign driver');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Assign Orders
      </h1>

      {orders.map((o: any) => (
        <div
          key={o.id}
          className="border p-4 mb-3 rounded"
        >
          <p>
            Order: {o.id.slice(0, 6)}
          </p>

          <select
            defaultValue=""
            onChange={(e) =>
              assignDriver(
                o.id,
                e.target.value
              )
            }
            className="border p-2 rounded mt-2"
          >
            <option value="">
              Select Driver
            </option>

            {drivers.map((d: any) => (
              <option
                key={d.user.id}
                value={d.user.id}
              >
                {d.user.firstName} {d.user.lastName}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}