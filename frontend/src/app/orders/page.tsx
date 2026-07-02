"use client";

import React, { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  MapPin,
} from "lucide-react";
import { orderService } from "@/services/order-service";

type ProgressStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

interface OrderItem {
  product: {
    name: string;
    description?: string;
  };
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  createdAt: string;
  totalAmount: number;
  status: ProgressStatus;
  deliveryAddress: string;
  items: OrderItem[];
  delivery?: {
    runner?: {
      firstName: string;
      lastName: string;
    };
  };
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusStep = (status: ProgressStatus) => {
    const steps: ProgressStatus[] = [
      "PENDING",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
    ];
    return steps.indexOf(status);
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500">Loading orders...</div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="text-4xl font-bold mb-2">My Orders</h1>
        <p className="text-slate-500 mb-8">
          Track your real orders from database
        </p>

        {orders.length === 0 ? (
          <div className="p-16 text-center bg-white border rounded-xl">
            No orders found
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const step = getStatusStep(order.status);

              return (
                <div
                  key={order.id}
                  className="bg-white p-6 rounded-xl border"
                >
                  {/* Header */}
                  <div className="flex justify-between border-b pb-3 mb-4">
                    <div>
                      <p className="font-mono text-blue-600 text-sm">
                        {order.id}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span className="text-xs px-3 py-1 rounded-full bg-slate-100">
                      {order.status}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <div>
                          <p className="font-semibold">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            Qty {item.quantity}
                          </p>
                        </div>

                        <p className="font-bold">
                          Br {item.unitPrice * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t pt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span>Br {order.totalAmount}</span>
                  </div>

                  {/* Address */}
                  <p className="text-xs text-slate-500 mt-2">
                    📍 {order.deliveryAddress}
                  </p>

                  {/* Courier */}
                  {order.delivery?.runner && (
                    <p className="text-xs mt-1 text-slate-500">
                      🚚 Courier:{" "}
                      {order.delivery.runner.firstName}{" "}
                      {order.delivery.runner.lastName}
                    </p>
                  )}

                  {/* Status progress */}
                  {order.status !== "CANCELLED" && (
                    <div className="flex justify-between mt-6">
                      {["Pending", "Confirmed", "Shipped", "Delivered"].map(
                        (label, i) => {
                          const Icon = [
                            Clock,
                            CheckCircle2,
                            Truck,
                            PackageCheck,
                          ][i];

                          const active = step >= i;

                          return (
                            <div
                              key={label}
                              className="flex flex-col items-center"
                            >
                              <div
                                className={`w-8 h-8 flex items-center justify-center rounded-full border ${
                                  active
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-slate-400"
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className="text-xs mt-1">{label}</span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}

                  {/* Cancel state */}
                  {order.status === "CANCELLED" && (
                    <div className="mt-4 text-red-600 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Cancelled Order
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}