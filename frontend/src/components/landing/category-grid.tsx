'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';

const iconMap: Record<string, string> = {
  Book: '📚',
  Cloth: '👕',
  Cosmotics: '💄',
  Drink: '🥤',
  Electronics: '📱',
  Food: '🍔',
};

export const CategoryGrid = () => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    api.get('/buyer/categories')
      .then(res => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 my-8">
      {categories.map((cat) => (
        <Link key={cat.id} href={`/search?categoryId=${cat.id}`}className="flex flex-col items-center p-4 bg-white rounded-xl border hover:border-blue-200 transition-colors">
          <span className="text-3xl mb-2">{iconMap[cat.name.trim()] || '📦'}</span>
          <span className="text-sm font-medium">{cat.name}</span>
        </Link>
      ))}
    </div>
  );
};
