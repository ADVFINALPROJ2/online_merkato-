'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField } from '@/components/ui/form-field';
import { Truck, Bike, Car, Footprints, Warehouse, ArrowLeft, ImageIcon } from 'lucide-react';

const VEHICLE_OPTIONS = [
  { value: 'MOTORCYCLE', label: 'Motorcycle', icon: Bike },
  { value: 'CAR', label: 'Car', icon: Car },
  { value: 'TRUCK', label: 'Truck', icon: Truck },
  { value: 'BAJAJ', label: 'Bajaj', icon: Warehouse },
  { value: 'BICYCLE', label: 'Bicycle', icon: Bike },
  { value: 'FOOT', label: 'Foot', icon: Footprints },
];

export default function DriverRegister() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    vehicleType: '',
    licensePlate: '',
    idImageUrl: '',
    licenseImageUrl: '',
  });
  const [status, setStatus] = useState<{ type: string; message: string }>({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleRegister = async () => {
    const nameParts = form.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/auth/register/driver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName,
          lastName,
          phoneNumber: form.phoneNumber,
          vehicleType: form.vehicleType,
          licensePlate: form.licensePlate || undefined,
          idImageUrl: form.idImageUrl,
          licenseImageUrl: form.licenseImageUrl || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Registration failed');
      }

      setStatus({ type: 'success', message: 'Application submitted! Forwarding to verification desk...' });
      setTimeout(() => router.push('/driver/dashboard'), 1500);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Registration failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 antialiased">
      <Card className="w-full max-w-2xl border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl bg-white overflow-hidden">
        
        <CardHeader className="text-center pt-8 pb-6 border-b border-slate-50 bg-slate-50/40">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
            <Truck className="h-5 w-5" />
          </div>
          <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Onboarding Network Application</CardTitle>
          <CardDescription className="text-slate-400 font-semibold text-xs uppercase tracking-wider mt-1">
            Fill out your carrier specifications to join the fleet
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {status.message && (
            <div
              className={`rounded-xl px-4 py-3 text-sm font-semibold text-center border shadow-sm ${
                status.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {status.message}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
            className="space-y-5"
          >
            {/* Auth Section */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Email Access">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={update('email')}
                  required
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/50 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
                />
              </FormField>
              <FormField label="Secure Password">
                <Input
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={update('password')}
                  required
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/50 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
                />
              </FormField>
            </div>

            {/* Profile Section */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Full Name">
                <Input
                  placeholder="John Doe"
                  value={form.fullName}
                  onChange={update('fullName')}
                  required
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/50 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
                />
              </FormField>
              <FormField label="Mobile Contact Line">
                <Input
                  type="tel"
                  placeholder="+251 91 234 5678"
                  value={form.phoneNumber}
                  onChange={update('phoneNumber')}
                  required
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/50 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
                />
              </FormField>
            </div>

            {/* Vehicle Options Matrix */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Mode of Transport</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {VEHICLE_OPTIONS.map((v) => {
                  const Icon = v.icon;
                  const selected = form.vehicleType === v.value;
                  return (
                    <button
                      key={v.value}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, vehicleType: v.value }))}
                      className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-3 text-xs font-bold transition-all duration-200 h-20 ${
                        selected
                          ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md shadow-blue-500/15'
                          : 'border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${selected ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{v.label}</span>
                    </button>
                  );
                })}
              </div>
              {!form.vehicleType && (
                <p className="text-[11px] text-rose-500 font-bold tracking-tight mt-1">Please select an asset assignment type to activate submission.</p>
              )}
            </div>

            {/* Verification Inputs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="License Plate Tag (Optional)">
                <Input
                  placeholder="AA 2B 12345"
                  value={form.licensePlate}
                  onChange={update('licensePlate')}
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/50 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
                />
              </FormField>
              <FormField label="Permit License Document Link (Optional)">
                <Input
                  placeholder="https://example.com/license.jpg"
                  value={form.licenseImageUrl}
                  onChange={update('licenseImageUrl')}
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/50 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
                />
              </FormField>
            </div>

            {/* ID Upload Verification block */}
            <FormField label="National ID Asset Link">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="https://example.com/id-image.jpg"
                    value={form.idImageUrl}
                    onChange={update('idImageUrl')}
                    required
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
                  />
                </div>
                {form.idImageUrl ? (
                  <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
                    <img
                      src={form.idImageUrl}
                      alt="ID Document snapshot preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400 shadow-inner">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                )}
              </div>
            </FormField>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/15 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 mt-4"
              loading={loading}
              disabled={!form.vehicleType || loading}
            >
              {loading ? 'Transmitting Registry Payload...' : 'Submit Carrier Application'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-t border-slate-100 bg-slate-50/50 py-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Already verified?{' '}
            <Link href="/driver/dashboard" className="text-blue-600 hover:text-blue-700 font-bold ml-1 transition-colors">
              Access Console Dashboard &rarr;
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}