'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shopService } from '@/services/shop-service';
import type { CreateShopDto, UpdateShopDto, ShopLocationDto } from '@/types/shop';

export function useMyShop() {
  return useQuery({
    queryKey: ['my-shop'],
    queryFn: () => shopService.getMyShop(),
    retry: false,
  });
}

export function useShopDashboard() {
  return useQuery({
    queryKey: ['shop-dashboard'],
    queryFn: () => shopService.getDashboard(),
    retry: false,
  });
}

export function useCreateShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateShopDto) => shopService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-shop'] });
      queryClient.invalidateQueries({ queryKey: ['shop-dashboard'] });
    },
  });
}

export function useUpdateShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateShopDto) => shopService.update(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-shop'] });
      queryClient.invalidateQueries({ queryKey: ['shop-dashboard'] });
    },
  });
}

export function useSetLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: ShopLocationDto) => shopService.setLocation(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-shop'] });
    },
  });
}
