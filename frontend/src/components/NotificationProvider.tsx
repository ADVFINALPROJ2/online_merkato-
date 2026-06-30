'use client';

import { useEffect } from 'react';
import { io } from 'socket-io-client';
import { toast } from 'sonner';

const SOCKET_URL = 'http://10.2.0.2:5000'; 

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Safely get the active user ID from your authentication flow storage
    const currentUserId = localStorage.getItem('userId'); 
    if (!currentUserId) return;

    const socket = io(SOCKET_URL);

    // Join the distinct notification room channel
    socket.emit('join_room', currentUserId);

    // 1. Buyer Alerts
    socket.on('order_status', (data) => {
      toast.success(data.message || 'Order update received');
    });

    // 2. Shop Owner Alerts
    socket.on('new_order', (data) => {
      toast.info(data.message || '🎉 You have received a new order!');
    });

    // 3. Order Cancellations
    socket.on('order_cancelled', (data) => {
      toast.error(data.message || 'An order was cancelled.');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <>{children}</>;
}