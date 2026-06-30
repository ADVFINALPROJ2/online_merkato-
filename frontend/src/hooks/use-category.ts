'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/category-service';
import type { CreateCategoryDto, UpdateCategoryDto, Category, CategoryTreeNode } from '@/types/category';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategoryTree() {
  return useQuery({
    queryKey: ['categories', 'tree'],
    queryFn: () => categoryService.getTree(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCategoryDto) => categoryService.create(dto),
    onMutate: async (dto) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });
      await queryClient.cancelQueries({ queryKey: ['categories', 'tree'] });

      const previous = queryClient.getQueryData<Category[]>(['categories']);

      const optimistic: Category = {
        id: `temp-${Date.now()}`,
        name: dto.name,
        description: dto.description || null,
        parentId: dto.parentId || null,
        parent: null,
        children: [],
        _count: { products: 0, children: 0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Category[]>(['categories'], (old) =>
        old ? [...old, optimistic] : [optimistic],
      );

      return { previous };
    },
    onError: (_err, _dto, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['categories'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', 'tree'] });
    },
  });
}

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateCategoryDto) => categoryService.update(id, dto),
    onMutate: async (dto) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });
      await queryClient.cancelQueries({ queryKey: ['category', id] });
      await queryClient.cancelQueries({ queryKey: ['categories', 'tree'] });

      const previous = queryClient.getQueryData<Category[]>(['categories']);

      queryClient.setQueryData<Category[]>(['categories'], (old) =>
        old?.map((cat) =>
          cat.id === id
            ? { ...cat, ...dto, parent: dto.parentId ? cat.parent : null }
            : cat,
        ),
      );

      return { previous };
    },
    onError: (_err, _dto, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['categories'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', id] });
      queryClient.invalidateQueries({ queryKey: ['categories', 'tree'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.remove(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });
      await queryClient.cancelQueries({ queryKey: ['categories', 'tree'] });

      const previous = queryClient.getQueryData<Category[]>(['categories']);

      queryClient.setQueryData<Category[]>(['categories'], (old) =>
        old?.filter((cat) => cat.id !== id),
      );

      return { previous };
    },
    onError: (_err, _dto, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['categories'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', 'tree'] });
    },
  });
}

export function useFlattenedCategories() {
  const { data: categories, ...rest } = useCategories();

  const flattened = categories?.reduce<{ id: string; name: string; parentId: string | null }[]>(
    (acc, cat) => {
      acc.push({ id: cat.id, name: cat.name, parentId: cat.parentId });
      return acc;
    },
    [],
  );

  return { data: flattened, ...rest };
}
