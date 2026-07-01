'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Package, MapPin, Copy, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const txRef = searchParams.get('tx');
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!txRef) {
      setError('Invalid transaction reference.');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`http://localhost:5000/api/order/verify/${txRef}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setOrder(data.data);
        } else {
          setError(data.message || 'Failed to fetch order details.');
        }
      } catch (err) {
        setError('Connection error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [txRef]);

  const copyOrderId = () => {
    if (order?.id) {
      navigator.clipboard.writeText(order.id);
      toast.success('Order ID copied');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-emerald-600" /></div>;
  if (error) return <div className="text-center py-20 text-red-600"><AlertCircle className="mx-auto mb-2" />{error}</div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="rounded-full bg-emerald-100 p-4 mb-4">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Order Confirmed!</h1>
        <p className="text-stone-500">Thank you for your order. We&apos;ve sent a confirmation email.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Order ID</p>
              <button onClick={copyOrderId} className="flex items-center gap-1.5 text-sm font-mono font-bold text-blue-600">
                {order.id} <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Total Paid</p>
              <p className="text-sm font-medium text-stone-900">Br {order.amount.toLocaleString()}</p>
            </div>
          </div>
          {/* Add your item map loop here using order.items */}
        </CardContent>
      </Card>
      
      <div className="flex gap-3 mt-6">
        <Button asChild className="flex-1"><Link href="/orders">View Order History</Link></Button>
      </div>
    </div>
  );
}