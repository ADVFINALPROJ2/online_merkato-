'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-stone-900 group-[.toaster]:border group-[.toaster]:border-stone-200 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-stone-500',
          actionButton: 'group-[.toast]:bg-amber-600 group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-stone-100 group-[.toast]:text-stone-600',
        },
      }}
    />
  );
}
