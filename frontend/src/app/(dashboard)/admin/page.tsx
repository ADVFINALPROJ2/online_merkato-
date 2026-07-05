'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminHome() {
  const router = useRouter();
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/admin/summary')
      .then((res) => res.json())
      .then(setSummary)
      .catch(console.error);
  }, []);

  const Card = ({
    title,
    value,
    color,
  }: {
    title: string;
    value: number;
    color: string;
  }) => (
    <div
      style={{
        padding: '20px',
        borderRadius: '12px',
        background: 'white',
        border: '1px solid #e5e7eb',
      }}
    >
      <p style={{ fontSize: '12px', color: '#666' }}>{title}</p>
      <h2 style={{ color, fontSize: '24px' }}>{value}</h2>
    </div>
  );

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p style={{ color: '#666' }}>Platform overview</p>

      {summary && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '15px',
            marginTop: '20px',
          }}
        >
          <Card
            title="Pending Drivers"
            value={summary.drivers.pending}
            color="#f59e0b"
          />
          <Card
            title="Approved Drivers"
            value={summary.drivers.approved}
            color="#22c55e"
          />
          <Card
            title="Pending Sellers"
            value={summary.sellers.pending}
            color="#3b82f6"
          />
          <Card
            title="Unassigned Orders"
            value={summary.fulfillment.unassignedOrders}
            color="#ef4444"
          />
        </div>
      )}

      {/* QUICK NAV */}
      <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
        <button onClick={() => router.push('/admin/dashboard')}>
          Review Drivers
        </button>

        <button onClick={() => router.push('/admin/orders/unassigned')}>
          Assign Orders
        </button>

        <button onClick={() => router.push('/admin/sellers/pending')}>
          Review Sellers
        </button>
      </div>
    </div>
  );
}