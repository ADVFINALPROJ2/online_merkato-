import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
}

interface DashboardTableProps<T> {
  title: string;
  description?: string;
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  viewAllHref?: string;
  className?: string;
}

export function DashboardTable<T>({
  title,
  description,
  columns,
  data,
  emptyMessage = 'No data available.',
  viewAllHref,
  className,
}: DashboardTableProps<T>) {
  return (
    <div className={cn('rounded-xl border border-stone-200 bg-white shadow-sm', className)}>
      <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
          {description && (
            <p className="text-xs text-stone-500 mt-0.5">{description}</p>
          )}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
          >
            View All
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="rounded-full bg-stone-100 p-3">
            <Package className="h-5 w-5 text-stone-400" />
          </div>
          <p className="text-sm text-stone-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      'px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500',
                      col.className,
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {data.map((item, i) => (
                <tr key={i} className="hover:bg-stone-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={cn('px-5 py-3 text-sm', col.className)}>
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
