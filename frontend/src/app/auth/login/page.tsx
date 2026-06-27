'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PersonnelLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('');
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login verification failed');

      // Save token and user details to local storage
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      setStatusMessage('🎉 Success! Redirecting...');

      // Redirect based on role
      if (data.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (data.user.role === 'DRIVER') {
        router.push('/driver/dashboard');
      } else {
        setStatusMessage('Authorized, but this role is unmapped.');
      }
    } catch (err: any) {
      setStatusMessage('❌ Error: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', padding: '25px', fontFamily: 'sans-serif', border: '1px solid #eaeaea', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Portal Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <input name="email" type="email" placeholder="Email Address" required onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
        <input name="password" type="password" placeholder="Password" required onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />

        <button type="submit" style={{ marginTop: '10px', padding: '12px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          Verify Credentials
        </button>
      </form>
      {statusMessage && <p style={{ marginTop: '20px', padding: '10px', borderRadius: '6px', backgroundColor: '#f9f9f9', fontWeight: '500', textAlign: 'center' }}>{statusMessage}</p>}
    </div>
  );
}