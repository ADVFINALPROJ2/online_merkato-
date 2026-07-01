'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function PersonnelLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [statusMessage, setStatusMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login verification failed');

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (data.user.role === 'DRIVER') {
        router.push('/driver/dashboard');
      } else {
        setStatusMessage('Authorized, but this role is unmapped.');
      }
    } catch (err: any) {
      setStatusMessage(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md space-y-4">
        {/* Back Navigation Link */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors group mb-2"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Choose a different role
        </button>

        <Card className="w-full border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl bg-white p-2">
          <CardHeader className="items-start text-left pt-6 px-6 pb-4">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100/60 shadow-sm">
              <Truck className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Sign In</span>
              <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">as Delivery</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6 pt-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              {statusMessage && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm font-medium border ${
                    statusMessage.startsWith('Authorized')
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {statusMessage}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/50 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 placeholder:text-slate-400 pr-10 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 active:scale-[0.98]">
                  Sign In
                </Button>
              </div>

              <div className="flex items-center justify-between pt-2 text-sm font-medium">
                <button 
                  type="button"
                  onClick={() => router.push('/driver/register')} 
                  className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Create account
                </button>
                <button 
                  type="button"
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}