'use client';

import { type ReactNode } from 'react';
import { Label } from './label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, error, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label>{label}</Label>}
      {children}
      {error && (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
