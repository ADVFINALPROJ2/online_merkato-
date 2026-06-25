'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, Folder, FolderOpen, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CategoryTreeNode } from '@/types/category';

interface CategoryTreeProps {
  nodes: CategoryTreeNode[];
  onDelete: (node: CategoryTreeNode) => void;
  className?: string;
}

function TreeNode({
  node,
  depth,
  onDelete,
}: {
  node: CategoryTreeNode;
  depth: number;
  onDelete: (node: CategoryTreeNode) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 1);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2.5 transition-colors hover:bg-stone-50 group',
          depth > 0 && 'ml-6',
        )}
        style={{ marginLeft: depth > 0 ? `${depth * 1.5}rem` : undefined }}
      >
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="p-0.5 text-stone-400 hover:text-stone-600"
        >
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <span className="w-5" />
          )}
        </button>

        {expanded ? (
          <FolderOpen className="h-4 w-4 text-amber-500 shrink-0" />
        ) : (
          <Folder className="h-4 w-4 text-amber-500 shrink-0" />
        )}

        <span className="flex-1 text-sm font-medium text-stone-900 truncate">
          {node.name}
        </span>

        <div className="flex items-center gap-2">
          {node._count.products > 0 && (
            <Badge variant="outline" className="text-xs px-2 py-0">
              {node._count.products} products
            </Badge>
          )}
          {node._count.children > 0 && (
            <span className="text-xs text-stone-400">
              {node._count.children} sub
            </span>
          )}
        </div>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/categories/${node.id}/edit`}>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Edit className="h-3.5 w-3.5" />
              <span className="sr-only">Edit</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => onDelete(node)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>

      {expanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoryTree({ nodes, onDelete, className }: CategoryTreeProps) {
  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="rounded-full bg-stone-100 p-4">
          <Folder className="h-8 w-8 text-stone-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-stone-900">No categories yet</h3>
          <p className="mt-1 text-sm text-stone-500">
            Create your first category to organize products.
          </p>
        </div>
        <Link href="/categories/new">
          <Button>
            <Plus className="h-4 w-4" />
            Create Category
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border border-stone-200 bg-white shadow-sm', className)}>
      <div className="border-b border-stone-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
          Category Hierarchy
        </h3>
      </div>
      <div className="p-2">
        {nodes.map((node) => (
          <TreeNode key={node.id} node={node} depth={0} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
