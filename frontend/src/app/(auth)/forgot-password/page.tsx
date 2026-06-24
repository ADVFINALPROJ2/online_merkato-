'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Store, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';

const forgotSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (_data: ForgotForm) => {
    // TODO: Call auth service for password reset
    setSent(true);
  };

  if (sent) {
    return (
      <Card className="w-full">
        <CardHeader className="items-center text-center">
          <div className="rounded-full bg-teal-100 p-3 mb-2">
            <Mail className="h-6 w-6 text-teal-600" />
          </div>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            If an account exists, we&apos;ve sent password reset instructions.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/login">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="items-center text-center">
        <div className="rounded-full bg-amber-100 p-3 mb-2">
          <Store className="h-6 w-6 text-amber-600" />
        </div>
        <CardTitle>Forgot password?</CardTitle>
        <CardDescription>Enter your email and we&apos;ll send you a reset link</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <FormField label="Email" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              error={!!errors.email}
            />
          </FormField>
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Send Reset Link
          </Button>
        </CardContent>
      </form>
      <CardFooter className="justify-center">
        <Link href="/login" className="flex items-center gap-1 text-sm text-stone-500 hover:text-amber-600 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </CardFooter>
    </Card>
  );
}
