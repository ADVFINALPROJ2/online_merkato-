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
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const user = await login(data);

      // Role-based redirect
      if (user.role === 'SELLER') {
        router.push('/dashboard');
      }if (user.role === 'Admin'){
        router.push('/admin');
      }if (user.role === 'delivery'){
        router.push('/delivery');
      }if(user.role === 'BUYER') {
        router.push('/buyer');
      }
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader><CardTitle>Sign In</CardTitle></CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {serverError && <div className="text-red-600 text-sm">{serverError}</div>}
          <Input {...register('email')} placeholder="Email" />
          <Input type="password" {...register('password')} placeholder="Password" />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
           <div className="text-center text-sm mt-4">
            Don't have an account?{' '}
            <Link href="/role-selection" className="text-blue-600 hover:underline font-semibold">
              Register
            </Link>
          </div>

        </CardContent>
      </form>
    </Card>

  );
 
}