'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface PendingDriver {
  id: string;
  vehicleType: string;
  licensePlate: string | null;
  idImageUrl: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
}

export default function DriverDashboard() {
  const [drivers, setDrivers] = useState<PendingDriver[]>([]);
  const [status, setStatus] = useState({ type: '', message: '' });
  const router = useRouter();

  useEffect(() => {
    fetchPendingDrivers();
  }, []);

  const fetchPendingDrivers = async () => {
    try {
      const res = await fetch('http://localhost:3001/admin/drivers/pending');
      const data = await res.json();
      if (res.ok) {
        setDrivers(data);
      } else {
        throw new Error(data.message || 'Failed to fetch drivers');
      }
    } catch (err: any) {
      console.error('Failed to pull verification applications', err);
      setStatus({ type: 'error', message: err.message || 'Could not load pending drivers.' });
    }
  };

  const handleDecision = async (id: string, decision: 'APPROVED' | 'REJECTED') => {
    setStatus({ type: 'loading', message: 'Updating driver status...' });
    try {
      const res = await fetch(`http://localhost:3001/admin/drivers/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: decision }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Status update failed');
      
      setStatus({ type: 'success', message: `Driver application was successfully ${decision.toLowerCase()}!` });
      fetchPendingDrivers(); // Refresh the list
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Something went wrong.' });
    }
  };

  const handleLogin = async () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    try {
      const res = await fetch('http://localhost:3001/driver/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value, password: password.value }),
      });

      if (!res.ok) throw new Error('Invalid credentials');

      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      router.push('/driver/dashboard');
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Login failed.' });
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '25px', fontFamily: 'sans-serif', border: '1px solid #eaeaea', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginBottom: '10px', textAlign: 'center' }}>Driver Dashboard</h2>
      
      {status.message && (
        <p style={{ padding: '12px', borderRadius: '6px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f9f9f9', color: status.type === 'success' ? 'green' : status.type === 'error' ? 'red' : '#555' }}>
          {status.message}
        </p>
      )}

      <h3 style={{ marginBottom: '10px', textAlign: 'center' }}>Login</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        <div style={{ margin: '10px 0' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input type="email" id="email" required />
        </div>
        <div style={{ margin: '10px 0' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input type="password" id="password" required />
        </div>
        <button onClick={handleLogin} style={{ padding: '8px 14px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Login
        </button>
      </form>

      {drivers.length === 0 ? (
        <p style={{ fontStyle: 'italic', color: '#999', marginTop: '20px', textAlign: 'center' }}>No pending courier profiles require review at this time.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
          {drivers.map((driver) => (
            <div key={driver.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{driver.user.firstName} {driver.user.lastName}</h4>
                <p style={{ margin: '2px 0', fontSize: '14px', color: '#555' }}>📧 {driver.user.email} | 📞 {driver.user.phoneNumber}</p>
                <p style={{ margin: '2px 0', fontSize: '14px', color: '#555' }}>🚗 Mode: <strong>{driver.vehicleType}</strong> {driver.licensePlate ? `(${driver.licensePlate})` : ''}</p>
                <a href={driver.idImageUrl} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#0070f3', textDecoration: 'none', display: 'inline-block', marginTop: '5px' }}>View ID Attachment ↗</a>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleDecision(driver.id, 'APPROVED')} style={{ padding: '8px 14px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Approve
                </button>
                <button onClick={() => handleDecision(driver.id, 'REJECTED')} style={{ padding: '8px 14px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
