'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Bell, BellOff, CheckCheck, Clock, Package, Truck, X } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const isToday =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (isToday) return time;
  const date = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  return `${date} ${time}`;
}

function getIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes('delivery') || t.includes('picked') || t.includes('completed')) return Truck;
  if (t.includes('order')) return Package;
  return Bell;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      // silently fail
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // silently fail
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm transition-all"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white shadow-sm">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-96 rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-8 rounded-lg text-xs font-semibold text-blue-600 hover:text-blue-700 gap-1"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </Button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-10">
                <LoadingSpinner size="sm" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center px-6">
                <BellOff className="h-8 w-8 text-slate-300 mb-3" />
                <p className="text-sm font-bold text-slate-800">No notifications</p>
                <p className="text-xs text-slate-400 mt-1">You&apos;re all caught up.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((n) => {
                  const Icon = getIcon(n.title);
                  return (
                    <button
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`w-full text-left px-5 py-3.5 transition-colors hover:bg-slate-50 ${
                        !n.isRead ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                            !n.isRead
                              ? 'bg-blue-50 border-blue-100 text-blue-600'
                              : 'bg-slate-50 border-slate-100 text-slate-400'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-sm truncate ${
                                !n.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-600'
                              }`}
                            >
                              {n.title}
                            </p>
                            <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap shrink-0 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(n.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                        </div>
                        {!n.isRead && (
                          <div className="h-2 w-2 shrink-0 rounded-full bg-blue-600 mt-2" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
