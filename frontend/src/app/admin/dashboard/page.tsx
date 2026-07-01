'use client';

import { useEffect, useState } from 'react';

interface PendingDriver {
  id: string;
  vehicleType: string;
  licensePlate: string | null;
  idImageUrl: string;
  user: { firstName: string; lastName: string; email: string; phoneNumber: string };
}

interface PendingSeller {
  id: string;
  name: string;
  description: string;
  verificationStatus: string;
  seller: { id: string; firstName: string; lastName: string; email: string; phoneNumber: string };
  location: { region: string; city: string | null } | null;
}

interface UnassignedOrder {
  id: string;
  total: number;
  itemsCount: number;
  buyer: { firstName: string; lastName: string; email: string; phoneNumber: string };
  createdAt: string;
}

interface ApprovedDriver {
  id: string;
  userId: string;
  vehicleType: string;
  licensePlate: string | null;
  user: { firstName: string; lastName: string; email: string; phoneNumber: string };
}

interface Summary {
  drivers: { pending: number; approved: number; rejected: number };
  sellers: { pending: number; approved: number; rejected: number };
  fulfillment: { unassignedOrders: number };
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'drivers' | 'sellers' | 'orders'>('drivers');
  const [drivers, setDrivers] = useState<PendingDriver[]>([]);
  const [sellers, setSellers] = useState<PendingSeller[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [unassignedOrders, setUnassignedOrders] = useState<UnassignedOrder[]>([]);
  const [approvedDrivers, setApprovedDrivers] = useState<ApprovedDriver[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSummary();
    fetchPendingDrivers();
    fetchPendingSellers();
    fetchUnassignedOrders();
    fetchApprovedDrivers();
  }, []);

