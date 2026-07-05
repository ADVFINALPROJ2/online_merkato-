"use client";

import React, { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
} from "lucide-react";
import { orderService } from "@/services/order-service";

type ProgressStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

interface OrderItem {
  product?: {
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
        console.log("Orders:", data);
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
      <div className="p-10 text-center text-slate-500">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="mb-2 text-4xl font-bold">My Orders</h1>

        <p className="mb-8 text-slate-500">
          Track your orders and delivery progress
        </p>

        {orders.length === 0 ? (
          <div className="rounded-xl border bg-white p-16 text-center">
            No orders found
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const step = getStatusStep(order.status);

              return (
                <div
                  key={order.id}
                  className="rounded-xl border bg-white p-6"
                >
                  {/* Header */}
                  <div className="mb-4 flex justify-between border-b pb-3">
                    <div>
                      <p className="font-mono text-sm text-blue-600">
                        {order.id}
                      </p>

                      <p className="text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                      {order.status}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="mb-4 space-y-2">
                    {order.items?.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between"
                      >
                        <div>
                          <p className="font-semibold">
                            {item.product?.name ?? "Product"}
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
                  <div className="flex justify-between border-t pt-3 font-bold">
                    <span>Total</span>
                    <span>Br {order.totalAmount}</span>
                  </div>

                  {/* Address */}
                  <p className="mt-2 text-xs text-slate-500">
                    📍 {order.deliveryAddress}
                  </p>

                  {/* Courier */}
                  {order.delivery?.runner && (
                    <p className="mt-1 text-xs text-slate-500">
                      🚚 Courier:{" "}
                      {order.delivery.runner.firstName}{" "}
                      {order.delivery.runner.lastName}
                    </p>
                  )}

                  {/* Progress */}
                  {order.status !== "CANCELLED" && (
                    <div className="mt-6 flex justify-between">
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
                                className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                                  active
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-slate-400"
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                              </div>

                              <span className="mt-1 text-xs">
                                {label}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}

                  {/* Cancelled */}
                  {order.status === "CANCELLED" && (
                    <div className="mt-4 flex items-center gap-2 text-red-600">
                      <XCircle className="h-4 w-4" />
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