'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function SellersPage() {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    api.get('/admin/sellers/pending')
      .then(res => setSellers(res.data))
      .catch(console.error);
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/admin/sellers/${id}/status`, { status });
    location.reload();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Pending Sellers</h1>

      {sellers.map((s: any) => (
        <div key={s.id} className="border p-4 mb-3 rounded">
          <p>{s.seller.firstName} {s.seller.lastName}</p>

          <button onClick={() => updateStatus(s.id, 'APPROVED')} className="bg-green-500 text-white px-3 py-1 mr-2">
            Approve
          </button>

          <button onClick={() => updateStatus(s.id, 'REJECTED')} className="bg-red-500 text-white px-3 py-1">
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}