import Link from 'next/link';
import { Plus, FolderTree, Settings, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface QuickAction {
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
  iconClassName: string;
}

const actions: QuickAction[] = [
  {
    label: 'Add Product',
    description: 'List a new product in your shop',
    href: '/products/new',
    icon: Package,
    iconClassName: 'bg-blue-100 text-blue-600',
  },
  {
    label: 'Create Category',
    description: 'Organize products with categories',
    href: '/categories/new',
    icon: FolderTree,
    iconClassName: 'bg-purple-100 text-purple-600',
  },
  {
    label: 'Edit Shop',
    description: 'Update your shop profile',
    href: '/shop/edit',
    icon: Settings,
    iconClassName: 'bg-amber-100 text-amber-600',
  },
];

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <Card className={cn('', className)}>
      <CardContent className="pt-6">
        <h3 className="text-sm font-semibold text-stone-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-start gap-3 rounded-lg border border-stone-200 p-4 hover:border-amber-200 hover:bg-amber-50/50 transition-all"
              >
                <div className={cn('rounded-full p-2.5 shrink-0', action.iconClassName)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-900 group-hover:text-amber-700 transition-colors">
                    {action.label}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
