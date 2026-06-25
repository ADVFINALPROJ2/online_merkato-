import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: { value: string; positive: boolean };
  iconClassName?: string;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, description, trend, iconClassName, className }: StatCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardContent className="flex items-start gap-4 pt-6">
        <div className={cn('rounded-full p-3 shrink-0', iconClassName || 'bg-stone-100')}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-stone-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-stone-900 tracking-tight">{value}</p>
          {(description || trend) && (
            <div className="mt-1 flex items-center gap-2">
              {trend && (
                <span className={cn('text-xs font-medium', trend.positive ? 'text-green-600' : 'text-red-600')}>
                  {trend.value}
                </span>
              )}
              {description && (
                <span className="text-xs text-stone-500 truncate">{description}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
