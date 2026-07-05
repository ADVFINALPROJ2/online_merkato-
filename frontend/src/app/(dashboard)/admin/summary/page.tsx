'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function SummaryPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/admin/summary')
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">System Summary</h1>

      <p>Pending Drivers: {data.drivers.pending}</p>
      <p>Approved Drivers: {data.drivers.approved}</p>

      <p>Pending Sellers: {data.sellers.pending}</p>

      <p>Unassigned Orders: {data.fulfillment.unassignedOrders}</p>
    </div>
  );
}