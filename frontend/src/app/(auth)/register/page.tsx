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

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name is too long'),
    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^\+?[1-9]\d{6,14}$/, 'Enter a valid phone number'),
    email: z.string().email('Enter a valid email').optional().or(z.literal('')),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must include uppercase, lowercase, and a number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setServerError('');
    const nameParts = data.fullName.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || firstName;

    try {
      await registerUser({
        firstName,
        lastName,
        email: data.email || undefined,
        phoneNumber: data.phoneNumber,
        password: data.password,
      });
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof AxiosError) {
        setServerError(err.response?.data?.message || 'Registration failed');
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
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Start selling on Digital Merkato</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {serverError && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {serverError}
            </div>
          )}
          <FormField label="Full Name" error={errors.fullName?.message}>
            <Input
              type="text"
              placeholder="John Doe"
              {...register('fullName')}
              error={!!errors.fullName}
            />
          </FormField>
          <FormField label="Phone Number" error={errors.phoneNumber?.message}>
            <Input
              type="tel"
              placeholder="+251911234567"
              {...register('phoneNumber')}
              error={!!errors.phoneNumber}
            />
          </FormField>
          <FormField label="Email (optional)" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="john@example.com"
              {...register('email')}
              error={!!errors.email}
            />
          </FormField>
          <FormField label="Password" error={errors.password?.message}>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="SecurePass123"
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
          <FormField label="Confirm Password" error={errors.confirmPassword?.message}>
            <div className="relative">
              <Input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repeat your password"
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FormField>
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Create Account
          </Button>
        </CardContent>
      </form>
      <CardFooter className="justify-center">
        <p className="text-sm text-stone-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-amber-600 hover:text-amber-700">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
