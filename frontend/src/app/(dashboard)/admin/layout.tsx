'use client';

import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR */}
      <aside
        style={{
          width: '240px',
          background: '#0f172a',
          color: 'white',
          padding: '20px',
        }}
      >
        <h2 style={{ marginBottom: '20px' }}>Admin Panel</h2>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link href="/admin" style={{ color: 'white' }}>Dashboard</Link>
          <Link href="/admin/dashboard" style={{ color: 'white' }}>Drivers</Link>
          <Link href="/admin/drivers/approved" style={{ color: 'white' }}>Approved Drivers</Link>
          <Link href="/admin/sellers/pending" style={{ color: 'white' }}>Sellers</Link>
          <Link href="/admin/orders/unassigned" style={{ color: 'white' }}>Orders</Link>
          <Link href="/admin/summary" style={{ color: 'white' }}>Summary</Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '30px', background: '#f8fafc' }}>
        {children}
      </main>
    </div>
  );
}