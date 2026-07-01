'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function DriverRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    vehicleType: 'MOTORCYCLE',
    licensePlate: '',
    idImageUrl: 'https://placehold.co/600x400.png', // Temporary placeholder fallback
    licenseImageUrl: '',
  });
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('');
    try {
      const res = await fetch('/api/auth/register/driver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      setStatusMessage('Success! ' + data.message);
    } catch (err: any) {
      setStatusMessage('❌ Error: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 antialiased">
      <div className="w-full max-w-xl space-y-4 my-8">
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
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Register</span>
              <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">as Delivery Driver</CardTitle>
              <CardDescription className="text-slate-500 text-sm">Fill out the credentials below to onboard your vehicle.</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6 pt-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              {statusMessage && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm font-medium border text-center ${
                    statusMessage.startsWith('Success')
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {statusMessage}
                </div>
              )}

              {/* Row: Name Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-semibold text-slate-700">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    required
                    onChange={handleChange}
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-semibold text-slate-700">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    required
                    onChange={handleChange}
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  onChange={handleChange}
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/50 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Min 6 characters"
                  required
                  onChange={handleChange}
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/50 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
                />
              </div>

              {/* Phone Number Input */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-semibold text-slate-700">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="+251..."
                  required
                  onChange={handleChange}
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/50 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
                />
              </div>

              {/* Vehicle Type Dropdown Selection */}
              <div className="space-y-2">
                <Label htmlFor="vehicleType" className="text-sm font-semibold text-slate-700">Select Your Vehicle</Label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm ring-offset-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="MOTORCYCLE">Motorcycle</option>
                  <option value="BAJAJ">Bajaj</option>
                  <option value="BICYCLE">Bicycle</option>
                  <option value="CAR">Car</option>
                  <option value="FOOT">Foot</option>
                </select>
              </div>

              {/* License Plate Input */}
              <div className="space-y-2">
                <Label htmlFor="licensePlate" className="text-sm font-semibold text-slate-700">License Plate Number (If motorized)</Label>
                <Input
                  id="licensePlate"
                  name="licensePlate"
                  placeholder="e.g. AA-3-A1234"
                  onChange={handleChange}
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/50 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
                />
              </div>

              {/* License Proof Image Input */}
              <div className="space-y-2">
                <Label htmlFor="licenseImageUrl" className="text-sm font-semibold text-slate-700">License Proof Image URL</Label>
                <Input
                  id="licenseImageUrl"
                  name="licenseImageUrl"
                  placeholder="https://example.com/image.jpg"
                  onChange={handleChange}
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/50 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 active:scale-[0.98]">
                  Submit Application
                </Button>
              </div>

              <div className="flex items-center justify-center pt-2 text-sm font-medium">
                <button 
                  type="button"
                  onClick={() => router.push('/login')} 
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Already have a driver account? <span className="text-blue-600 hover:underline">Sign In</span>
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}