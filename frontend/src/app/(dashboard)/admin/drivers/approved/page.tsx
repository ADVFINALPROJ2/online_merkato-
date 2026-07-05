'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';

interface Delivery {
  id: string;
  status: string;
  order: {
    id: string;
    createdAt: string;
    buyer: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
    };
    items: {
      product: {
        name: string;
      };
    }[];
  };
}   ``

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    api.get('/admin/drivers/pending')
      .then(res => setDrivers(res.data))
      .catch(console.error);
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/admin/drivers/${id}/status`, { status });
    location.reload();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Pending Drivers</h1>

      {drivers.map((d: any) => (
        <div key={d.id} className="border p-4 mb-3 rounded">
          <p>{d.user.firstName} {d.user.lastName}</p>
          <p>{d.vehicleType}</p>

          <button onClick={() => updateStatus(d.id, 'APPROVED')} className="bg-green-500 text-white px-3 py-1 mr-2">
            Approve
          </button>

          <button onClick={() => updateStatus(d.id, 'REJECTED')} className="bg-red-500 text-white px-3 py-1">
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}