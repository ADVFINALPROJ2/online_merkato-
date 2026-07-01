'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  ArrowLeft,
  Send,
  MessageSquare,
  User,
  Store,
  Phone,
} from 'lucide-react';

interface Message {
  id: string;
  orderId: string;
  senderId: string;
  receiverId: string;
  body: string;
  createdAt: string;
}

interface ChatParticipant {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'buyer' | 'seller';
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

function getInitials(first?: string, last?: string) {
  return `${(first || '?')[0]}${(last || '?')[0]}`.toUpperCase();
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [user, setUser] = useState<{ id: string; firstName?: string; lastName?: string } | null>(null);
  const [participants, setParticipants] = useState<ChatParticipant[]>([]);
  const [activeRecipient, setActiveRecipient] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
    }
    if (orderId) {
      Promise.all([fetchOrderDetails(), fetchMessages()]).finally(() => setLoading(false));

      const socketInstance = io(window.location.origin, {
        transports: ['websocket', 'polling'],
      });

      socketInstance.on('message', (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [orderId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchOrderDetails = async () => {
    try {
      const res = await api.get(`/delivery/orders/${orderId}`);
      const delivery = res.data;
      const parts: ChatParticipant[] = [];

      if (delivery.order?.buyer) {
        parts.push({
          id: delivery.order.buyer.id,
          firstName: delivery.order.buyer.firstName,
          lastName: delivery.order.buyer.lastName,
          phoneNumber: delivery.order.buyer.phoneNumber,
          role: 'buyer',
        });
      }

      const seller = delivery.order?.items?.[0]?.product?.shop?.seller;
      if (seller) {
        parts.push({
          id: seller.id,
          firstName: seller.firstName,
          lastName: seller.lastName,
          phoneNumber: seller.phoneNumber,
          role: 'seller',
        });
      }

      setParticipants(parts);
      if (parts.length > 0) {
        setActiveRecipient(parts[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch order details', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/chat/messages/${orderId}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const handleSend = async () => {
    if (!text.trim() || !activeRecipient) return;
    setSending(true);
    try {
      const res = await api.post(`/chat/messages/${orderId}`, {
        text: text.trim(),
        receiverId: activeRecipient,
      });
      setMessages((prev) => [...prev, res.data]);
      setText('');
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setSending(false);
    }
  };

  const activeParticipant = participants.find((p) => p.id === activeRecipient);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] antialiased">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        
        {/* Top Header Row */}
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push(`/driver/orders/${orderId}`)} 
            className="h-10 rounded-xl px-4 border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold gap-1.5 shadow-sm shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">Order Message Coordination</h1>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Order #{orderId?.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>

        <Card className="border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl bg-white overflow-hidden flex flex-col">
          
          {/* Channel / Participants Tab Header */}
          {participants.length > 1 && (
            <div className="flex gap-2 p-3 bg-slate-50/50 border-b border-slate-100/80">
              {participants.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveRecipient(p.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 border ${
                    activeRecipient === p.id
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/15'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  {p.role === 'buyer' ? (
                    <User className="h-3.5 w-3.5" />
                  ) : (
                    <Store className="h-3.5 w-3.5" />
                  )}
                  {p.firstName} {p.lastName} ({p.role === 'buyer' ? 'Buyer' : 'Seller'})
                </button>
              ))}
            </div>
          )}

          {/* Active Contact Banner */}
          {activeParticipant && (
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-10 w-10 border border-blue-100 shadow-sm">
                  <AvatarFallback className="bg-blue-50 text-blue-600 text-sm font-bold">
                    {getInitials(activeParticipant.firstName, activeParticipant.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {activeParticipant.firstName} {activeParticipant.lastName}
                  </p>
                  <p className="text-xs font-medium text-slate-400 mt-0.5 uppercase tracking-wide">
                    Recipient channel: {activeParticipant.role}
                  </p>
                </div>
              </div>
              <a 
                href={`tel:${activeParticipant.phoneNumber}`}
                className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-bold transition-all shadow-sm shrink-0"
              >
                <Phone className="h-3.5 w-3.5 text-blue-500" />
                {activeParticipant.phoneNumber}
              </a>
            </div>
          )}

          {/* Message Stream */}
          <div className="h-[420px] overflow-y-auto p-5 space-y-4 bg-slate-50/20">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="rounded-2xl bg-blue-50 text-blue-600 p-4 border border-blue-100/50 mb-3 shadow-sm">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold text-slate-800">Secure Message Sandbox</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                  {activeParticipant
                    ? `Send a coordinate message to ${activeParticipant.firstName} to establish logistics connectivity.`
                    : 'Select a route user to initialize messaging.'}
                </p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMe = msg.senderId === user?.id;
                const showAvatar = i === 0 || messages[i - 1]?.senderId !== msg.senderId;
                const sender = participants.find((p) => p.id === msg.senderId);
                const senderName = sender ? `${sender.firstName} ${sender.lastName}` : 'System User';

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} transition-opacity animate-fade-in`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${isMe ? 'flex-row-reverse' : ''}`}>
                      {showAvatar ? (
                        <Avatar className="h-8 w-8 mt-1 border border-slate-100 shadow-sm shrink-0">
                          <AvatarFallback
                            className={`text-xs font-bold ${
                              isMe
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {isMe
                              ? getInitials(user?.firstName, user?.lastName)
                              : getInitials(sender?.firstName, sender?.lastName)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8 shrink-0" />
                      )}
                      <div className="space-y-1">
                        {showAvatar && (
                          <p className={`text-[11px] font-bold tracking-wide text-slate-400/90 uppercase ${isMe ? 'text-right' : ''}`}>
                            {isMe ? 'Driver (You)' : senderName}
                          </p>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                            isMe
                              ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                              : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                          }`}
                        >
                          {msg.body}
                        </div>
                        <p className={`text-[10px] font-semibold text-slate-400 ${isMe ? 'text-right' : ''}`}>
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Control Box */}
          <div className="border-t border-slate-100 bg-white p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  activeParticipant
                    ? `Message ${activeParticipant.firstName}...`
                    : 'Select participant to communicate...'
                }
                disabled={!activeRecipient}
                className="flex-1 h-11 rounded-xl border-slate-200 bg-slate-50/50 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
              />
              <Button
                type="submit"
                disabled={!text.trim() || !activeRecipient || sending}
                className="shrink-0 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 font-bold shadow-md shadow-blue-500/15 transition-all duration-200 active:scale-[0.98]"
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}