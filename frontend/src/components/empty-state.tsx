import { cn } from '@/lib/utils';
import { PackageOpen } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 py-16 text-center', className)}>
      <div className="rounded-full bg-stone-100 p-4">
        {icon || <PackageOpen className="h-8 w-8 text-stone-400" />}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-stone-500 max-w-sm">{description}</p>
        )}
      </div>
      {action && (
        <Link href={action.href}>
          <Button variant="default" size="sm">{action.label}</Button>
        </Link>
      )}
    </div>
  );
}
