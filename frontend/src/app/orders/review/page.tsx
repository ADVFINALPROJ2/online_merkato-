"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { orderService } from "@/services/order-service";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

interface HistoryOrder {
  id: string;
  createdAt: string;
  totalAmount: number;
  status: OrderStatus;
  items: {
    product: { name: string };
    quantity: number;
  }[];
}

const statusStyles: Record<
  OrderStatus,
  { label: string; variant: "success" | "danger" | "warning" | "default" }
> = {
  PENDING: { label: "Pending", variant: "warning" },
  CONFIRMED: { label: "Confirmed", variant: "default" },
  IN_TRANSIT: { label: "In Transit", variant: "default" },
  DELIVERED: { label: "Delivered", variant: "success" },
  CANCELLED: { label: "Cancelled", variant: "danger" },
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<HistoryOrder[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items?.some((i) =>
        i.product.name.toLowerCase().includes(search.toLowerCase())
      )
  );

  if (loading) {
    return <div className="p-10 text-center">Loading orders...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <Input
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center p-10 border rounded-xl">
          No orders found
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const s = statusStyles[order.status];

            const summary =
              order.items?.map((i) => i.product.name).join(", ") || "Order";

            return (
              <Link key={order.id} href={`/orders/track?id=${order.id}`}>
                <Card className="hover:border-stone-300 transition-colors cursor-pointer">
                  <CardContent className="py-4 flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-50 border">
                      <Package className="h-5 w-5 text-stone-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-semibold">
                          {order.id}
                        </span>
                        <Badge variant={s.variant}>{s.label}</Badge>
                      </div>

                      <p className="text-sm text-stone-500 truncate mt-1">
                        {summary}
                      </p>

                      <p className="text-xs text-stone-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="font-bold">
                      Br {order.totalAmount}
                    </div>

                    <ChevronRight className="h-4 w-4 text-stone-300" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}