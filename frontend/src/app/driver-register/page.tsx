'use client';

import { useState } from 'react';

export default function DriverRegister() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    vehicleType: 'MOTORCYCLE',
    licensePlate: '',
    idImageUrl: 'https://placehold.co/600x400.png', // Temporary placeholder fallback
    licenseImageUrl: '',
  });
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('');
    try {
      const res = await fetch('http://localhost:5001/api/auth/register/driver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      setStatusMessage('🎉 Success! ' + data.message);
    } catch (err: any) {
      setStatusMessage('❌ Error: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '40px auto', padding: '25px', fontFamily: 'sans-serif', border: '1px solid #eaeaea', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Driver Onboarding Registration</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input name="firstName" placeholder="First Name" required onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
          <input name="lastName" placeholder="Last Name" required onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
        </div>
        <input name="email" type="email" placeholder="Email Address" required onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
        <input name="password" type="password" placeholder="Password (Min 6 characters)" required onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
        <input name="phoneNumber" placeholder="Phone Number" required onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
        
        <label style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '-4px' }}>Select Your Vehicle:</label>
        <select name="vehicleType" onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff' }}>
          <option value="MOTORCYCLE">Motorcycle</option>
          <option value="BAJAJ">Bajaj</option>
          <option value="BICYCLE">Bicycle</option>
          <option value="CAR">Car</option>
          <option value="FOOT">Foot</option>
        </select>

        <input name="licensePlate" placeholder="License Plate Number (If motorized)" onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
        <input name="licenseImageUrl" placeholder="License Proof Image URL" onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />

        <button type="submit" style={{ marginTop: '10px', padding: '12px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          Submit Application
        </button>
      </form>
      {statusMessage && <p style={{ marginTop: '20px', padding: '10px', borderRadius: '6px', backgroundColor: '#f9f9f9', fontWeight: '500', textAlign: 'center' }}>{statusMessage}</p>}
    </div>
  );
}