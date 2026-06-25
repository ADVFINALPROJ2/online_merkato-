'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/product-service';
import type { CreateProductDto, UpdateProductDto, Product, ProductStatus } from '@/types/product';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateProductDto) => productService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['shop-dashboard'] });
    },
  });
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateProductDto) => productService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      queryClient.invalidateQueries({ queryKey: ['shop-dashboard'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.remove(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });

      const previous = queryClient.getQueryData<Product[]>(['products']);

      queryClient.setQueryData<Product[]>(['products'], (old) =>
        old?.filter((p) => p.id !== id),
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['products'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['shop-dashboard'] });
    },
  });
}

export function useUpdateProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      productService.updateStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });

      const previous = queryClient.getQueryData<Product[]>(['products']);

      queryClient.setQueryData<Product[]>(['products'], (old) =>
        old?.map((p) => (p.id === id ? { ...p, status: status as ProductStatus } : p)),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['products'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['shop-dashboard'] });
    },
  });
}

export function useUpdateProductQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      productService.updateQuantity(id, quantity),
    onMutate: async ({ id, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });

      const previous = queryClient.getQueryData<Product[]>(['products']);

      const newStatus = quantity === 0 ? 'OUT_OF_STOCK' as ProductStatus : undefined;

      queryClient.setQueryData<Product[]>(['products'], (old) =>
        old?.map((p) =>
          p.id === id
            ? { ...p, quantity, ...(newStatus ? { status: newStatus } : {}) }
            : p,
        ),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['products'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['shop-dashboard'] });
    },
  });
}

export function useUpdateProductPrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, price }: { id: string; price: number }) =>
      productService.updatePrice(id, price),
    onMutate: async ({ id, price }) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });

      const previous = queryClient.getQueryData<Product[]>(['products']);

      queryClient.setQueryData<Product[]>(['products'], (old) =>
        old?.map((p) => (p.id === id ? { ...p, price } : p)),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['products'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['shop-dashboard'] });
    },
  });
}
