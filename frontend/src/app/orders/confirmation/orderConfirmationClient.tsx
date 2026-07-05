"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, AlertCircle, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function OrderConfirmationClient() {
  const searchParams = useSearchParams();
  const txRef = searchParams.get("tx");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!txRef) {
      setError("Invalid transaction reference.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/order/verify/${txRef}`
        );

        const data = await res.json();

        if (res.ok && data.success) {
          setOrder(data.data);
        } else {
          setError(data.message || "Failed to fetch order.");
        }
      } catch {
        setError("Connection error.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [txRef]);

  const copyOrderId = () => {
    if (order?.id) {
      navigator.clipboard.writeText(order.id);
      toast.success("Copied");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        <AlertCircle /> {error}
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-6">
        <CheckCircle2 className="text-green-600 mx-auto" size={40} />
        <h1 className="text-2xl font-bold">Order Confirmed</h1>
      </div>

      <Card>
        <CardContent className="p-4">
          <p>Order ID:</p>
          <button onClick={copyOrderId} className="text-blue-600">
            {order?.id} <Copy size={14} />
          </button>

          <p>Total: Br {order?.amount}</p>
        </CardContent>
      </Card>
    </div>
  );
}