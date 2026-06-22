import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">{title}</h1>
      {description && (
        <p className="mt-1 text-stone-500">{description}</p>
      )}
    </div>
  );
}
