'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Store, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { useAuth } from '@/hooks/use-auth';
import { AxiosError } from 'axios';

const loginSchema = z.object({
  email: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setServerError('');
    try {
      await login(data);
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof AxiosError) {
        setServerError(err.response?.data?.message || 'Invalid credentials');
      } else {
        setServerError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="items-center text-center">
        <div className="rounded-full bg-amber-100 p-3 mb-2">
          <Store className="h-6 w-6 text-amber-600" />
        </div>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your seller account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {serverError && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {serverError}
            </div>
          )}
          <FormField label="Email or Phone" error={errors.email?.message}>
            <Input
              type="text"
              placeholder="you@example.com"
              {...register('email')}
              error={!!errors.email}
            />
          </FormField>
          <FormField label="Password" error={errors.password?.message}>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                {...register('password')}
                error={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FormField>
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Sign In
          </Button>
        </CardContent>
      </form>
      <CardFooter className="justify-center">
        <p className="text-sm text-stone-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-amber-600 hover:text-amber-700">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
