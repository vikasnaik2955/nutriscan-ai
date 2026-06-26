import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi, type AddProductRequest } from '@/lib/api/admin';
import type { AdminProduct, AdminUser } from '@/lib/api/mockAdmin';

const keys = {
  stats: ['admin', 'stats'] as const,
  users: ['admin', 'users'] as const,
  products: ['admin', 'products'] as const,
};

export function useAdminStats() {
  return useQuery({ queryKey: keys.stats, queryFn: adminApi.stats });
}

export function useAdminUsers() {
  return useQuery({ queryKey: keys.users, queryFn: adminApi.listUsers });
}

export function useToggleUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.toggleUser(id),
    onSuccess: (users: AdminUser[]) => qc.setQueryData(keys.users, users),
  });
}

export function useAdminProducts() {
  return useQuery({ queryKey: keys.products, queryFn: adminApi.listProducts });
}

export function useAddProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: AddProductRequest) => adminApi.addProduct(req),
    onSuccess: (products: AdminProduct[]) => {
      qc.setQueryData(keys.products, products);
      void qc.invalidateQueries({ queryKey: keys.stats });
    },
  });
}

export function useRemoveProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.removeProduct(id),
    onSuccess: (products: AdminProduct[]) => {
      qc.setQueryData(keys.products, products);
      void qc.invalidateQueries({ queryKey: keys.stats });
    },
  });
}
