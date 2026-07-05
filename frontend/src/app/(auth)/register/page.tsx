'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Store, ShoppingBag, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().min(8, 'Enter a valid phone number'),
  email: z.string().email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Must include lowercase')
    .regex(/[A-Z]/, 'Must include uppercase')
    .regex(/[0-9]/, 'Must include number'),
  role: z.enum(['BUYER', 'SELLER', 'DELIVERY']),
});

type RegisterForm = z.infer<typeof registerSchema>;

const ROLES = [
  { value: 'BUYER', label: 'Buyer', icon: ShoppingBag },
  { value: 'SELLER', label: 'Seller', icon: Store },
  { value: 'DELIVERY', label: 'Delivery', icon: Truck },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const [serverError, setServerError] = useState('');
  const [selectedRole, setSelectedRole] =
    useState<'BUYER' | 'SELLER' | 'DELIVERY'>('BUYER');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  
  });

  // Sync selected role with form
  useEffect(() => {
    setValue('role', selectedRole);
  }, [selectedRole, setValue]);

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

      const redirectMap = {
        BUYER: '/buyer',
        SELLER: '/dashboard',
        DELIVERY: '/delivery',
      };

      router.push(redirectMap[user.role as keyof typeof redirectMap]);
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {serverError && (
            <div className="text-red-600 text-sm">{serverError}</div>
          )}

          {/* ROLE SELECTION */}
          <div className="grid grid-cols-3 gap-2">
  {ROLES.map((role) => {
    const Icon = role.icon;

    return (
      <button
        key={role.value}
        type="button"
        onClick={() => {
          setSelectedRole(role.value);

          if (role.value === 'DELIVERY') {
            router.push('/driver-register');
          }
        }}
        className={`border rounded-xl p-3 flex flex-col items-center justify-center transition-all
          ${
            selectedRole === role.value
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-gray-300 hover:border-black'
          }`}
      >
        <Icon size={20} />
        <span className="text-xs mt-1">{role.label}</span>
      </button>
    );
  })}
</div>

          {/* FORM FIELDS */}
          <Input {...register('fullName')} placeholder="Full Name" />
          <p className="text-xs text-red-500">{errors.fullName?.message}</p>

          <Input {...register('email')} placeholder="Email" />
          <p className="text-xs text-red-500">{errors.email?.message}</p>

          <Input {...register('phoneNumber')} placeholder="Phone Number" />
          <p className="text-xs text-red-500">{errors.phoneNumber?.message}</p>

          <Input
            type="password"
            {...register('password')}
            placeholder="Password"
          />
          <p className="text-xs text-red-500">{errors.password?.message}</p>

          {/* SUBMIT */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}