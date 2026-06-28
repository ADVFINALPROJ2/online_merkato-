'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface OrderDetails {
  id: string;
  status: string;
  delivery: {
    runnerId: string | null;
    status: string;
  };
  items: {
    product: {
      shop: {
        location: {
          address: string;
          city: string;
          state: string;
          zipCode: string;
        };
      };
    };
  }[];
  buyer: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
}

export default function OrderPage() {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`http://localhost:3000/driver/orders/${router.query.id}`);
      const data = await res.json();
      if (res.ok) {
        setOrder(data);
      } else {
        throw new Error(data.message || 'Failed to fetch order details');
      }
    } catch (err: any) {
      console.error('Failed to pull order details', err);
      setStatus({ type: 'error', message: err.message || 'Could not load order details.' });
    }
  };

  if (!order) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '25px', fontFamily: 'sans-serif', border: '1px solid #eaeaea', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginBottom: '10px', textAlign: 'center' }}>Order Details</h2>
        
        {status.message && (
          <p style={{ padding: '12px', borderRadius: '6px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f9f9f9', color: status.type === 'success' ? 'green' : status.type === 'error' ? 'red' : '#555' }}>
            {status.message}
          </p>
        )}

        <p style={{ fontStyle: 'italic', color: '#999', marginTop: '20px', textAlign: 'center' }}>Loading order details...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '25px', fontFamily: 'sans-serif', border: '1px solid #eaeaea', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginBottom: '10px', textAlign: 'center' }}>Order Details</h2>
      
      {status.message && (
        <p style={{ padding: '12px', borderRadius: '6px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f9f9f9', color: status.type === 'success' ? 'green' : status.type === 'error' ? 'red' : '#555' }}>
          {status.message}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#fff' }}>
          <h3>Assignment Details</h3>
          <p>Status: {order.delivery.status}</p>
          {order.delivery.runnerId ? (
            <p>Assigned to: {order.delivery.runnerId}</p>
          ) : (
            <p>No driver assigned yet.</p>
          )}
        </div>

        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#fff' }}>
          <h3>Pickup Shop Location</h3>
          <p>Address: {order.items[0].product.shop.location.address}</p>
          <p>City: {order.items[0].product.shop.location.city}</p>
          <p>State: {order.items[0].product.shop.location.state}</p>
          <p>Zip Code: {order.items[0].product.shop.location.zipCode}</p>
        </div>

        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#fff' }}>
          <h3>Customer Drop-off</h3>
          <p>Name: {order.buyer.firstName} {order.buyer.lastName}</p>
          <p>Phone Number: {order.buyer.phoneNumber}</p>
        </div>
      </div>
    </div>
  );
}