  const apiFetch = async (path: string) => {
    const res = await fetch(path, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res;
  };

  const fetchSummary = async () => {
    try {
      const res = await apiFetch('/api/admin/summary');
      if (res.ok) setSummary(await res.json());
    } catch { /* ignore */ }
  };

  const fetchPendingDrivers = async () => {
    try {
      const res = await apiFetch('/api/admin/drivers/pending');
      if (res.ok) setDrivers(await res.json());
    } catch (err: any) {
      setStatus({ type: 'error', message: 'Could not load pending drivers.' });
    }
  };

  const fetchPendingSellers = async () => {
    try {
      const res = await apiFetch('/api/admin/sellers/pending');
      if (res.ok) setSellers(await res.json());
    } catch (err: any) {
      setStatus({ type: 'error', message: 'Could not load pending sellers.' });
    }
  };

  const fetchUnassignedOrders = async () => {
    try {
      const res = await apiFetch('/api/admin/orders/unassigned');
      if (res.ok) setUnassignedOrders(await res.json());
    } catch { /* ignore */ }
  };

  const fetchApprovedDrivers = async () => {
    try {
      const res = await apiFetch('/api/admin/drivers/approved');
      if (res.ok) setApprovedDrivers(await res.json());
    } catch { /* ignore */ }
  };

  const handleDriverDecision = async (id: string, decision: 'APPROVED' | 'REJECTED') => {
    setStatus({ type: 'loading', message: 'Updating driver status...' });
    try {
      const res = await fetch(`/api/admin/drivers/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: decision }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed');
      setStatus({ type: 'success', message: `Driver ${decision.toLowerCase()}!` });
      fetchPendingDrivers();
      fetchSummary();
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const handleSellerDecision = async (id: string, decision: 'APPROVED' | 'REJECTED') => {
    setStatus({ type: 'loading', message: 'Updating seller status...' });
    try {
      const res = await fetch(`/api/admin/sellers/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: decision }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed');
      setStatus({ type: 'success', message: `Seller ${decision.toLowerCase()}!` });
      fetchPendingSellers();
      fetchSummary();
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const handleAssignDriver = async (orderId: string) => {
    const driverUserId = selectedDrivers[orderId];
    if (!driverUserId) {
      setStatus({ type: 'error', message: 'Please select a driver first.' });
      return;
    }
    setStatus({ type: 'loading', message: 'Assigning driver to order...' });
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverUserId }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed');
      setStatus({ type: 'success', message: 'Driver assigned successfully!' });
      fetchUnassignedOrders();
      fetchSummary();
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '25px', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '5px' }}>Administrative Verification Center</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Review and manage pending applicant requests.</p>

      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '25px' }}>
          <SummaryCard label="Pending Drivers" count={summary.drivers.pending} color="#f59e0b" />
          <SummaryCard label="Approved Drivers" count={summary.drivers.approved} color="#22c55e" />
          <SummaryCard label="Pending Sellers" count={summary.sellers.pending} color="#f59e0b" />
          <SummaryCard label="Approved Sellers" count={summary.sellers.approved} color="#22c55e" />
          <SummaryCard label="Unassigned Orders" count={summary.fulfillment.unassignedOrders} color="#3b82f6" />
        </div>
      )}

      {status.message && (
        <p style={{ padding: '12px', borderRadius: '6px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f9f9f9', color: status.type === 'success' ? 'green' : status.type === 'error' ? 'red' : '#555', marginBottom: '15px' }}>
          {status.message}
        </p>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('drivers')} style={tabStyle(activeTab === 'drivers')}>Driver Applications ({drivers.length})</button>
        <button onClick={() => setActiveTab('sellers')} style={tabStyle(activeTab === 'sellers')}>Seller Applications ({sellers.length})</button>
        <button onClick={() => setActiveTab('orders')} style={tabStyle(activeTab === 'orders')}>Order Assignment ({unassignedOrders.length})</button>
      </div>

      {activeTab === 'drivers' && (
        drivers.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#999', textAlign: 'center' }}>No pending driver profiles require review.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {drivers.map((driver) => (
              <div key={driver.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{driver.user.firstName} {driver.user.lastName}</h4>
                  <p style={{ margin: '2px 0', fontSize: '14px', color: '#555' }}>{driver.user.email} &middot; {driver.user.phoneNumber}</p>
                  <p style={{ margin: '2px 0', fontSize: '14px', color: '#555' }}>Mode: <strong>{driver.vehicleType}</strong> {driver.licensePlate ? `(${driver.licensePlate})` : ''}</p>
                  <a href={driver.idImageUrl} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#0070f3' }}>View ID Attachment &nearr;</a>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleDriverDecision(driver.id, 'APPROVED')} style={{ padding: '8px 14px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Approve</button>
                  <button onClick={() => handleDriverDecision(driver.id, 'REJECTED')} style={{ padding: '8px 14px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'sellers' && (
        sellers.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#999', textAlign: 'center' }}>No pending seller applications require review.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {sellers.map((shop) => (
              <div key={shop.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{shop.name}</h4>
                  <p style={{ margin: '2px 0', fontSize: '14px', color: '#555' }}>Owner: {shop.seller.firstName} {shop.seller.lastName}</p>
                  <p style={{ margin: '2px 0', fontSize: '14px', color: '#555' }}>{shop.seller.email} &middot; {shop.seller.phoneNumber}</p>
                  <p style={{ margin: '2px 0', fontSize: '13px', color: '#777' }}>{shop.description?.slice(0, 120)}</p>
                  {shop.location && <p style={{ margin: '2px 0', fontSize: '13px', color: '#777' }}>Location: {shop.location.city || shop.location.region}</p>}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleSellerDecision(shop.id, 'APPROVED')} style={{ padding: '8px 14px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Approve</button>
                  <button onClick={() => handleSellerDecision(shop.id, 'REJECTED')} style={{ padding: '8px 14px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'orders' && (
        unassignedOrders.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#999', textAlign: 'center' }}>No unassigned orders at this time.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {unassignedOrders.map((order) => (
              <div key={order.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>Order #{order.id.slice(0, 8)}</h4>
                    <p style={{ margin: '2px 0', fontSize: '14px', color: '#555' }}>Buyer: {order.buyer.firstName} {order.buyer.lastName} &middot; {order.buyer.email}</p>
                    <p style={{ margin: '2px 0', fontSize: '14px', color: '#555' }}>Total: <strong>${Number(order.total).toFixed(2)}</strong> &middot; Items: {order.itemsCount}</p>
                    <p style={{ margin: '2px 0', fontSize: '13px', color: '#777' }}>Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select
                      value={selectedDrivers[order.id] || ''}
                      onChange={(e) => setSelectedDrivers((prev) => ({ ...prev, [order.id]: e.target.value }))}
                      style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
                    >
                      <option value="">Select a driver</option>
                      {approvedDrivers.map((d) => (
                        <option key={d.id} value={d.userId}>
                          {d.user.firstName} {d.user.lastName} ({d.vehicleType})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleAssignDriver(order.id)}
                      style={{ padding: '8px 14px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Assign
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

function SummaryCard({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}40`, borderRadius: '8px', padding: '14px', textAlign: 'center', backgroundColor: '#fff' }}>
      <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color }}>{count}</p>
      <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>{label}</p>
    </div>
  );
}

const tabStyle = (active: boolean) => ({
  padding: '8px 16px',
  backgroundColor: active ? '#0070f3' : '#e2e8f0',
  color: active ? '#fff' : '#333',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold' as const,
});
