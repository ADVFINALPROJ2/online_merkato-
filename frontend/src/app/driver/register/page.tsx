'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DriverRegister() {
  const [status, setStatus] = useState({ type: '', message: '' });
  const router = useRouter();

  const handleRegister = async () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const fullName = document.getElementById('fullName') as HTMLInputElement;

    try {
      const res = await fetch('http://localhost:3001/driver/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value, password: password.value, fullName: fullName.value }),
      });

      if (!res.ok) throw new Error('Registration failed');

      const data = await res.json();
      setStatus({ type: 'success', message: data.message });
      router.push('/driver/login');
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Registration failed.' });
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '25px', fontFamily: 'sans-serif', border: '1px solid #eaeaea', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginBottom: '10px', textAlign: 'center' }}>Driver Registration</h2>
      
      {status.message && (
        <p style={{ padding: '12px', borderRadius: '6px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f9f9f9', color: status.type === 'success' ? 'green' : status.type === 'error' ? 'red' : '#555' }}>
          {status.message}
        </p>
      )}

      <form onSubmit={(e) => e.preventDefault()}>
        <div style={{ margin: '10px 0' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input type="email" id="email" required />
        </div>
        <div style={{ margin: '10px 0' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input type="password" id="password" required />
        </div>
        <div style={{ margin: '10px 0' }}>
          <label htmlFor="fullName" style={{ display: 'block', marginBottom: '5px' }}>Full Name:</label>
          <input type="text" id="fullName" required />
        </div>
        <button onClick={handleRegister} style={{ padding: '8px 14px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Register
        </button>
      </form>
    </div>
  );
}
