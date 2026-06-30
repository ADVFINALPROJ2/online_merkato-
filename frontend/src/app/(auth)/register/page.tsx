'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().min(8, 'Enter a valid phone number'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['BUYER', 'SELLER', 'ADMIN', 'DELIVERY']),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'BUYER' }
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const nameParts = data.fullName.trim().split(/\s+/);
      
      const user = await registerUser({
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' ') || 'User',
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        role: data.role,
         });
        // option

      // Role-based redirect
      if (user.role === 'SELLER') {
        router.push('/seller/dashboard');
      } else {
        router.push('/buyer');
      }
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader><CardTitle>Create your account</CardTitle></CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {serverError && <div className="text-red-600 text-sm">{serverError}</div>}
          <Input {...register('fullName')} placeholder="Full Name" />
          <Input {...register('email')} placeholder="Email" />
          <Input {...register('phoneNumber')} placeholder="Phone Number" />
          <Input type="password" {...register('password')} placeholder="Password" />
          <select {...register('role')} className="w-full border p-2 rounded">
            <option value="BUYER">Buyer</option>
            <option value="SELLER">Seller</option>
          </select>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}